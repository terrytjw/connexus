import { User } from "@prisma/client";
import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { updateUserInfo } from "../../lib/api-helpers/user-api";
import Button from "../Button";
import Toggle from "../Toggle";

type PreferenceSettingsProps = {
  userData: User;
};
const PreferenceSettings = ({ userData }: PreferenceSettingsProps) => {
  const [notifyByEmail, setNotifyByEmail] = React.useState<boolean>(false);
  const [notifyBySMS, setNotifyBySMS] = React.useState<boolean>(false);

  useEffect(() => {
    setNotifyByEmail(userData.notificationByEmail);
    setNotifyBySMS(userData.notificationBySMS);
  }, []);

  const savePreferences = async () => {
    const updatedUserData = {
      ...userData, // this is the user data from the database
      notificationBySMS: notifyBySMS,
      notificationByEmail: notifyByEmail,
    };

    try {
      await updateUserInfo(userData.userId, updatedUserData);
      toast.success("Preferences saved");
    } catch (error) {
      toast.error("Error saving preferences");
    }
  };
  return (
    <div>
      <h1 className="py-2 text-2xl font-semibold text-gray-900">
        Attending events
      </h1>
      <p className="text-sm text-gray-500">
        News and updates about events created by creators
      </p>
      <section className="max-w-3xl py-8">
        <div className="flex justify-between py-2">
          <p className="mr-4 text-sm lg:text-base">
            Send me an email of the event details whenever I registered for an
            event
          </p>
          <Toggle isChecked={notifyByEmail} setIsChecked={setNotifyByEmail} />
        </div>
        <div className="flex justify-between py-2">
          <p className="mr-4 text-sm lg:text-base">
            Send me an SMS of the event details whenever I registered for an
            event
          </p>
          <Toggle isChecked={notifyBySMS} setIsChecked={setNotifyBySMS} />
        </div>
      </section>
      <Button
        className="mx-auto mt-12 sm:mx-0"
        variant="solid"
        size="md"
        onClick={savePreferences}
      >
        Save Preferences
      </Button>
    </div>
  );
};

export default PreferenceSettings;
