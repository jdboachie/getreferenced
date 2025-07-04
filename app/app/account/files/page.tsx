'use client';

import Loading from '../loading';
import { useQuery } from "convex/react";
import { useRole } from '@/hooks/use-role';
import { api } from '@/convex/_generated/api';
import { FileCard } from '../components/file-card';
import { ProfileEmptyState } from '../components/profile-empty-state';



export default function Page() {
  const { role } = useRole();
  const endPoint = ( role === "recommender" ) ? api.users.getRecommenderProfile : api.users.getRequesterProfile;
  const profile = useQuery(endPoint);

  if (profile === undefined) return <Loading />;
  if (profile === null) return <ProfileEmptyState role={role!} />

  if (role === "recommender") {
    return (
      <div className="flex flex-col gap-12">
        We are working on this for you. Please check back later.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {role === 'requester' &&
        <>
          <FileCard
            userId={profile.userId}
            fileId={"cvFile" in profile ? profile.cvFile : undefined}
            type="cv"
          />
          <FileCard
            userId={profile.userId}
            fileId={"transcriptFile" in profile ? profile.transcriptFile : undefined}
            type="transcript"
          />
          <FileCard
            userId={profile.userId}
            fileId={"certificateFile" in profile ? profile.certificateFile : undefined}
            type="certificate"
          />
        </>
      }
    </div>
  );
}
