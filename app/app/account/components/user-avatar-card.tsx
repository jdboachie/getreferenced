'use client';

import * as React from 'react';
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { User2Icon } from "lucide-react";
import { profileCardStyles } from "./styles";
import { SpinnerIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function UserAvatarCard({userImageUrl, userId}:{userImageUrl?: Id<"_storage"> | string, userId: Id<"users">}) {

  const [loading, setLoading] = React.useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const uploadImage = useMutation(api.storage.uploadUserImage);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);

  const imageInput = React.useRef<HTMLInputElement>(null);
  const cancelButton = React.useRef<HTMLButtonElement>(null);
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const imageUrl = useQuery(api.storage.getFileUrl, { src: userImageUrl })

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
      className={profileCardStyles.card}
    >
      <div className={profileCardStyles.cardContent}>
        <div className="flex flex-col gap-2">
          <h3>Display Picture</h3>
          <p className="text-sm">Click on the avatar to upload a new one. Use a professional photo with a clear view of your face.</p>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={imageInput}
          onChange={(event) => {
            const file = event.target.files?.[0] || null;
            setSelectedImage(file);
            setPreviewUrl(file ? URL.createObjectURL(file) : null);
          }}
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
      <div className={profileCardStyles.cardFooter}>
        <p className="text-sm text-muted-foreground">
          A display picture is optional but strongly recommended.
        </p>
        <div>
          <Button type="submit" value="Send Image" size="sm" disabled={selectedImage === null}>
            {loading ? <div className="flex gap-2"><SpinnerIcon />Uploading</div> : 'Save changes'}
          </Button>
        </div>
      </div>
    </form>
  )
}