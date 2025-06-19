'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button"
import { useIsMobile } from '@/hooks/use-mobile';
import { api } from "@/convex/_generated/api";
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from "convex/react";
import { profileCardStyles } from './styles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


type Props = {
  userId: Id<"users">;
  fileId?: Id<"_storage">;
  fileKey: "cvFile" | "transcriptFile" | "certificateFile";
  label: string;
  description: string;
};

export function DocumentUploadCard({ userId, fileId, fileKey, label, description }: Props) {
  const isMobile = useIsMobile();
  const fileInput = React.useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null);

  const upload = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const fileUrl = useQuery(api.storage.getFileUrl, { src: fileId });
  const metadata = useQuery(api.storage.getMetadata, { storageId: fileId });

  async function handleUpload(file: File) {
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
        await upload({
          role: "requester",
          userId,
          [fileKey]: storageId,
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
    <div className={profileCardStyles.card}>
      <div className={profileCardStyles.cardContent}>
        <h3 className="font-medium text-lg">{label}</h3>
        <p className="text-sm">{description}</p>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger disabled={isMobile} value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="rounded-md bg-ground dark:bg-background">
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
                <div className="min-w-24 text-muted-foreground">Last updated</div>
                {metadata?._creationTime ? (
                  <p className="text-primary">
                    {new Date(metadata._creationTime).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex gap-4">
                <div className="min-w-24 text-muted-foreground">File type</div>
                {metadata?.contentType ? (
                  <p className="text-primary">{metadata.contentType.split("/")[1]}</p>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex gap-4">
                <div className="min-w-24 text-muted-foreground">Size</div>
                {metadata?.size ? (
                  <p className="text-primary">{(metadata.size / 1024).toFixed(1)} KB</p>
                ) : (
                  "-"
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className={profileCardStyles.cardFooter}>
        <p className="text-sm text-muted-foreground">
          Last updated {metadata?._creationTime ? new Date(metadata._creationTime).toDateString() : "never"}
        </p>
        <form className="flex grow justify-end items-center gap-2">
          <input
            hidden
            type="file"
            accept="application/pdf"
            ref={fileInput}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setSelectedFile(file);
            }}
          />
          {uploadProgress !== null && (
            <div className="w-full h-2 bg-muted rounded-md overflow-hidden">
              <div className="h-full bg-primary transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
          <div className="flex items-center w-full justify-end gap-2">
            {selectedFile && !uploadProgress ? (
              <Button size="sm" type="button" onClick={() => handleUpload(selectedFile)}>
                Upload {selectedFile.name}
              </Button>
            ) : (
              <Button size="sm" type="button" onClick={() => fileInput.current?.click()}>
                Choose file
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
