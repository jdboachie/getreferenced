'use client';

import { toast } from "sonner";
import * as React from 'react';
import Loading from "./loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { User2Icon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { SpinnerIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";

function Page() {
  const profile = useQuery(api.users.getUserProfile);
  const updateUser = useMutation(api.users.updateUser)

  if (profile && profile.user) {
    return (
      <div className="flex flex-col gap-12">

        <UserAvatarCard userImageUrl={profile.user.image} userId={profile.userId} />

        {/* Full Name */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const firstName = formData.get('firstName');
            const lastName = formData.get('lastName');
            toast.promise(
              updateUser({
              userId: profile.userId,
              firstName: firstName?.toString(),
              lastName: lastName?.toString()}
              ),
              {
                loading: 'Saving...',
                success: 'Name updated!',
                error: 'Problem updating name',
              }
            );
          }}
          className="border bg-primary-foreground dark:bg-background rounded-lg"
        >
          <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
            <h3 className="font-medium text-lg">Full Name</h3>
            <p className="text-sm">This will be the name on your requests</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">First name</span>
                <Input
                  name="firstName"
                  defaultValue={profile.user.firstName}
                  placeholder="Firstname"
                  className="max-md:w-full shadow-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">Last name</span>
                <Input
                  name="lastName"
                  defaultValue={profile.user.lastName}
                  placeholder="Lastname"
                  className="max-md:w-full shadow-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') e.preventDefault();
                  }}
                />
              </label>
            </div>
          </div>
          <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
            <p className="text-sm text-muted-foreground">
              Name should be as it appears on official documents.
            </p>
            <Button type="submit" size="sm">
              Save
            </Button>
          </div>
        </form>

        {/* Email */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Email change submitted");
          }}
          className="border bg-primary-foreground dark:bg-background rounded-lg"
        >
          <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
            <h3 className="font-medium text-lg">Email</h3>
            <p className="text-sm">
              This is the email address you will use to sign in to Recommendme.
            </p>
            <label htmlFor="email" className="relative w-full sm:max-w-sm">
              <Input
                readOnly
                name="email"
                defaultValue={profile.user.email}
                placeholder="Email"
                className="w-full shadow-none"
              />
              <Badge
                variant={profile.user.emailVerificationTime ? 'secondary' : 'destructive'}
                className={`pointer-events-none rounded-full absolute top-2 right-2.5 ${profile.user.emailVerificationTime && 'bg-green-400 dark:bg-green-500/80'}`}
              >
                {profile.user.emailVerificationTime ? 'verified' : 'not verified'}
              </Badge>
            </label>
          </div>
          <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
            <p className="text-sm text-muted-foreground">
              Email must be verified to be able to receive notifications.
            </p>
            <Button type="submit" disabled>Save</Button>
          </div>
        </form>

        {/* Phone Number */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            toast.promise(
              updateUser({
                userId: profile.userId,
                phone: formData.get('phone')?.toString(),
              }),
              {
                loading: 'Saving...',
                success: 'Phone number updated!',
                error: 'Problem updating phone number',
              }
            );
          }}
          className="border bg-primary-foreground dark:bg-background rounded-lg"
        >
          <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
            <h3 className="font-medium text-lg">Phone Number</h3>
            <p className="text-sm">Your Whatsapp number is preferred.</p>
              <label htmlFor="phone" className="relative w-full sm:max-w-sm">
                <Input
                  type="tel"
                  name="phone"
                  defaultValue={profile.user.phone}
                  placeholder="+233123456789"
                  className="w-full shadow-none"
                />
                <Badge
                  variant={profile.user.phoneVerificationTime ? 'secondary' : 'destructive'}
                  className={`pointer-events-none rounded-full absolute top-2 right-2.5 ${profile.user.phoneVerificationTime && 'bg-green-500'}`}
                >
                  {profile.user.phoneVerificationTime ? 'verified' : 'not verified'}
                </Badge>
              </label>
          </div>
          <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
            <p className="text-sm text-muted-foreground">
              {profile.user.phoneVerificationTime ??
                "Phone number must be verified to allow recommenders to contact you."}
            </p>
            <Button type="submit">Save</Button>
          </div>
        </form>

        {/* Delete Account */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Delete account triggered");
          }}
          className="border bg-primary-foreground dark:bg-background rounded-lg"
        >
          <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
            <h3 className="font-medium text-lg">Delete Account</h3>
            <p className="text-sm">
              Permanently remove your account and all its contents from the Recommendme
              platform. This action is not reversible, so please continue with caution.
            </p>
          </div>
          <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
            <p className="text-sm text-muted-foreground">
              Disabled while I work on other things
            </p>
            <Button variant="destructive" disabled type="submit">
              Delete Account
            </Button>
          </div>
        </form>
      </div>
    );
  } else {
    return <Loading />;
  }
}

export default Page;



function UserAvatarCard({userImageUrl, userId}:{userImageUrl?: Id<"_storage">, userId: Id<"users">}) {

  const [loading, setLoading] = React.useState<boolean>(false);

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl);
  const uploadImage = useMutation(api.storage.uploadUserImage);

  const imageInput = React.useRef<HTMLInputElement>(null);
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
          onChange={(event) => setSelectedImage(event.target.files![0])}
          disabled={selectedImage !== null}
          className="hidden"
        />
        {imageUrl ?
          <Avatar
            onClick={() => imageInput.current?.click()}
            className="size-16 sm:size-20 border hover:bg-muted/50"
          >
            <AvatarImage src={imageUrl} />
            <AvatarFallback><User2Icon /></AvatarFallback>
          </Avatar>
          :
          <Avatar
            onClick={() => imageInput.current?.click()}
            className="size-16 sm:size-20 border hover:bg-muted/50"
          >
            <AvatarFallback><User2Icon /></AvatarFallback>
          </Avatar>
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
