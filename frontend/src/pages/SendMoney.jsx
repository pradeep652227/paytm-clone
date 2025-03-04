/* eslint-disable react/prop-types */
import {
  Button,
  Input,
  Heading,
  UserLogo,
  SubHeading,
} from "../components/index";
export default function SendMoney({ user }) {
  return (
    <div
      id="send-money-container"
      className="bg-gray-300 flex items-center justify-center min-h-screen"
    >
      <div className="rounded-lg bg-white flex flex-col space-y-8 py-8 px-4 w-full max-w-md">
        <Heading label="Send Money" className="text-center pt-0!" />
        <div className="space-y-4">
          <div>
            <UserLogo
              user={user}
              className="inline-block"
              logoClass="bg-green-400!"
            />
            <span className="inline-block font-md text-lg ml-4">
              {user?.name || "Test User"}
            </span>
            <SubHeading label="Amount in (Rs)" className="text-black! p-0!" />
          </div>
          <Input placeholder="Enter amount" className="w-full!" />
          <Button label="Initiate Transfer" className="bg-green-400! w-full!" />
        </div>
      </div>
    </div>
  );
}
