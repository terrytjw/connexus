import { FaImages } from "react-icons/fa";
import { Controller, useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Button from "./Button";
import Carousel from "./Carousel";

type PostInputProps = {
  createPost: Function;
};

const PostInput = ({ createPost }: PostInputProps) => {
  const { handleSubmit, setValue, control, watch } = useForm({
    defaultValues: {
      content: "",
      media: [] as string[],
    },
  });

  const [content, media] = watch(["content", "media"]);

  return (
    <form
      className="card items-center justify-center gap-4 border-2 border-gray-200 bg-white p-8"
      onSubmit={handleSubmit((data) => createPost(data))}
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
          <textarea
            className="input-group textarea w-full focus:outline-none"
            placeholder="Got something on your mind?"
            value={value}
            onChange={onChange}
          />
        )}
      />

      {media.length > 0 ? (
        <Carousel images={media} />
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
            onChange={(e) => {
              if (media.length === 10) {
                toast("You can only upload a maximum of 10 files!");
                return;
              }

              let newMedia: string[] = [];
              if (e.target.files) {
                Array.from(e.target.files).map((file) => {
                  newMedia.push(URL.createObjectURL(file));
                });
                setValue("media", [...media, ...newMedia]);
              }
            }}
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
            onChange={(e) => {
              if (media.length === 10) {
                toast("You can only upload a maximum of 10 files!");
                return;
              }

              let newMedia: string[] = [];
              if (e.target.files) {
                Array.from(e.target.files).map((file) => {
                  newMedia.push(URL.createObjectURL(file));
                });
                setValue("media", [...media, ...newMedia]);
              }
            }}
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
          Publish
        </Button>
      </div>
    </form>
  );
};

export default PostInput;
