import {
  Heading,
  SubHeading,
  Input,
  Button,
  BottomWarning,
} from "../components/index";

export default function Signin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="flex flex-col w-full max-w-md space-y-2 bg-white rounded-lg p-4">
        <div className="text-center">
          <Heading label="Signin" />
          <SubHeading label="Enter the information to Signin to your account" />
        </div>
        <Input label="Email" type="email" placeholder="johndoe@xyz.com" />
        <Input label="Password" type="password" />
        <Button className="mt-4 bg-black! hover:bg-gray-800! duration-500" />
        <BottomWarning
          label="No Account? "
          buttonText="Signup"
          to="/signup"
          className="text-center text-md text-black!"
          linkClass="hover:text-gray-800 duration-500 "
        />
      </div>
    </div>
  );
}
