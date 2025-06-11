'use client';

import * as React from 'react';
import Loading from '../loading';
import { useRole } from '@/hooks/use-role';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button"
import { useIsMobile } from '@/hooks/use-mobile';
import { SpinnerIcon } from '@/components/icons';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { profileCardStyles } from '../components/styles';


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
      </div>
    )
  } else {
    return <Loading />
  }
}


function CertificateCard ({userId, certificateFileId}:{userId: Id<"users">, certificateFileId?: Id<"_storage">}) {

  const isMobile = useIsMobile()

  const uploadCertificate = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const cvFileUrl = useQuery(api.storage.getFileUrl, { storageId: certificateFileId})
  const fileMetadata = useQuery(api.storage.getMetadata, { storageId: certificateFileId })

  const fileInput = React.useRef<HTMLInputElement>(null);

  async function handleUploadCertificate(file: File) {
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
    await uploadCertificate({
      role: 'requester',
      userId: userId,
      certificateFile: storageId
    });

    fileInput.current!.value = "";
  }

  return (
    <div id='cv' className={profileCardStyles.card}>
      <div className={profileCardStyles.cardContent}>
        <h3 className="font-medium text-lg">Certificate</h3>
        <p className="text-sm">Your most recent graduation certificate.</p>
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
                handleUploadCertificate(file);
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

function CVCard ({userId, cvFileId}:{userId: Id<"users">, cvFileId?: Id<"_storage">}) {

  const isMobile = useIsMobile()

  const uploadCV = useMutation(api.users.updateUserProfile);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const cvFileUrl = useQuery(api.storage.getFileUrl, { storageId: cvFileId})
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
        <p className="text-sm">Your CV gives recommenders a sense of your academic and professional background, and helps them write a more personalized letter.</p>
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
  const transcriptFileUrl = useQuery(api.storage.getFileUrl, { storageId: transcriptFileId });


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
