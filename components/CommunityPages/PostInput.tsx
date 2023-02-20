import { FaImages } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Button from "../Button";
import Carousel from "../Carousel";
import TextArea from "../TextArea";
import { Post } from "../../utils/types";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

type PostInputProps = {
  onSubmit: Function;
  post?: Post;
};

const PostInput = ({ onSubmit, post }: PostInputProps) => {
  const { handleSubmit, setValue, control, watch } = useForm({
    defaultValues: {
      content: post ? post.content : "",
      media: post ? post.media : ([] as string[]),
    },
  });

  const [content, media] = watch(["content", "media"]);

  const uploadMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (media.length + e.target.files.length > 10) {
        toast("You can only upload a maximum of 10 files!");
        return;
      }

      const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise(function (resolve, reject) {
          const reader = new FileReader();

          reader.onload = function () {
            resolve(reader.result as string);
          };

          reader.onerror = function () {
            reject(reader);
          };

          reader.readAsDataURL(file);
        });
      };

      let readers: Promise<string>[] = [];
      Array.from(e.target.files).forEach((file) => {
        readers.push(readFileAsBase64(file));
      });

      Promise.all(readers).then((values) => {
        setValue("media", [...media, ...values]);
      });
    }

    e.target.value = ""; // reset value of input
  };

  return (
    <form
      className={classNames(
        "card items-center justify-center gap-4 bg-white",
        post ? "" : "border-2 border-gray-200 p-4 sm:p-8"
      )}
      onSubmit={handleSubmit((data) => onSubmit(data))}
    >
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#1A7DFF",
            color: "#fff",
            textAlign: "center",
          },
        }}
      />

      <Controller
        control={control}
        name="content"
        render={({ field: { onChange, value } }) => (
          <TextArea
            className={classNames(
              "h-min w-full",
              post ? "" : "border-0 focus:outline-none"
            )}
            placeholder="Got something on your mind?"
            label={post ? "Description" : ""}
            value={value}
            onChange={onChange}
          />
        )}
      />

      {media.length > 0 ? (
        <Carousel
          images={media}
          removeImage={(imageToRemove: string) => {
            setValue(
              "media",
              media?.filter((image) => {
                return image != imageToRemove;
              })
            );
          }}
        />
      ) : (
        <div className="rounded-box relative flex h-60 w-full md:h-96">
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
            onChange={(e) => uploadMultipleFiles(e)}
          />
        </div>
      )}

      <div className="flex w-full justify-between">
        <div className="relative cursor-pointer rounded-md hover:bg-gray-200 hover:text-white">
          <input
            id="media-upload"
            type="file"
            className="absolute top-0 h-full w-full opacity-0"
            accept="image/png, image/gif, image/jpeg, video/mp4"
            multiple={true}
            max={10}
            onChange={(e) => uploadMultipleFiles(e)}
          />
          <Button
            variant="outlined"
            size="md"
            className="border-0 !text-red-500"
          >
            <FaImages />
            Attach Photos
          </Button>
        </div>

        <Button
          variant="solid"
          size="md"
          disabled={content == "" && media.length === 0}
        >
          {post ? "Save Changes" : "Publish"}
        </Button>
      </div>
    </form>
  );
};

export default PostInput;
