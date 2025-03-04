import {
  Heading,
  SubHeading,
  Input,
  Button,
  BottomWarning,
} from "../components/index";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 py-4">
      <div className="flex flex-col w-full max-w-md space-y-2 bg-white rounded-lg p-4">
        <div className="text-center">
          <Heading label="Signup" />
          <SubHeading label="Enter the following information to create your account for free!!" />
        </div>
        <Input label="First Name" placeholder="John" />
        <Input label="Last Name" placeholder="Doe" required={false} />
        <Input label="Username" placeholder="john123doe" />
        <Input label="Email" type="email" placeholder="johndoe@xyz.com" />
        <Input label="Password" type="password" />
        <Button className="mt-4 bg-black! hover:bg-gray-800! duration-500" />
        <BottomWarning
          label="Already have an account? "
          buttonText="Signin"
          to="/signin"
          className="text-center text-md text-black!"
          linkClass="hover:text-gray-800 duration-500 "
        />
      </div>
    </div>
  );
}
