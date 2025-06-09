'use client';

import * as React from 'react';
import { api } from '@/convex/_generated/api';
import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "convex/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Id } from '@/convex/_generated/dataModel';
import Loading from '../loading';
import { useRole } from '@/hooks/use-role';


export default function Page() {

  const { role } = useRole();
  const endPoint = role === "recommender" ? api.users.getRecommenderProfile : api.users.getRequesterProfile
  const profile = useQuery(endPoint) ;

  if (profile){
    return (
      <div className="flex flex-col gap-12">
        {"cvFile" in profile &&
          <CVCard userId={profile?.userId} cvFileId={profile.cvFile} />
        }
      </div>
    )
  } else {
    return <Loading />
  }
}


function CVCard ({userId, cvFileId}:{userId: Id<"users">, cvFileId: Id<"_storage"> | undefined}) {
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
    <div className="border bg-primary-foreground dark:bg-background rounded-lg">
      <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
        <h3 className="font-medium text-lg">CV</h3>
        <p className="text-sm">Your Curriculum Vitae gives recommenders a sense of your academic and professional background, and helps them write a more personalized letter.</p>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="h-fit rounded-md bg-ground">
            <TabsContent value="preview" className="grid">
              <div className='grid h-[400px] relative'>
                {cvFileUrl ?
                  <iframe src={cvFileUrl} className='rounded-md w-full h-full border' />
                  :
                  <p>no preview available</p>
                }
              </div>
            </TabsContent>
            <TabsContent value="details" className='p-4 grid gap-1 text-sm'>
              <div className='sm:flex gap-4'><div className="min-w-24 text-muted-foreground">Last updated</div> <p className='text-primary'>{fileMetadata?._creationTime && <>{new Date(fileMetadata?._creationTime).toDateString()}</>}</p></div>
              <div className='sm:flex gap-4'><div className="min-w-24 text-muted-foreground">File type</div> <p className='text-primary'>{fileMetadata?.contentType}</p></div>
              <div className='sm:flex gap-4'><div className="min-w-24 text-muted-foreground">Size</div> <p className='text-primary'>{fileMetadata?.size}</p></div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
      <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
        <p className="text-sm text-muted-foreground">
          Last updated {fileMetadata?._creationTime && <>{new Date(fileMetadata?._creationTime).toDateString()}</>}
        </p>
        <form>
          <input
            hidden
            type="file"
            accept="pdf/*"
            ref={fileInput}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                handleUploadCV(file);
              }
            }}
          />
          <div className='border flex gap-2'>
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
          </div>
        </form>
      </div>
    </div>
  );
}