import { FaCamera, FaTimes } from "react-icons/fa";
import Banner from "./Banner";
import Button from "./Button";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type BannerInputProps = {
  bannerPic: File | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const BannerInput = ({ bannerPic, onChange, onClick }: BannerInputProps) => {
  return (
    <div className="relative h-32 w-full lg:h-48">
      {bannerPic ? (
        <Banner coverImageUrl={URL.createObjectURL(bannerPic)} />
      ) : null}
      <div
        className={classNames(
          "absolute top-0 flex h-32 w-full lg:h-48",
          bannerPic ? "bg-black opacity-60" : "bg-gray-200"
        )}
      ></div>

      <div className="absolute top-0 flex h-32 w-full items-end justify-end gap-4 p-4 lg:h-48">
        <label className="relative">
          <Button variant="solid" size="md" className="!btn-circle">
            <FaCamera />
          </Button>
          <input
            type="file"
            accept="image/png, image/gif, image/jpeg, video/mp4"
            className="btn-md btn-circle btn absolute top-0 z-10 cursor-pointer opacity-0"
            onChange={onChange}
          />
        </label>

        {bannerPic ? (
          <Button
            variant="solid"
            size="md"
            className="z-10 !rounded-full"
            onClick={onClick}
          >
            <FaTimes />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default BannerInput;
