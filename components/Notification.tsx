import CustomLink from "./CustomLink";

type NotificationProps = {
  userId?: string;
  userProfilePic?: string;
  userName?: string;
  message: string;
  linkLabel?: string;
  href?: string;
};

const Notification = ({
  userId,
  userProfilePic,
  userName,
  message,
  linkLabel,
  href,
}: NotificationProps) => {
  return (
    <div className="flex w-full flex-wrap justify-between gap-4 p-6">
      <div className="flex items-center gap-4">
        <div className="avatar">
          <div className="w-8 rounded-full">
            {userProfilePic ? (
              <img src={userProfilePic} />
            ) : (
              <img src="/images/logo-icon.png" />
            )}
          </div>
        </div>
        <p className="text-gray-900">
          {userId && userName ? (
            <>
              <CustomLink
                href={`/users/profile/${userId}`}
                className="font-bold"
              >
                {userName}
              </CustomLink>{" "}
            </>
          ) : null}
          {message}
        </p>
      </div>
      {href && linkLabel ? (
        <CustomLink href={href} className="text-blue-600 underline">
          {linkLabel}
        </CustomLink>
      ) : null}
    </div>
  );
};

export default Notification;
