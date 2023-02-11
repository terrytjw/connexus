import React from "react";
import { FaEnvelope, FaPhone, FaShareSquare } from "react-icons/fa";
import Avatar from "../../../components/Avatar";
import Banner from "../../../components/Banner";
import Button from "../../../components/Button";
// import { profile } from "../../utils/dummyData";
import { profile } from "../../../utils/dummyData";

const UserProfilePage = () => {
  return (
    <div className="debug-screens">
      UserProfilePage
      <main>
        <Banner coverImageUrl={profile.coverImageUrl} />
        <div>
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
              <Avatar imageUrl={profile.imageUrl} />
              <div className="mt-6">
                {/* mobile view profile name*/}
                <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
                  <h1 className="truncate text-2xl font-bold text-gray-900">
                    {profile.name} - mobile
                  </h1>
                  <p className="mt-1 text-gray-500 sm:hidden">
                    Bio · Date of Birth
                  </p>
                </div>
                <div className="mt-8 flex flex-col gap-2">
                  <Button variant="solid" size="md">
                    <span>Edit Profile</span>
                  </Button>
                  <Button variant="solid" size="md">
                    <FaShareSquare aria-hidden="true" />
                    <span>Share</span>
                  </Button>
                </div>
              </div>
            </div>
            {/* desktop view profile name*/}
            <div className="mt-6 hidden min-w-0 flex-1 sm:block 2xl:hidden">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {profile.name} - desktop
              </h1>
              <p className="mt-1 text-gray-500">Bio · Date of Birth</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
