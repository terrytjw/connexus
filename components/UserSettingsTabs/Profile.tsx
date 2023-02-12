import React, { useState } from "react";
import Avatar from "../Avatar";
import Banner from "../Banner";
import Button from "../Button";
import Input from "../Input";
import TextArea from "../TextArea";

type ProfileSettingsProps = {
  profile: any; // TODO: type this
};
const ProfileSettings = ({ profile }: ProfileSettingsProps) => {
  const [name, setName] = useState(profile.name);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [email, setEmail] = useState(profile.email);

  return (
    <main>
      <h1 className="mb-6 text-2xl font-semibold">
        Update your profile settings
      </h1>
      <Banner coverImageUrl={profile.coverImageUrl} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <Avatar imageUrl={profile.imageUrl} />
          <div className="">
            {/* mobile view profile name*/}
            <div className="mt-6 min-w-0 flex-1 sm:hidden 2xl:block">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {profile.name} - mobile
              </h1>
              <p className="mt-1 text-gray-500 sm:hidden">
                I'm fly, drippin' with dem peaches high ·{" "}
                <span className="italic">Joined 2 Sep 1969</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 sm:max-w-xl">
        <Input
          type="text"
          label="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="example"
          size="md"
          variant="bordered"
        />
        <Input
          type="text"
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="example"
          size="md"
          variant="bordered"
        />
        <TextArea
          placeholder="I am a 22 years old Software Engineer currently based in San Francisco."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <Input
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example"
          size="md"
          variant="bordered"
        />
      </div>

      <div className="mt-8">
        <Button variant="solid" size="md">
          <span>Save settings</span>
        </Button>
      </div>
    </main>
  );
};

export default ProfileSettings;
