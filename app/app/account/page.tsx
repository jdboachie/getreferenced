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

// TODO: Values should go back to their original if editing is cancelled.

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
      <>
        <UserAvatarCard userImageUrl={user.image} userId={profile.userId} />

        {/* Full Name */}
        <ProfileCardForm
          title="Full Name"
          description={role === "requester" ? "This will be the name on your request form." : "This is your public display name. Please keep it accurate."}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
              <label className="grid gap-1">
                <span className="text-sm font-medium text-muted-foreground">Other names (optional)</span>
                <Input
                  name="lastName"
                  defaultValue={user.otherNames}
                  placeholder="Other names"
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
          showButton={false}
          showEditButton={false}
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
          showEditButton={false}
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
          <ProfileCardForm
            title="Education Details"
            description='Click on the edit icon in the top right to edit your education details'
            footerNote="Ensure details match your certificate."
            onSubmit={async (formData) => {
              toast.promise(
                updateProfile({
                  role,
                  userId: profile.userId,
                  programOfStudy: formData.get('programOfStudy')?.toString(),
                  yearOfCompletion: formData.get('yearOfCompletion')?.toString(),
                  indexNumber: formData.get('indexNumber')?.toString(),
                  studentNumber: formData.get('studentNumber')?.toString(),
                }),
                {
                  loading: 'Saving...',
                  success: 'Profile updated!',
                  error: 'Problem updating profile',
                }
              );
            }}
          >
            {(isEditing) => (
              <div className={`grid gap-6 ${!isEditing && 'cursor-not-allowed'}`}>
                {/* Program of Study */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Program of Study</label>
                  <Input
                    name="programOfStudy"
                    defaultValue={"programOfStudy" in profile ? profile.programOfStudy : ''}
                    placeholder="BSc Dondology"
                    className="w-full shadow-none"
                    disabled={!isEditing}
                  />
                  <p className="text-sm text-muted-foreground mt-1">Program should be as is on your certificate.</p>
                </div>

                {/* Year of Completion */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Year of Completion</label>
                  <Select
                    name="yearOfCompletion"
                    defaultValue={"yearOfCompletion" in profile ? profile.yearOfCompletion : ''}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="w-full shadow-none">
                      <SelectValue placeholder="Select year" />
                      <span className="sr-only">Select year</span>
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
                </div>

                {/* Index Number */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Index Number</label>
                  <Input
                    name="indexNumber"
                    defaultValue={"indexNumber" in profile ? profile.indexNumber : ''}
                    placeholder="1234567"
                    className="w-full shadow-none"
                    disabled={!isEditing}
                  />
                  <p className="text-sm text-muted-foreground mt-1">What you used for exams.</p>
                </div>

                {/* Student Number */}
                <div>
                  <label className="block mb-1 text-sm font-medium">Student Number</label>
                  <Input
                    name="studentNumber"
                    defaultValue={"studentNumber" in profile ? profile.studentNumber : ''}
                    placeholder="12345678"
                    className="w-full shadow-none"
                    disabled={!isEditing}
                  />
                  <p className="text-sm text-muted-foreground mt-1">8-digit number given when you applied to KNUST.</p>
                </div>
              </div>
            )}
          </ProfileCardForm>
        )}

        {role === 'recommender' && (
          <>
            {/* Staff Number */}
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

            {/* Secondary Email */}
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

            {/* Department */}
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

            {/* Year of employment */}
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
                <Select
                  name="yearOfEmployment"
                  defaultValue={"yearOfEmployment" in profile ? profile.yearOfEmployment : ''}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="w-full shadow-none">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 50 }, (_, i) => {
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

            {/* Current rank */}
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
      </>
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