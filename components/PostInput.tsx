import { useState } from "react";
import { FaImages } from "react-icons/fa";
import Button from "./Button";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type PostData = {
  title: string;
  content: string;
  date: Date;
  media: string[];
};

const PostInput = () => {
  const [media, setMedia] = useState<string[]>([]);

  return (
    <div className="card items-center justify-center gap-6 border-2 border-gray-200 bg-white p-6">
      <textarea
        className="input-group textarea w-full focus:outline-none"
        placeholder="Got something on your mind?"
      />

      <div className="carousel rounded-box h-60 w-full md:h-96">
        {media.length > 0 ? (
          media.map((image, index) => {
            return (
              <div
                id={`${index}`}
                key={index}
                className="carousel-item relative w-full"
              >
                <img
                  src={image}
                  className="w-full object-cover object-center"
                />
                <div className="absolute left-3 right-3 top-1/2 flex -translate-y-1/2 transform justify-between md:left-5 md:right-5">
                  <a
                    href={`#${index - 1}`}
                    className={classNames(
                      "btn-xs btn-circle btn md:btn-md",
                      index === 0 ? "pointer-events-none opacity-0" : ""
                    )}
                  >
                    ❮
                  </a>
                  <a
                    href={`#${index + 1}`}
                    className={classNames(
                      "btn-xs btn-circle btn md:btn-md",
                      index === media.length - 1
                        ? "pointer-events-none opacity-0"
                        : ""
                    )}
                  >
                    ❯
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-box relative flex h-full w-full">
            <div className="rounded-box flex h-full w-full flex-col justify-center gap-2 border-2 text-center text-xs text-gray-500">
              <h3 className="text-xl font-semibold">
                Drag your media over here to post
              </h3>
              Maximum Number of Media Allowed: 10
            </div>
            <input
              type="file"
              className="absolute top-0 z-10 h-full w-full opacity-0"
              accept="image/png, image/gif, image/jpeg, video/mp4"
              multiple={true}
              max={10}
              onChange={(e) => {
                let newMedia: string[] = [];
                if (e.target.files) {
                  Array.from(e.target.files).map((file) => {
                    newMedia.push(URL.createObjectURL(file));
                  });
                  setMedia([...media, ...newMedia]);
                }
              }}
            />
          </div>
        )}
      </div>

      <div className="flex w-full justify-between">
        <div className="relative cursor-pointer rounded-md hover:bg-gray-200 hover:text-white">
          <input
            id="media-upload"
            type="file"
            className="absolute top-0 h-full w-full opacity-0"
            accept="image/png, image/gif, image/jpeg, video/mp4"
            multiple={true}
            max={10}
            onChange={(e) => {
              let newMedia: string[] = [];
              if (e.target.files) {
                Array.from(e.target.files).map((file) => {
                  newMedia.push(URL.createObjectURL(file));
                });
                setMedia([...media, ...newMedia]);
              }
            }}
          />
          <Button
            variant="outlined"
            size="md"
            className="border-0 text-red-500"
          >
            <FaImages />
            Attach Photos
          </Button>
        </div>

        <Button variant="solid" size="md">
          Publish
        </Button>
      </div>
    </div>
  );
};

export default PostInput;
