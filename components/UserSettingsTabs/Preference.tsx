import { User } from "@prisma/client";
import React from "react";
import toast, { Toaster } from "react-hot-toast";
import { updateUserInfo } from "../../lib/api-helpers/user-api";
import Button from "../Button";
import Toggle from "../Toggle";

type PreferenceSettingsProps = {
  userData: User;
};
const PreferenceSettings = ({ userData }: PreferenceSettingsProps) => {
  const [notifyByEmail, setNotifyByEmail] = React.useState<boolean>(false);
  const [notifyBySMS, setNotifyBySMS] = React.useState<boolean>(false);

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
      <h1>Attending events</h1>
      <p>News and updates about events created by creators</p>
      <section className="max-w-3xl">
        <div className="flex justify-between">
          <p>
            Send me an email of the event details whenever I registered for an
            event
          </p>
          <Toggle isChecked={notifyByEmail} setIsChecked={setNotifyByEmail} />
        </div>
        <div className="flex justify-between">
          <p>
            Send me an SMS of the event details whenever I registered for an
            event
          </p>
          <Toggle isChecked={notifyBySMS} setIsChecked={setNotifyBySMS} />
        </div>
      </section>
      <Button variant="solid" size="md" onClick={savePreferences}>
        Save Preferences
      </Button>
      <Toaster />
    </div>
  );
};

export default PreferenceSettings;
