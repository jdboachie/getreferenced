'use client';

import { toast } from "sonner";
import Image from "next/image";
import * as React from 'react';
import Loading from "./loading";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { User2Icon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { SpinnerIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { useRole } from '@/hooks/use-role';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Page() {
  const user = useQuery(api.auth.getCurrentUser)
  const { role } = useRole();
  const endPoint = role === "recommender" ? api.users.getRecommenderProfile : api.users.getRequesterProfile
  const profile = useQuery(endPoint) ;
  const updateUser = useMutation(api.users.updateUser)
  const updateProfile = useMutation(api.users.updateUserProfile)

  if (profile && user) {
    return (
      <div className="flex flex-col gap-12">

        <UserAvatarCard userImageUrl={user.image} userId={profile.userId} />

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
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">First name</span>
                <Input
                  name="firstName"
                  defaultValue={user.firstName}
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
                  defaultValue={user.lastName}
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
            <Button size={'sm'} type="submit">Save</Button>
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
                defaultValue={user.email}
                placeholder="Email"
                className="w-full shadow-none"
              />
              <Badge
                variant={user.emailVerificationTime ? 'secondary' : 'destructive'}
                className={`pointer-events-none rounded-full absolute top-2 right-2.5 ${user.emailVerificationTime && 'bg-green-400 dark:bg-green-500/80'}`}
              >
                {user.emailVerificationTime ? 'verified' : 'not verified'}
              </Badge>
            </label>
          </div>
          <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
            <p className="text-sm text-muted-foreground">
              Email must be verified to be able to receive notifications.
            </p>
            <Button size={'sm'} type="submit" disabled>Save</Button>
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
                  defaultValue={user.phone}
                  placeholder="+233123456789"
                  className="w-full shadow-none"
                />
                <Badge
                  variant={user.phoneVerificationTime ? 'secondary' : 'destructive'}
                  className={`pointer-events-none rounded-full absolute top-2 right-2.5 ${user.phoneVerificationTime && 'bg-green-500'}`}
                >
                  {user.phoneVerificationTime ? 'verified' : 'not verified'}
                </Badge>
              </label>
          </div>
          <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
            <p className="text-sm text-muted-foreground">
              {user.phoneVerificationTime ??
                "Phone number must be verified to allow recommenders to contact you."}
            </p>
            <Button size={'sm'} type="submit" disabled>Save</Button>
          </div>
        </form>

        {/* Program of study */}
        {(role === "requester") &&
          <form
            id="programOfStudy"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              console.log(formData.get('programOfStudy') ? Number(formData.get('programOfStudy')) : undefined)
              toast.promise(
                updateProfile({
                  role: role,
                  userId: profile.userId,
                  programOfStudy: formData.get('programOfStudy')?.toString(),
                }),
                {
                  loading: 'Saving...',
                  success: 'Program of study updated!',
                  error: 'Problem updating program of study',
                }
              );
            }}
            className="border bg-primary-foreground dark:bg-background rounded-lg"
          >
            <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
              <h3 className="font-medium text-lg">Program of study</h3>
              {/* <p className="text-sm">Very much needed.</p> */}
              <label htmlFor="phone" className="relative w-full sm:max-w-sm">
                <Input
                  name="programOfStudy"
                  defaultValue={("programOfStudy" in profile ? profile.programOfStudy : '')}
                  placeholder="Bsc Dondology"
                  className="w-full shadow-none"
                />
                {/* <Badge
                  variant={user.phoneVerificationTime ? 'secondary' : 'destructive'}
                  className={`pointer-events-none rounded-full absolute top-2 right-2.5 ${user.phoneVerificationTime && 'bg-green-500'}`}
                >
                  {user.phoneVerificationTime ? 'verified' : 'not verified'}
                </Badge> */}
              </label>
            </div>
            <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
              <p className="text-sm text-muted-foreground">
                Program should be as is on your certificate.
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>
        }

        {/* Year of completion */}
        {(role === "requester") &&
          <form
            id="yearOfCompletion"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              console.log(formData.get('yearOfCompletion') ? Number(formData.get('yearOfCompletion')) : undefined)
              toast.promise(
                updateProfile({
                  role: role,
                  userId: profile.userId,
                  yearOfCompletion: formData.get('yearOfCompletion')?.toString(),
                }),
                {
                  loading: 'Saving...',
                  success: 'Program of study updated!',
                  error: 'Problem updating program of study',
                }
              );
            }}
            className="border bg-primary-foreground dark:bg-background rounded-lg"
          >
            <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
              <h3 className="font-medium text-lg">Year of completion</h3>
              {/* <p className="text-sm">Very much needed.</p> */}
              <label htmlFor="phone" className="relative w-full sm:max-w-sm">
                <Input
                  name="yearOfCompletion"
                  defaultValue={("yearOfCompletion" in profile ? profile.yearOfCompletion : '')}
                  placeholder="2025"
                  className="w-full shadow-none"
                />
                {/* <Badge
                  variant={user.phoneVerificationTime ? 'secondary' : 'destructive'}
                  className={`pointer-events-none rounded-full absolute top-2 right-2.5 ${user.phoneVerificationTime && 'bg-green-500'}`}
                >
                  {user.phoneVerificationTime ? 'verified' : 'not verified'}
                </Badge> */}
              </label>
            </div>
            <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
              <p className="text-sm text-muted-foreground">
                TODO: Make this into a datepicker component
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>
        }

        {/* Index number */}
        {(role === "requester") &&
          <form
            id="indexNumber"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              console.log(formData.get('indexNumber') ? Number(formData.get('indexNumber')) : undefined)
              toast.promise(
                updateProfile({
                  role: role,
                  userId: profile.userId,
                  indexNumber: formData.get('indexNumber')?.toString(),
                }),
                {
                  loading: 'Saving...',
                  success: 'Index number updated!',
                  error: 'Problem updating index number',
                }
              );
            }}
            className="border bg-primary-foreground dark:bg-background rounded-lg"
          >
            <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
              <h3 className="font-medium text-lg">Index Number</h3>
              {/* <p className="text-sm">Very much needed.</p> */}
              <label htmlFor="phone" className="relative w-full sm:max-w-sm">
                <Input
                  name="indexNumber"
                  defaultValue={("indexNumber" in profile ? profile.indexNumber : '')}
                  placeholder="1234567"
                  className="w-full shadow-none"
                />
                {/* <Badge
                  variant={user.phoneVerificationTime ? 'secondary' : 'destructive'}
                  className={`pointer-events-none rounded-full absolute top-2 right-2.5 ${user.phoneVerificationTime && 'bg-green-500'}`}
                >
                  {user.phoneVerificationTime ? 'verified' : 'not verified'}
                </Badge> */}
              </label>
            </div>
            <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
              <p className="text-sm text-muted-foreground">
                What you used for exams
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>
        }

        {/* Student number */}
        {(role === "requester") &&
          <form
            id="studentNumber"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              console.log(formData.get('studentNumber') ? Number(formData.get('indexNumber')) : undefined)
              toast.promise(
                updateProfile({
                  role: role,
                  userId: profile.userId,
                  studentNumber: formData.get('studentNumber')?.toString(),
                }),
                {
                  loading: 'Saving...',
                  success: 'Student number updated!',
                  error: 'Problem updating student number',
                }
              );
            }}
            className="border bg-primary-foreground dark:bg-background rounded-lg"
          >
            <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
              <h3 className="font-medium text-lg">Student Number</h3>
              {/* <p className="text-sm">Very much needed.</p> */}
              <label htmlFor="phone" className="relative w-full sm:max-w-sm">
                <Input
                  name="studentNumber"
                  defaultValue={("studentNumber" in profile ? profile.studentNumber : '')}
                  placeholder="12345678"
                  className="w-full shadow-none"
                />
                {/* <Badge
                  variant={user.phoneVerificationTime ? 'secondary' : 'destructive'}
                  className={`pointer-events-none rounded-full absolute top-2 right-2.5 ${user.phoneVerificationTime && 'bg-green-500'}`}
                >
                  {user.phoneVerificationTime ? 'verified' : 'not verified'}
                </Badge> */}
              </label>
            </div>
            <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
              <p className="text-sm text-muted-foreground">
                8-digit number given you when you applied to KNUST
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>
        }

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


function UserAvatarCard({userImageUrl, userId}:{userImageUrl?: Id<"_storage">, userId: Id<"users">}) {

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
                <AvatarImage src={previewUrl || imageUrl || undefined} />
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
