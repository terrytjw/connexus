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
import axios from "axios";
import { User } from "@prisma/client";

type ProfileSettingsProps = {
  userData: User;
};
const ProfileSettings = ({ userData }: ProfileSettingsProps) => {
  type EditProfileForm = {
    displayName: string;
    username: string;
    bio: string;
    email: string;
    bannerPic: string;
    profilePic: string;
  };
  const { handleSubmit, setValue, control, watch } = useForm<EditProfileForm>({
    defaultValues: {
      displayName: userData.displayName,
      username: userData.username,
      bio: userData.bio,
      email: userData.email,
      bannerPic: userData.bannerPic,
      profilePic: userData.profilePic,
    },
  });

  const [bannerPic, profilePic] = watch(["bannerPic", "profilePic"]);
  console.log("xxx -> ", userData);

  const onSubmit = async (formData: EditProfileForm) => {
    const updatedUserData = {
      ...userData, // this is the user data from the database
      ...formData, // this is the user data fields from the form overwriting the database data
    };
    const res = await axios.post(
      "http://localhost:3000/api/users/1",
      updatedUserData
    );
    const temp = res.data;
    console.log("temp -> ", temp);
  };

  return (
    <main>
      <h1 className="mb-6 text-2xl font-semibold">
        Update your profile settings
      </h1>
      {/* <Banner coverImageUrl={profile.coverImageUrl} /> */}
      <form onSubmit={handleSubmit(onSubmit)}>
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
          </div>

          <div className="mt-8 sm:max-w-xl">
            <Controller
              control={control}
              name="displayName"
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
