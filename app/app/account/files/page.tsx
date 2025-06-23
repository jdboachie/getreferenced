'use client';

// TODO: build reusable file card components

import * as React from 'react';
import Loading from '../loading';
import { useRole } from '@/hooks/use-role';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button"
import { useIsMobile } from '@/hooks/use-mobile';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from "convex/react";
import { profileCardStyles } from '../components/styles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadIcon } from 'lucide-react';


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
  const updateProfile = useMutation(api.users.updateUserProfile)
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
        await updateProfile({
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
        <div className="flex flex-col gap-4">
          <h2 className="font-medium text-xl">Certificate</h2>
          <p className="text-base">Your most recent graduation certificate.</p>
        </div>
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
                  <p className="text-foreground">
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
                  <p className="text-foreground">
                    {fileMetadata.contentType.split("/")[1]}
                  </p>
                ) : (
                  "-"
                )}
              </div>
              <div className="flex gap-4">
                <div className="min-w-24 text-muted-foreground">Size</div>
                {fileMetadata?.size ? (
                  <p className="text-foreground">
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
            <div className='flex items-center w-full h-8 py-3 gap-8'>
              <div className="w-full h-2 bg-muted rounded-md overflow-hidden border">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="font-mono text-xs whitespace-nowrap">{uploadProgress}{" "}%</p>
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
                <div className='flex gap-2'>
                  {/* {certificateFileId !== undefined &&
                    <Button
                      type='button'
                      variant={'outline'}
                      size={'sm'}
                      onClick={async () => {
                        if (certificateFileId) {
                          // await deleteFile({ storageId: certificateFileId });
                          await updateProfile({
                            userId,
                            role: "requester",
                            certificateFile: undefined
                            })
                        }
                      }}
                      className='text-destructive hover:text-destructive'
                    >
                      {certificateFileId}
                      <Trash2Icon />
                      Delete
                    </Button>
                  } */}
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => fileInput.current?.click()}
                  >
                    <UploadIcon />
                    {certificateFileId ? 'Upload new' : 'Choose file'}
                  </Button>
                </div>
              )}
            </div>
          }
        </form>
      </div>
    </div>
  )
}

function CVCard({ userId, cvFileId }: { userId: Id<"users">, cvFileId?: Id<"_storage"> }) {
  const isMobile = useIsMobile()
  const deleteFile = useMutation(api.storage.deleteFile)
  const uploadCV = useMutation(api.users.updateUserProfile)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)

  const fileInput = React.useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null)

  const cvFileUrl = useQuery(api.storage.getFileUrl, { src: cvFileId })
  const fileMetadata = useQuery(api.storage.getMetadata, { storageId: cvFileId })

  async function handleUploadCV(file: File) {
    if (cvFileId) {
      await deleteFile({ storageId: cvFileId })
    }
    const postUrl = await generateUploadUrl()

    const xhr = new XMLHttpRequest()
    xhr.open("POST", postUrl, true)
    xhr.setRequestHeader("Content-Type", file.type)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const { storageId } = JSON.parse(xhr.responseText)
        await uploadCV({ role: "requester", userId, cvFile: storageId })
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
    <div id="cv" className={profileCardStyles.card}>
      <div className={profileCardStyles.cardContent}>
        <div className="flex flex-col gap-4">
          <h2 className="font-medium text-xl">Curriculum Vitae</h2>
          <p className="text-base">Your CV gives recommenders a sense of your academic and professional background.</p>
        </div>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger disabled={isMobile} value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="h-fit rounded-md bg-ground dark:bg-background">
            <TabsContent value="preview" className="grid">
              <div className="grid h-[400px] relative">
                {cvFileUrl ? (
                  <iframe src={cvFileUrl} className="rounded-md w-full h-full border" />
                ) : (
                  <p className="p-4 grid place-items-center text-muted-foreground">No preview available</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="details" className="p-4 grid gap-1 text-sm">
              <div className="flex gap-4">
                <div className="min-w-24 text-muted-foreground">Last updated</div>
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
                <div className="min-w-24 text-muted-foreground">File type</div>
                {fileMetadata?.contentType ? <p className="text-foreground">{fileMetadata.contentType.split('/')[1]}</p> : "-"}
              </div>
              <div className="flex gap-4">
                <div className="min-w-24 text-muted-foreground">Size</div>
                {fileMetadata?.size ? <p className="text-foreground">{(fileMetadata.size / 1024).toFixed(1)} KB</p> : "-"}
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
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setSelectedFile(file)
            }}
          />
          {uploadProgress && (
            <div className='flex items-center w-full h-8 py-3 gap-8'>
              <div className="w-full h-2 bg-muted rounded-md overflow-hidden border">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="font-mono text-xs whitespace-nowrap">{uploadProgress}{" "}%</p>
            </div>
          )}
          {uploadProgress === null && (
            <div className="flex flex-wrap items-center w-full truncate justify-end gap-2">
              {selectedFile && (
                <p className="text-wrap text-sm">
                  <span className="text-muted-foreground mr-2">Selected file:</span>
                  {selectedFile.name}
                </p>
              )}
              {selectedFile ? (
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={() => handleUploadCV(selectedFile)}>
                    Upload
                  </Button>
                  <Button type="reset" size="sm" variant="outline" onClick={() => setSelectedFile(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button type="button" size="sm" onClick={() => fileInput.current?.click()}>
                  <UploadIcon />
                  {cvFileId ? 'Upload new' : 'Choose file'}
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

function TranscriptCard({ userId, transcriptFileId }: { userId: Id<"users">, transcriptFileId?: Id<"_storage"> }) {
  const isMobile = useIsMobile()
  const fileInput = React.useRef<HTMLInputElement>(null)

  const deleteFile = useMutation(api.storage.deleteFile)
  const uploadTranscript = useMutation(api.users.updateUserProfile)
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl)

  const transcriptFileUrl = useQuery(api.storage.getFileUrl, { src: transcriptFileId })
  const fileMetadata = useQuery(api.storage.getMetadata, { storageId: transcriptFileId })

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null)

  async function handleUploadTranscript(file: File) {
    if (transcriptFileId) {
      await deleteFile({ storageId: transcriptFileId })
    }

    const postUrl = await generateUploadUrl()

    const xhr = new XMLHttpRequest()
    xhr.open("POST", postUrl, true)
    xhr.setRequestHeader("Content-Type", file.type)

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100))
      }
    }

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const { storageId } = JSON.parse(xhr.responseText)
        await uploadTranscript({
          role: "requester",
          userId,
          transcriptFile: storageId,
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
    <div id="transcript" className={profileCardStyles.card}>
      <div className={profileCardStyles.cardContent}>
        <div className="flex flex-col gap-4">
          <h2 className="font-medium text-xl">Transcript</h2>
          <p className="text-base">
            Your academic transcript gives recommenders insight into your academic history and achievements.
          </p>
        </div>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger disabled={isMobile} value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="h-fit rounded-md bg-ground dark:bg-background">
            <TabsContent value="preview" className="grid">
              <div className="grid h-[400px] relative">
                {transcriptFileUrl ? (
                  <iframe src={transcriptFileUrl} className="rounded-md w-full h-full border" />
                ) : (
                  <p className="p-4 grid place-items-center text-muted-foreground">No preview available</p>
                )}
              </div>
            </TabsContent>
            <TabsContent value="details" className="p-4 grid gap-1 text-sm">
              <div className="flex gap-4">
                <div className="min-w-24 text-muted-foreground">Last updated</div>
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
                <div className="min-w-24 text-muted-foreground">File type</div>
                {fileMetadata?.contentType ? (
                  <p className="text-foreground">{fileMetadata.contentType.split("/")[1]}</p>
                ) : "-"}
              </div>
              <div className="flex gap-4">
                <div className="min-w-24 text-muted-foreground">Size</div>
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
            accept="application/pdf"
            ref={fileInput}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) setSelectedFile(file)
            }}
          />
          {uploadProgress && (
            <div className='flex items-center w-full h-8 py-3 gap-8'>
              <div className="w-full h-2 bg-muted rounded-md overflow-hidden border">
                <div
                  className="h-full bg-primary transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="font-mono text-xs whitespace-nowrap">{uploadProgress}{" "}%</p>
            </div>
          )}
          {uploadProgress === null && (
            <div className="flex flex-wrap items-center w-full truncate justify-end gap-2">
              {selectedFile && (
                <p className="text-wrap text-sm">
                  <span className="text-muted-foreground mr-2">Selected file:</span>
                  {selectedFile.name}
                </p>
              )}
              {selectedFile ? (
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={() => handleUploadTranscript(selectedFile)}>
                    Upload
                  </Button>
                  <Button type="reset" size="sm" variant="outline" onClick={() => setSelectedFile(null)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button type="button" size="sm" onClick={() => fileInput.current?.click()}>
                  <UploadIcon />
                  {transcriptFileId ? 'Upload new' : 'Choose file'}
                </Button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

