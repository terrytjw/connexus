import React, { useState } from "react";
import Avatar from "../Avatar";
import AvatarInput from "../AvatarInput";
import Banner from "../Banner";
import Button from "../Button";
import Input from "../Input";
import TextArea from "../TextArea";
import { Controller, useForm } from "react-hook-form";
import BannerInput from "../BannerInput";
import InputGroup from "../InputGroup";

type ProfileSettingsProps = {
  profile: any; // TODO: type this
};
const ProfileSettings = ({ profile }: ProfileSettingsProps) => {
  const { handleSubmit, setValue, control, watch } = useForm({
    defaultValues: {
      name: "Anon Mfer",
      username: "anonmfer",
      bio: "I am a 22 years old Software Engineer currently based in San Francisco.",
      email: "anonmfer@gmail.com",
      bannerPic: profile.coverImageUrl,
      profilePic: profile.imageUrl,
    },
  });

  const [bannerPic, profilePic] = watch(["bannerPic", "profilePic"]);

  return (
    <main>
      <h1 className="mb-6 text-2xl font-semibold">
        Update your profile settings
      </h1>
      {/* <Banner coverImageUrl={profile.coverImageUrl} /> */}
      <form
        onSubmit={handleSubmit((data) => {
          console.log("data -> ", data);
        })}
      >
        <BannerInput
          bannerPic={bannerPic}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const reader = new FileReader();
              reader.addEventListener("load", () => {
                setValue("bannerPic", reader.result as string);
              });
              reader.readAsDataURL(e.target.files[0]);
            }
          }}
          onClick={() => {
            setValue("bannerPic", "");
          }}
        />
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            {/* <Avatar imageUrl={profile.imageUrl} /> */}
            <div className="relative -mt-12 h-24 sm:mt-0 sm:h-32">
              <AvatarInput
                profilePic={profilePic}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const reader = new FileReader();
                    reader.addEventListener("load", () => {
                      setValue("profilePic", reader.result as string);
                    });
                    reader.readAsDataURL(e.target.files[0]);
                  }
                }}
              />
            </div>
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

          <div className="mt-8 sm:max-w-xl">
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="text"
                  label="Name*"
                  value={value}
                  onChange={onChange}
                  placeholder="e.g. Anon Mfer"
                  errorMessage={error?.message}
                  size="md"
                  variant="bordered"
                />
              )}
            />

            <Controller
              control={control}
              name="username"
              rules={{ required: "Username is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <InputGroup
                  type="text"
                  label="Username*"
                  value={value}
                  onChange={onChange}
                  placeholder="anonmfer"
                  errorMessage={error?.message}
                  size="md"
                  variant="bordered"
                >
                  <span className="text-gray-500">@</span>
                </InputGroup>
              )}
            />

            <Controller
              control={control}
              name="bio"
              // rules={{ required: "Bio is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextArea
                  label="Bio"
                  placeholder="I am an anon keke..."
                  value={value}
                  onChange={onChange}
                  errorMessage={error?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              rules={{ required: "Email is required" }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Input
                  type="email"
                  label="Email*"
                  value={value}
                  onChange={onChange}
                  placeholder="example"
                  errorMessage={error?.message}
                  size="md"
                  variant="bordered"
                />
              )}
            />
          </div>

          <div className="mt-8">
            <Button type="submit" variant="solid" size="md">
              <span>Save settings</span>
            </Button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default ProfileSettings;
