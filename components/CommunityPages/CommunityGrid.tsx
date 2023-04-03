import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUserFriends } from "react-icons/fa";
import Button from "../Button";
import { CommunityWithMemberIds } from "../../utils/types";
import { registerCommunityClick } from "../../lib/api-helpers/community-api";

type CommunityGridProps = {
  communities: CommunityWithMemberIds[];
  joinedTab?: boolean;
};

const CommunityGrid = ({ communities, joinedTab }: CommunityGridProps) => {
  const { data: session } = useSession();
  const userId = Number(session?.user.userId);

  if (communities.length === 0)
    return (
      <div className=" flex h-80 flex-col items-center justify-center gap-4 p-4 text-sm tracking-widest text-gray-400">
        No communities to show.
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {communities?.map((community) => (
        <Link
          key={community.communityId}
          href={`/communities/${community.communityId}`}
          className="group rounded-lg p-2 text-sm hover:bg-gray-200 hover:shadow-md"
          onClick={async () => {
            await registerCommunityClick(community.communityId);
          }}
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              fill
              sizes="100vw, (min-width: 640px) 50vw, (min-width: 1024px) 33vw, (min-width: 1536px) 25vw"
              className="object-cover object-center"
              src={community.bannerPic ?? ""}
              alt="Community Banner"
            />
            <div className="absolute inset-x-0 top-0 flex h-full items-end justify-between overflow-hidden rounded-lg p-4">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
              />
              <div className="relative flex items-center gap-2 text-lg font-semibold text-white">
                <FaUserFriends />
                {community.members
                  ? community.members.length
                  : community._count.members}
              </div>

              {community.userId !== userId ? (
                <>
                  {community.members?.find(
                    (member: { userId: number }) => member.userId == userId
                  ) || joinedTab ? (
                    <Button
                      variant="solid"
                      size="sm"
                      className="relative rounded-full text-lg font-semibold text-white"
                    >
                      Joined
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      size="sm"
                      className="relative rounded-full bg-white text-lg font-semibold"
                    >
                      Join
                    </Button>
                  )}
                </>
              ) : null}
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <Image
              height={64}
              width={64}
              className="aspect-square rounded-full object-cover object-center"
              src={community.profilePic ?? ""}
              alt="Community Profile"
            />
            <h3 className="text-xl font-bold text-gray-900">
              {community.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CommunityGrid;
