'use client';

import Loading from "./loading";
import Avatar from "boring-avatars";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function Page() {
  const profile = useQuery(api.users.getUserProfile);
  const updateUser = useMutation(api.users.updateUser)

  if (profile && profile.user) {
    return (
      <div className="flex flex-col gap-12">
        {/* Display Picture */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Avatar change request submitted");
          }}
          className="border bg-primary-foreground dark:bg-background rounded-lg"
        >
          <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
            <h3 className="font-medium text-lg">Display Picture</h3>
            <p className="text-sm">Click on the avatar to upload a custom one from your files.</p>
            <Avatar
              name={profile.user.email}
              variant="marble"
              size={32}
              className="size-16 sm:size-20 cursor-pointer"
            />
          </div>
          <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between rounded-b-lg border-t p-4">
            <p className="text-sm text-muted-foreground">
              A display picture is optional but strongly recommended.
            </p>
            <Button type="submit" size="sm" disabled>
              Save
            </Button>
          </div>
        </form>

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
            <Input
              name="firstName"
              defaultValue={profile.user.firstName}
              placeholder="Firstname"
              className="max-md:w-full shadow-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault();
              }}
            />
            <Input
              name="lastName"
              defaultValue={profile.user.lastName}
              placeholder="Lastname"
              className="max-md:w-full shadow-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault();
              }}
            />
          </div>
          <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between rounded-b-lg border-t p-4">
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
            <Input
              readOnly
              defaultValue={profile.user.email}
              placeholder="Email"
              className="w-full shadow-none"
            />
          </div>
          <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between rounded-b-lg border-t p-4">
            <p className="text-sm text-muted-foreground">
              Email must be verified to be able to login with it or receive notifications.
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
            <Input
              type="tel"
              name="phone"
              defaultValue={profile.user.phone}
              placeholder="+233123456789"
              className="w-full shadow-none"
            />
          </div>
          <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between rounded-b-lg border-t p-4">
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
          <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between rounded-b-lg border-t p-4">
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
