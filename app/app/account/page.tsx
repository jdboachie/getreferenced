'use client';

import * as React from 'react';
import { toast } from "sonner";
import Loading from "./loading";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { useRole } from '@/hooks/use-role';
import UserAvatarCard from "./components/user-avatar-card";


export const profileCardStyles = {
  card: 'border bg-primary-foreground dark:bg-background rounded-lg p-1',
  cardContent: 'bg-background dark:bg-primary-foreground rounded-md shadow-xs border p-4 gap-4 flex flex-col',
  cardFooter: 'md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg p-3'
}


export default function Page() {
  const { role } = useRole();

  const user = useQuery(api.users.getCurrentUser)
  const updateUser = useMutation(api.users.updateUser)
  const updateProfile = useMutation(api.users.updateUserProfile)

  const endPoint = role === "recommender" ? api.users.getRecommenderProfile : api.users.getRequesterProfile
  const profile = useQuery(endPoint) ;

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
          className={profileCardStyles.card}
        >
          <div className={profileCardStyles.cardContent}>
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
          <div className={profileCardStyles.cardFooter}>
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
          className={profileCardStyles.card}
        >
          <div className={profileCardStyles.cardContent}>
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
          <div className={profileCardStyles.cardFooter}>
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
          className={profileCardStyles.card}
        >
          <div className={profileCardStyles.cardContent}>
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
          <div className={profileCardStyles.cardFooter}>
            <p className="text-sm text-muted-foreground">
              {user.phoneVerificationTime ??
                "Phone number must be verified to allow recommenders to contact you."}
            </p>
            <Button size={'sm'} type="submit" disabled>Save</Button>
          </div>
        </form>

        {role === 'requester' &&
          <>
          {/* Program of study */}
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
            className={profileCardStyles.card}
          >
            <div className={profileCardStyles.cardContent}>
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
            <div className={profileCardStyles.cardFooter}>
              <p className="text-sm text-muted-foreground">
                Program should be as is on your certificate.
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>

          {/* Year of completion */}
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
            className={profileCardStyles.card}
          >
            <div className={profileCardStyles.cardContent}>
              <h3 className="font-medium text-lg">Year of completion</h3>
              {/* <p className="text-sm">Very much needed.</p> */}
              <label htmlFor="phone" className="relative w-full sm:max-w-sm">
                <Input
                  name="yearOfCompletion"
                  defaultValue={("yearOfCompletion" in profile ? profile.yearOfCompletion : '')}
                  placeholder="2025"
                  className="w-full shadow-none"
                />
              </label>
            </div>
            <div className={profileCardStyles.cardFooter}>
              <p className="text-sm text-muted-foreground">
                TODO: Make this into a datepicker component
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>

          {/* Index number */}
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
            className={profileCardStyles.card}
          >
            <div className={profileCardStyles.cardContent}>
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
            <div className={profileCardStyles.cardFooter}>
              <p className="text-sm text-muted-foreground">
                What you used for exams
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>

          {/* Student number -- */}
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
            className={profileCardStyles.card}
          >
            <div className={profileCardStyles.cardContent}>
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
            <div className={profileCardStyles.cardFooter}>
              <p className="text-sm text-muted-foreground">
                8-digit number given when you applied to KNUST
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>
          </>
        }

        {role === 'recommender' &&
          <>
          {/* Staff Number */}
          <form
            id="staffNumber"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              toast.promise(
                updateProfile({
                  role: role,
                  userId: profile.userId,
                  staffNumber: formData.get('staffNumber')?.toString(),
                }),
                {
                  loading: 'Saving...',
                  success: 'Staff number updated!',
                  error: 'Problem updating staff number',
                }
              );
            }}
            className="border bg-primary-foreground dark:bg-background rounded-lg"
          >
            <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
              <h3 className="font-medium text-lg">Staff Number</h3>
              <p className="text-sm">Your official university staff identification number.</p>
              <label className="relative w-full sm:max-w-sm">
                <Input
                  name="staffNumber"
                  defaultValue={("staffNumber" in profile ? profile.staffNumber : '')}
                  placeholder="ST12345"
                  className="w-full shadow-none"
                />
              </label>
            </div>
            <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
              <p className="text-sm text-muted-foreground">
                Staff number as provided by HR department.
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>

          {/* Secondary Email */}
          <form
            id="secondaryEmail"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              toast.promise(
                updateProfile({
                  role: role,
                  userId: profile.userId,
                  secondaryEmail: formData.get('secondaryEmail')?.toString(),
                }),
                {
                  loading: 'Saving...',
                  success: 'Secondary email updated!',
                  error: 'Problem updating secondary email',
                }
              );
            }}
            className="border bg-primary-foreground dark:bg-background rounded-lg"
          >
            <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
              <h3 className="font-medium text-lg">Secondary Email</h3>
              <p className="text-sm">Alternative email address for backup communication.</p>
              <label className="relative w-full sm:max-w-sm">
                <Input
                  type="email"
                  name="secondaryEmail"
                  defaultValue={("secondaryEmail" in profile ? profile.secondaryEmail : '')}
                  placeholder="john.doe@gmail.com"
                  className="w-full shadow-none"
                />
              </label>
            </div>
            <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
              <p className="text-sm text-muted-foreground">
                Optional alternative email for notifications.
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>

          {/* Department */}
          <form
            id="department"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              toast.promise(
                updateProfile({
                  role: role,
                  userId: profile.userId,
                  department: formData.get('department')?.toString(),
                }),
                {
                  loading: 'Saving...',
                  success: 'Department updated!',
                  error: 'Problem updating department',
                }
              );
            }}
            className="border bg-primary-foreground dark:bg-background rounded-lg"
          >
            <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
              <h3 className="font-medium text-lg">Department</h3>
              <p className="text-sm">The department or faculty you belong to.</p>
              <label className="relative w-full sm:max-w-sm">
                <Input
                  name="department"
                  defaultValue={("department" in profile ? profile.department : '')}
                  placeholder="Computer Science Department"
                  className="w-full shadow-none"
                />
              </label>
            </div>
            <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
              <p className="text-sm text-muted-foreground">
                Your academic department or administrative unit.
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>

          {/* Year of Employment */}
          <form
            id="yearOfEmployment"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              toast.promise(
                updateProfile({
                  role: role,
                  userId: profile.userId,
                  yearOfEmployment: formData.get('yearOfEmployment')?.toString(),
                }),
                {
                  loading: 'Saving...',
                  success: 'Year of employment updated!',
                  error: 'Problem updating year of employment',
                }
              );
            }}
            className="border bg-primary-foreground dark:bg-background rounded-lg"
          >
            <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
              <h3 className="font-medium text-lg">Year of Employment</h3>
              <p className="text-sm">The year you started working at the institution.</p>
              <label className="relative w-full sm:max-w-sm">
                <Input
                  name="yearOfEmployment"
                  defaultValue={("yearOfEmployment" in profile ? profile.yearOfEmployment : '')}
                  placeholder="2018"
                  className="w-full shadow-none"
                />
              </label>
            </div>
            <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
              <p className="text-sm text-muted-foreground">
                Year you began your employment at the university.
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>

          {/* Current Rank */}
          <form
            id="currentRank"
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              toast.promise(
                updateProfile({
                  role: role,
                  userId: profile.userId,
                  currentRank: formData.get('currentRank')?.toString(),
                }),
                {
                  loading: 'Saving...',
                  success: 'Current rank updated!',
                  error: 'Problem updating current rank',
                }
              );
            }}
            className="border bg-primary-foreground dark:bg-background rounded-lg"
          >
            <div className="bg-background rounded-t-lg p-4 gap-4 flex flex-col">
              <h3 className="font-medium text-lg">Current Rank</h3>
              <p className="text-sm">Your current academic or professional rank.</p>
              <label className="relative w-full sm:max-w-sm">
                <Input
                  name="currentRank"
                  defaultValue={("currentRank" in profile ? profile.currentRank : '')}
                  placeholder="Senior Lecturer"
                  className="w-full shadow-none"
                />
              </label>
            </div>
            <div className="md:gap-2 gap-4 flex max-sm:flex-col sm:justify-between items-center rounded-b-lg border-t p-4">
              <p className="text-sm text-muted-foreground">
                Your current position (e.g., Lecturer, Senior Lecturer, Professor).
              </p>
              <Button size={'sm'} type="submit">Save</Button>
            </div>
          </form>
          </>
        }

        {/* Delete Account */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Delete account triggered");
          }}
          className={`${profileCardStyles.card} border bg-destructive text-destructive-foreground`}
        >
          <div className={profileCardStyles.cardContent}>
            <h3 className="font-medium text-lg">Delete Account</h3>
            <p className="text-sm">
              Permanently remove your account and all its contents from the Recommendme
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
        </form>
      </div>
    );
  } else {
    return <Loading />;
  }
}

