'use client';

import * as React from 'react';
import { toast } from "sonner";
import Loading from "./loading";
import { useRole } from '@/hooks/use-role';
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import UserAvatarCard from "./components/user-avatar-card";
import ProfileCardForm from './components/profile-card-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";


export default function Page() {
  const { role } = useRole();

  const user = useQuery(api.users.getCurrentUser)
  const updateUser = useMutation(api.users.updateUser)
  const updateProfile = useMutation(api.users.updateUserProfile)

  const endPoint = role === "recommender" ?
    api.users.getRecommenderProfile : api.users.getRequesterProfile
  const profile = useQuery(endPoint) ;

  if (profile && user) {
    return (
      <div className="flex flex-col gap-8">

        <UserAvatarCard
          userImageUrl={user.image}
          userId={profile.userId}
        />

        {/* Full Name */}
        <ProfileCardForm
          title="Full Name"
          description="This will be the name on your request form"
          footerNote="Name should be as it appears on official documents."
          onSubmit={async (formData) => {
            toast.promise(
              updateUser({
                userId: profile.userId,
                firstName: formData.get("firstName")?.toString(),
                lastName: formData.get("lastName")?.toString(),
              }),
              {
                loading: "Saving...",
                success: "Name updated!",
                error: "Problem updating name",
              }
            )
          }}
        >
          {(isEditing) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">First name</span>
                <Input
                  name="firstName"
                  defaultValue={user.firstName}
                  placeholder="Firstname"
                  className="max-md:w-full shadow-none"
                  disabled={!isEditing}
                  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                />
              </label>
              <label className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">Last name</span>
                <Input
                  name="lastName"
                  defaultValue={user.lastName}
                  placeholder="Lastname"
                  className="max-md:w-full shadow-none"
                  disabled={!isEditing}
                  onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
                />
              </label>
            </div>
          )}
        </ProfileCardForm>

        {/* Email */}
        <ProfileCardForm
          title="Email"
          description="This is the email address you will use to sign in to GetReferenced."
          footerNote="Email must be verified to receive notifications."
          onSubmit={() => Promise.resolve()}
          buttonDisabled
        >
          {(isEditing) => (
            <label className="relative w-full sm:max-w-sm">
              <div className="sr-only">{isEditing}</div>
              <Input
                disabled
                name="email"
                defaultValue={user.email}
                placeholder="Email"
                className="w-full shadow-none"
              />
              <Badge
                variant="secondary"
                className="pointer-events-none rounded-full absolute top-2 right-2.5"
              >
                {user.emailVerificationTime ? "verified" : "not verified"}
              </Badge>
            </label>
          )}
        </ProfileCardForm>

        {/* Phone Number */}
        <ProfileCardForm
          title="Phone Number"
          description="Your Whatsapp number is preferred."
          footerNote="Phone number must be verified to allow recommenders to contact you."
          onSubmit={() => Promise.resolve()}
          buttonDisabled
        >
          {(isEditing) => (
            <label className="relative w-full sm:max-w-sm">
              <div className="sr-only">{isEditing}</div>
              <Input
                disabled
                type="tel"
                name="phone"
                defaultValue={user.phone}
                placeholder="+233123456789"
                className="w-full shadow-none"
              />
              <Badge
                variant="secondary"
                className="pointer-events-none rounded-full absolute top-2 right-2.5"
              >
                {user.phoneVerificationTime ? "verified" : "not verified"}
              </Badge>
            </label>
          )}
        </ProfileCardForm>

        {role === 'requester' && (
          <>
            {/* Program of study */}
            <ProfileCardForm
              title="Program of study"
              // description=""
              footerNote="Program should be as is on your certificate."
              onSubmit={async (formData) => {
                await toast.promise(
                  updateProfile({
                    role,
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
            >
              {(isEditing) => (
                <Input
                  name="programOfStudy"
                  defaultValue={("programOfStudy" in profile ? profile.programOfStudy : '')}
                  placeholder="BSc Dondology"
                  className="w-full shadow-none"
                  disabled={!isEditing}
                />
              )}
            </ProfileCardForm>

            {/* Year of completion */}
            <ProfileCardForm
              title="Year of completion"
              description=""
              footerNote=""
              onSubmit={async (formData) => {
                await toast.promise(
                  updateProfile({
                    role,
                    userId: profile.userId,
                    yearOfCompletion: formData.get('yearOfCompletion')?.toString(),
                  }),
                  {
                    loading: 'Saving...',
                    success: 'Year of completion updated!',
                    error: 'Problem updating year of completion',
                  }
                );
              }}
            >
              {(isEditing) => (
                <Select
                  name="yearOfCompletion"
                  defaultValue={"yearOfCompletion" in profile ? profile.yearOfCompletion : ''}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full shadow-none">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 30 }, (_, i) => {
                      const year = String(new Date().getFullYear() - i);
                      return (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              )}
            </ProfileCardForm>

            {/* Index number */}
            <ProfileCardForm
              title="Index Number"
              // description=""
              footerNote="What you used for exams"
              onSubmit={async (formData) => {
                await toast.promise(
                  updateProfile({
                    role,
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
            >
              {(isEditing) => (
                <Input
                  name="indexNumber"
                  defaultValue={("indexNumber" in profile ? profile.indexNumber : '')}
                  placeholder="1234567"
                  className="w-full shadow-none"
                  disabled={!isEditing}
                />
              )}
            </ProfileCardForm>

            {/* Student number */}
            <ProfileCardForm
              title="Student Number"
              // description=""
              footerNote="8-digit number given when you applied to KNUST"
              onSubmit={async (formData) => {
                await toast.promise(
                  updateProfile({
                    role,
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
            >
              {(isEditing) => (
                <Input
                  name="studentNumber"
                  defaultValue={("studentNumber" in profile ? profile.studentNumber : '')}
                  placeholder="12345678"
                  className="w-full shadow-none"
                  disabled={!isEditing}
                />
              )}
            </ProfileCardForm>
          </>
        )}

        {role === 'recommender' && (
          <>
            <ProfileCardForm
              title="Staff Number"
              description="Your official university staff identification number."
              footerNote="Staff number as provided by HR department."
              onSubmit={async (formData) => {
                await updateProfile({
                  role,
                  userId: profile.userId,
                  staffNumber: formData.get("staffNumber")?.toString(),
                });
              }}
            >
              {(isEditing) => (
                <Input
                  type="text"
                  name="staffNumber"
                  defaultValue={"staffNumber" in profile ? profile.staffNumber : ''}
                  placeholder="ST12345"
                  disabled={!isEditing}
                  className="input"
                />
              )}
            </ProfileCardForm>

            <ProfileCardForm
              title="Secondary Email"
              description="Alternative email address for backup communication."
              footerNote="Optional alternative email for notifications."
              onSubmit={async (formData) => {
                await updateProfile({
                  role,
                  userId: profile.userId,
                  secondaryEmail: formData.get("secondaryEmail")?.toString(),
                });
              }}
            >
              {(isEditing) => (
                <Input
                  type="email"
                  name="secondaryEmail"
                  defaultValue={"secondaryEmail" in profile ? profile.secondaryEmail : ''}
                  placeholder="john.doe@gmail.com"
                  disabled={!isEditing}
                  className="input"
                />
              )}
            </ProfileCardForm>

            <ProfileCardForm
              title="Department"
              description="The department or faculty you belong to."
              footerNote="Your academic department or administrative unit."
              onSubmit={async (formData) => {
                await updateProfile({
                  role,
                  userId: profile.userId,
                  department: formData.get("department")?.toString(),
                });
              }}
            >
              {(isEditing) => (
                <Input
                  type="text"
                  name="department"
                  defaultValue={"department" in profile ? profile.department : ''}
                  placeholder="Computer Science Department"
                  disabled={!isEditing}
                  className="input"
                />
              )}
            </ProfileCardForm>

            <ProfileCardForm
              title="Year of Employment"
              description="The year you started working at the institution."
              footerNote="Year you began your employment at the university."
              onSubmit={async (formData) => {
                await updateProfile({
                  role,
                  userId: profile.userId,
                  yearOfEmployment: formData.get("yearOfEmployment")?.toString(),
                });
              }}
            >
              {(isEditing) => (
                <Input
                  type="text"
                  name="yearOfEmployment"
                  defaultValue={"yearOfEmployment" in profile ? profile.yearOfEmployment : ''}
                  placeholder="2018"
                  disabled={!isEditing}
                  className="input"
                />
              )}
            </ProfileCardForm>

            <ProfileCardForm
              title="Current Rank"
              description="Your current academic or professional rank."
              footerNote="Your current position (e.g., Lecturer, Senior Lecturer, Professor)."
              onSubmit={async (formData) => {
                await updateProfile({
                  role,
                  userId: profile.userId,
                  currentRank: formData.get("currentRank")?.toString(),
                });
              }}
            >
              {(isEditing) => (
                <Input
                  type="text"
                  name="currentRank"
                  defaultValue={"currentRank" in profile ? profile.currentRank : ''}
                  placeholder="Senior Lecturer"
                  disabled={!isEditing}
                  className="input"
                />
              )}
            </ProfileCardForm>
          </>
        )}

        {/* Delete Account */}
        {/* <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Delete account triggered");
          }}
          className={`${profileCardStyles.card} border bg-red-500/10 dark:bg-red-500/5 text-destructive-foreground`}
        >
          <div className={profileCardStyles.cardContent}>
            <h3 className="font-medium text-lg">Delete Account</h3>
            <p className="text-sm">
              Permanently remove your account and all its contents from the GetReferenced
              platform. This action is not reversible, so please continue with caution.
            </p>
          </div>
          <div className={profileCardStyles.cardFooter}>
            <p className="text-sm text-muted-foreground">
              Disabled while I work on other things
            </p>
            <Button variant="destructive" disabled type="submit">
              Delete Account
            </Button>
          </div>
        </form> */}
      </div>
    );
  } else if (profile === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-semibold mb-4">Profile Not Found</h1>
        <p className="text-lg text-muted-foreground mb-6">
          It seems you don&apos;t have a profile yet. Please contact support if you believe this is an error.
        </p>
        <Button onClick={() => window.location.href = '/auth/chooserole'}>
          Create Profile
        </Button>
      </div>
    );
  }
  else {
    return <Loading />;
  }
}

