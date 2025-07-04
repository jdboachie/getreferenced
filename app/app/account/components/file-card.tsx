'use client';

import * as React from 'react';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useIsMobile } from '@/hooks/use-mobile';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from "convex/react";
import { profileCardStyles } from '../components/styles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadIcon } from 'lucide-react';
import { FilePdfIcon } from '@phosphor-icons/react';

type FileType = "cv" | "transcript" | "certificate";

const fileTypeConfig: Record<FileType, {
  label: string;
  description: string;
  fileKey: string;
  updateKey: string;
  accept: string;
}> = {
  cv: {
    label: "Curriculum Vitae",
    description: "Your CV gives recommenders a sense of your academic and professional background.",
    fileKey: "cvFile",
    updateKey: "cvFile",
    accept: "application/pdf",
  },
  transcript: {
    label: "Transcript",
    description: "Your academic transcript gives recommenders insight into your academic history and achievements.",
    fileKey: "transcriptFile",
    updateKey: "transcriptFile",
    accept: "application/pdf",
  },
  certificate: {
    label: "Certificate",
    description: "Your most recent graduation certificate.",
    fileKey: "certificateFile",
    updateKey: "certificateFile",
    accept: ".pdf,.docx",
  },
};

type FileCardProps = {
  userId: Id<"users">;
  fileId?: Id<"_storage">;
  type: FileType;
};

function FileCard({ userId, fileId, type }: FileCardProps) {
  const isMobile = useIsMobile();
  const deleteFile = useMutation(api.storage.deleteFile);
  const updateProfile = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const fileUrl = useQuery(api.storage.getFileUrl, { src: fileId });
  const fileMetadata = useQuery(api.storage.getMetadata, { storageId: fileId });

  const fileInput = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);

  async function handleUpload(file: File) {
    if (fileId) {
      await deleteFile({ storageId: fileId });
    }
    const postUrl = await generateUploadUrl();

    const xhr = new XMLHttpRequest();
    xhr.open("POST", postUrl, true);
    xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const { storageId } = JSON.parse(xhr.responseText);
        await updateProfile({
          role: "requester",
          userId,
          [fileTypeConfig[type].updateKey]: storageId,
        });
        setSelectedFile(null);
        setUploadProgress(null);
        if (fileInput.current) fileInput.current.value = "";
      } else {
        alert("Upload failed");
        setUploadProgress(null);
      }
    };

    xhr.onerror = () => {
      alert("Upload error");
      setUploadProgress(null);
    };

    xhr.send(file);
  }

  return (
    <div id={type} className={profileCardStyles.card}>
      <div className={profileCardStyles.cardContent}>
        <div className="flex flex-col gap-2">
          <h3>{fileTypeConfig[type].label}</h3>
          <p className="text-sm">{fileTypeConfig[type].description}</p>
        </div>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger disabled={isMobile} value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="h-fit rounded-md bg-ground dark:bg-background">
            <TabsContent value="preview" className="grid">
              <div className="grid h-[400px] relative">
                {fileUrl ? (
                  <iframe src={fileUrl} className="rounded-md w-full h-full border" />
                ) : (
                  <p className="p-4 grid place-items-center text-muted-foreground">No preview available</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="details" className="p-4 grid gap-1 text-sm">
              <div className="flex gap-4">
                <div className="min-w-22 text-muted-foreground">Last updated</div>
                {fileMetadata?._creationTime ? (
                  <p className="text-foreground">
                    {new Date(fileMetadata._creationTime).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                ) : "-"}
              </div>
              <div className="flex gap-4">
                <div className="min-w-22 text-muted-foreground">File type</div>
                {fileMetadata?.contentType ? (
                  <p className="flex items-center gap-1 text-foreground">
                    <FilePdfIcon />
                    {fileMetadata.contentType.split("/")[1]}
                  </p>
                ) : "-"}
              </div>
              <div className="flex gap-4">
                <div className="min-w-22 text-muted-foreground">Size</div>
                {fileMetadata?.size ? (
                  <p className="text-foreground">{(fileMetadata.size / 1024).toFixed(1)} KB</p>
                ) : "-"}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className={profileCardStyles.cardFooter}>
        <form className="flex grow justify-end items-center gap-2">
          <input
            hidden
            type="file"
            accept={fileTypeConfig[type].accept}
            ref={fileInput}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelectedFile(file);
            }}
          />
          {uploadProgress !== null ? (
            type === "transcript" ? (
              <div className='w-full h-8 gap-1 grid'>
                <div className='flex justify-between items-center text-sm'><span>Uploading...</span><p className="font-mono text-xs whitespace-nowrap">{uploadProgress}{" "}%</p></div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            ) : (
              <div className='flex items-center w-full h-8 py-3 gap-8'>
                <div className="w-full h-2 bg-muted rounded-md overflow-hidden border">
                  <div
                    className="h-full bg-primary transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="font-mono text-xs whitespace-nowrap">{uploadProgress}{" "}%</p>
              </div>
            )
          ) : (
            <div className="flex flex-wrap items-center w-full truncate justify-end gap-2">
              {selectedFile && (
                <p className="text-wrap text-sm">
                  <span className="text-muted-foreground mr-2">Selected file:</span>
                  {selectedFile.name}
                </p>
              )}
              {selectedFile ? (
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant={type === "certificate" ? "default" : "default"} onClick={() => handleUpload(selectedFile)}>
                    Upload
                  </Button>
                  <Button type="reset" size="sm" variant={type === "certificate" ? "outline" : "outline"} onClick={() => setSelectedFile(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button type="button" size="sm" onClick={() => fileInput.current?.click()}>
                  <UploadIcon />
                  {fileId ? 'Upload new' : 'Choose file'}
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export { FileCard, }