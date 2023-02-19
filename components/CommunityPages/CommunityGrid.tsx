import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaUserFriends } from "react-icons/fa";
import Button from "../Button";
import { Community } from "../../utils/types";

type CommunityGridProps = {
  communities: Community[];
};

const CommunityGrid = ({ communities }: CommunityGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {communities.map((community) => (
        <Link
          key={community.communityId}
          href={`/communities/${community.communityId}`}
          className="group rounded-lg p-2 text-sm hover:bg-gray-200"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
            <Image
              fill
              sizes="100vw, (min-width: 640px) 50vw, (min-width: 1024px) 33vw, (min-width: 1536px) 25vw"
              className="object-cover object-center"
              src={community.bannerPic}
              alt="Community Banner"
            />
            <div className="absolute inset-x-0 top-0 flex h-full items-end justify-between overflow-hidden rounded-lg p-4">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
              />
              <div className="relative flex items-center gap-2 text-lg font-semibold text-white">
                <FaUserFriends />
                {community.numMembers}
              </div>
              {/* <Button
                  variant="outlined"
                  size="sm"
                  className="relative rounded-full text-lg font-semibold text-white"
                >
                  Join
                </Button> */}
              <Button
                variant="solid"
                size="sm"
                className="relative rounded-full text-lg font-semibold text-white"
              >
                Joined
              </Button>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <Image
              height={64}
              width={64}
              className="aspect-square rounded-full object-cover object-center"
              src={community.profilePic}
              alt="Community Profile"
            />
            <h3 className="font-medium text-gray-900">{community.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CommunityGrid;
