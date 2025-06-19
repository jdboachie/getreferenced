'use client';

// TODO: build reusable file card components

import * as React from 'react';
import Loading from '../loading';
import { useRole } from '@/hooks/use-role';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button"
import { useIsMobile } from '@/hooks/use-mobile';
import { SpinnerIcon } from '@/components/icons';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from "convex/react";
import { profileCardStyles } from '../components/styles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { DocumentUploadCard } from '../components/document-upload-card';


export default function Page() {

  const { role } = useRole();
  const endPoint = role === "recommender" ? api.users.getRecommenderProfile : api.users.getRequesterProfile
  const profile = useQuery(endPoint) ;

  if (profile){
    return (
      <div className="flex flex-col gap-12">
        {role === 'requester' &&
          <>
            {"cvFile" in profile ?
              <CVCard userId={profile?.userId} cvFileId={profile.cvFile} />
              :
              <CVCard userId={profile?.userId} />
            }
          </>
        }
        {role === 'requester' &&
          <>
            {"transcriptFile" in profile ?
              <TranscriptCard userId={profile?.userId} transcriptFileId={profile.transcriptFile} />
              :
              <TranscriptCard userId={profile?.userId} />
            }
          </>
        }
        {role === 'requester' &&
          <>
            {"certificateFile" in profile ?
              <CertificateCard userId={profile?.userId} certificateFileId={profile.certificateFile} />
              :
              <CertificateCard userId={profile?.userId} />
            }
          </>
        }
        {role === "recommender" && 'We are working on this for you. Please check back later.'}
      </div>
    )
  } else {
    return <Loading />
  }
}


function CertificateCard({
  userId,
  certificateFileId,
}: {
  userId: Id<"users">
  certificateFileId?: Id<"_storage">
}) {
  const isMobile = useIsMobile()
  const deleteFile = useMutation(api.storage.deleteFile);
  const uploadCertificate = useMutation(api.users.updateUserProfile)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)

  const cvFileUrl = useQuery(api.storage.getFileUrl, { src: certificateFileId })
  const fileMetadata = useQuery(api.storage.getMetadata, {
    storageId: certificateFileId,
  })

  const fileInput = React.useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null)

  async function handleUploadCertificate(file: File) {
    if (certificateFileId) {
      await deleteFile({ storageId: certificateFileId });
    }
    const postUrl = await generateUploadUrl()

    const xhr = new XMLHttpRequest()
    xhr.open("POST", postUrl, true)
    xhr.setRequestHeader("Content-Type", file.type)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)
        setUploadProgress(percent)
      }
    }

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const { storageId } = JSON.parse(xhr.responseText)
        await uploadCertificate({
          role: "requester",
          userId,
          certificateFile: storageId,
        })
        setSelectedFile(null)
        setUploadProgress(null)
        if (fileInput.current) fileInput.current.value = ""
      } else {
        alert("Upload failed")
        setUploadProgress(null)
      }
    }

    xhr.onerror = () => {
      alert("Upload error")
      setUploadProgress(null)
    }

    xhr.send(file)
  }

  return (
    <div id="certificate" className={profileCardStyles.card}>
      <div className={profileCardStyles.cardContent}>
        <h3 className="font-medium text-lg">Certificate</h3>
        <p className="text-sm">Your most recent graduation certificate.</p>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger disabled={isMobile} value="preview">
              Preview
            </TabsTrigger>
          </TabsList>
          <div className="h-fit rounded-md bg-ground dark:bg-background">
            <TabsContent value="preview" className="grid">
              <div className="grid h-[400px] relative">
                {cvFileUrl ? (
                  <iframe
                    src={cvFileUrl}
                    className="rounded-md w-full h-full border"
                  />
                ) : (
                  <p className="p-4 grid place-items-center text-muted-foreground">
                    No preview available
                  </p>
                )}
              </div>
            </TabsContent>
            <TabsContent
              value="details"
              className="p-4 grid gap-1 text-sm"
            >
              <div className="flex gap-4">
                <div className="min-w-24 text-muted-foreground">Last updated</div>
                {fileMetadata?._creationTime ? (
                  <p className="text-primary">
                    {new Date(fileMetadata._creationTime).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                ) : (
                  <>-</>
                )}
              </div>
              <div className="flex gap-4">
                <div className="min-w-24 text-muted-foreground">File type</div>
                {fileMetadata?.contentType ? (
                  <p className="text-primary">
                    {fileMetadata.contentType.split("/")[1]}
                  </p>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex gap-4">
                <div className="min-w-24 text-muted-foreground">Size</div>
                {fileMetadata?.size ? (
                  <p className="text-primary">
                    {(fileMetadata.size / 1024).toFixed(1)} KB
                  </p>
                ) : (
                  "-"
                )}
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
            accept="application/pdf"
            ref={fileInput}
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (file) {
                setSelectedFile(file)
              }
            }}
          />
          {uploadProgress && (
              <div className="w-full h-2 bg-muted rounded-md overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
          )}
          {!uploadProgress &&
            <div className="flex flex-wrap items-center w-full truncate justify-end gap-2">
              {selectedFile && <p className='text-wrap text-sm'><span className='text-muted-foreground mr-2'>Selected file:</span>{selectedFile.name}</p>}
              {selectedFile ? (
                <div className='flex gap-2'>
                  <Button type="button" size="sm" variant="default" onClick={() => handleUploadCertificate(selectedFile)}>
                    Upload
                  </Button>
                  <Button type="reset" size="sm" variant={'outline'} onClick={() => setSelectedFile(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => fileInput.current?.click()}
                >
                  Choose file
                </Button>
              )}
            </div>
          }
        </form>
      </div>
    </div>
  )
}

function CVCard ({userId, cvFileId}:{userId: Id<"users">, cvFileId?: Id<"_storage">}) {

  const isMobile = useIsMobile()

  const uploadCV = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const cvFileUrl = useQuery(api.storage.getFileUrl, { src: cvFileId })
  const fileMetadata = useQuery(api.storage.getMetadata, { storageId: cvFileId })

  const fileInput = React.useRef<HTMLInputElement>(null);

  async function handleUploadCV(file: File) {
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    await uploadCV({
      role: 'requester',
      userId: userId,
      cvFile: storageId
    });

    fileInput.current!.value = "";
  }

  return (
    <div id='cv' className={profileCardStyles.card}>
      <div className={profileCardStyles.cardContent}>
        <h3 className="font-medium text-lg">Curriculum Vitae</h3>
        <p className="text-sm">Your CV gives recommenders a sense of your academic and professional background.</p>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger disabled={isMobile} value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="h-fit rounded-md bg-ground dark:bg-background">
            <TabsContent value="preview" className="grid">
              <div className='grid h-[400px] relative'>
                {cvFileUrl ?
                  <iframe src={cvFileUrl} className='rounded-md w-full h-full border' />
                  :
                  <p className='p-4 grid place-items-center text-muted-foreground'>No preview available</p>
                }
              </div>
            </TabsContent>
            <TabsContent value="details" className='p-4 grid gap-1 text-sm'>
              <div className='flex gap-4'>
                <div className="min-w-24 text-muted-foreground">Last updated</div>
                {fileMetadata?._creationTime ?
                  <p className="text-primary">
                    {new Date(fileMetadata._creationTime).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  :
                  <>-</>
                }
              </div>
              <div className='flex gap-4'>
                <div className="min-w-24 text-muted-foreground">File type</div>
                {fileMetadata?.contentType ? <p className='text-primary'>{fileMetadata.contentType.split('/')[1]}</p>: '-'}
              </div>
              <div className='flex gap-4'>
                <div className="min-w-24 text-muted-foreground">Size</div>
                {fileMetadata?.size ?
                  <p className="text-primary">
                    {(fileMetadata.size / 1024).toFixed(1)} KB
                  </p>
                  :
                  '-'
                }
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className={profileCardStyles.cardFooter}>
        <p className="text-sm text-muted-foreground">
          Last updated {fileMetadata?._creationTime ? <>{new Date(fileMetadata?._creationTime).toDateString()}</>:'never'}
        </p>
        <form>
          <input
            hidden
            type="file"
            accept="application/pdf"
            ref={fileInput}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleUploadCV(file);
              }
            }}
          />
          <Button
            type='button'
            size={'sm'}
            onClick={() => {
              fileInput.current?.click()
            }}
            value="Send file"
          >
            Upload
          </Button>
        </form>
      </div>
    </div>
  );
}

function TranscriptCard({ userId, transcriptFileId }: { userId: Id<"users">, transcriptFileId?: Id<"_storage"> }) {
  const isMobile = useIsMobile()
  const fileInput = React.useRef<HTMLInputElement>(null);

  const [status, setStatus] = React.useState<"loading" | null>(null)

  const uploadTranscript = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const fileMetadata = useQuery(api.storage.getMetadata, { storageId: transcriptFileId });
  const transcriptFileUrl = useQuery(api.storage.getFileUrl, { src: transcriptFileId });


  async function handleUploadTranscript(file: File) {
    setStatus('loading')
    const postUrl = await generateUploadUrl();
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = await result.json();
    await uploadTranscript({
      role: 'requester',
      userId: userId,
      transcriptFile: storageId
    });

    fileInput.current!.value = "";
    setStatus(null)
  }

  return (
    <div id='transcript' className={profileCardStyles.card}>
      <div className={profileCardStyles.cardContent}>
        <h3 className="font-medium text-lg">Transcript</h3>
        <p className="text-sm">Your academic transcript gives recommenders insight into your academic history and achievements.</p>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger disabled={isMobile} value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="h-fit rounded-md bg-ground dark:bg-background">
            <TabsContent value="preview" className="grid">
              <div className='grid h-[400px] relative'>
                {transcriptFileUrl ?
                  <iframe src={transcriptFileUrl} className='rounded-md w-full h-full border' />
                  :
                  <p className='p-4 grid place-items-center text-muted-foreground'>No preview available</p>
                }
              </div>
            </TabsContent>
            <TabsContent value="details" className='p-4 grid gap-1 text-sm'>
              <div className='flex gap-4'>
                <div className="min-w-24 text-muted-foreground">Last updated</div>
                {fileMetadata?._creationTime ?
                  <p className="text-primary">
                    {new Date(fileMetadata._creationTime).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                  :
                  <>-</>
                }
              </div>
              <div className='flex gap-4'>
                <div className="min-w-24 text-muted-foreground">File type</div>
                {fileMetadata?.contentType ? <p className='text-primary'>{fileMetadata.contentType.split('/')[1]}</p> : '-'}
              </div>
              <div className='flex gap-4'>
                <div className="min-w-24 text-muted-foreground">Size</div>
                {fileMetadata?.size ?
                  <p className="text-primary">
                    {(fileMetadata.size / 1024).toFixed(1)} KB
                  </p>
                  :
                  '-'
                }
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className={profileCardStyles.cardFooter}>
        <p className="text-sm text-muted-foreground">
          Last updated {fileMetadata?._creationTime ? <>{new Date(fileMetadata?._creationTime).toDateString()}</>:'never'}
        </p>
        <form>
          <input
            hidden
            type="file"
            accept="application/pdf"
            ref={fileInput}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleUploadTranscript(file);
              }
            }}
          />
          <Button
            type='button'
            size={'sm'}
            onClick={() => {
              fileInput.current?.click();
            }}
            value="Send file"
          >
            {!status && 'Upload'}
            {status === "loading" && <div className='flex items-center gap-1'><SpinnerIcon/> Uploading file...</div>}
          </Button>
        </form>
      </div>
    </div>
  );
}
