'use client';

import Image from "next/image";
import * as React from 'react';
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { User2Icon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { SpinnerIcon } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserAvatarCard({userImageUrl, userId}:{userImageUrl?: Id<"_storage">, userId: Id<"users">}) {

  const [loading, setLoading] = React.useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const uploadImage = useMutation(api.storage.uploadUserImage);

  const imageInput = React.useRef<HTMLInputElement>(null);
  const cancelButton = React.useRef<HTMLButtonElement>(null);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const imageUrl = useQuery(api.storage.getFileUrl, { storageId: userImageUrl})

  async function handleUpdateUserImage(event: React.FormEvent) {
    setLoading(true);
    event.preventDefault();

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedImage!.type },
      body: selectedImage,
    });
    const { storageId } = await result.json();
    // Step 3: Save the newly allocated storage id to the database
    await uploadImage({ storageId: storageId, userId: userId, prevStorageId: userImageUrl });

    setPreviewUrl(null);
    URL.revokeObjectURL(previewUrl!);
    setSelectedImage(null);
    imageInput.current!.value = "";
    setLoading(false)
  }

  return (
    <form
      onSubmit={(e) => {handleUpdateUserImage(e)}}
      className="border bg-primary-foreground dark:bg-background rounded-lg"
    >
      <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
        <h3 className="font-medium text-lg">Display Picture</h3>
        <p className="text-sm">Click on the avatar to upload a new one. Be sure to use a professional photo with a clear view of your face.</p>
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            setSelectedImage(file);
            setPreviewUrl(file ? URL.createObjectURL(file) : null);
          }}
          // disabled={selectedImage !== null}
          className="hidden"
        />
        <button ref={cancelButton} type="reset" className="hidden"></button>
        {previewUrl ?
          <Image
            src={previewUrl}
            alt="Preview"
            width={100}
            height={100}
            onClick={() => imageInput.current?.click()}
            className="size-24 border rounded-full"
          />
          :
          <>
            {imageUrl  ?
              <Avatar
                onClick={() => imageInput.current?.click()}
                className="size-24 border hover:bg-muted/50"
              >
                <AvatarImage alt="avatar" src={previewUrl || imageUrl || undefined} />
                <AvatarFallback><User2Icon /></AvatarFallback>
              </Avatar>
              :
              <Avatar
                onClick={() => imageInput.current?.click()}
                className="size-24 border hover:bg-muted/50"
              >
                <AvatarFallback><User2Icon /></AvatarFallback>
              </Avatar>
            }
          </>
        }
      </div>
      <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
        <p className="text-sm text-muted-foreground">
          A display picture is optional but strongly recommended.
        </p>
        <Button type="submit" value="Send Image" size="sm" disabled={selectedImage === null}>
          {loading ? <div className="flex gap-2"><SpinnerIcon />Uploading</div> : 'Save'}
        </Button>
      </div>
    </form>
  )
}