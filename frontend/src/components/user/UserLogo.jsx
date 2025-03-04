import Button from "../Button";
/* eslint-disable react/prop-types */
export default function UserLogo({ user, className = "", logoClass="",props }) {
  return (
    <div className={className} {...props}>
      {user?.profilePic ? (
        <img src={user.profilePic} />
      ) : (
        <Button
          label={user?.name[0] || "N/A"}
          className={`bg-gray-300! text-black rounded-full! p-0! w-10! h-10! ${logoClass}`}
        />
      )}
    </div>
  );
}
