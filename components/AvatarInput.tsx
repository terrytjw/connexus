import { FaCamera } from "react-icons/fa";
import Avatar from "./Avatar";
import Button from "./Button";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type AvatarInputProps = {
  profilePic: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const AvatarInput = ({ profilePic, onChange }: AvatarInputProps) => {
  return (
    <>
      {profilePic ? <Avatar imageUrl={profilePic} /> : null}
      <div
        className={classNames(
          "absolute top-0 flex h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32",
          profilePic ? "bg-black opacity-60" : "bg-gray-200"
        )}
      ></div>

      <div className="absolute top-0 flex h-24 w-24 items-center justify-center rounded-full ring-4 ring-white sm:h-32 sm:w-32">
        <label className="relative">
          <Button variant="solid" size="md" className="!rounded-full">
            <FaCamera />
          </Button>
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg, video/mp4"
            className="btn-md btn-circle btn absolute top-0 z-10 cursor-pointer opacity-0"
            onChange={onChange}
          />
        </label>
      </div>
    </>
  );
};

export default AvatarInput;
