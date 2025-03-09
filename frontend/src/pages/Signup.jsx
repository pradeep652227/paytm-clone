/* eslint-disable react/prop-types */
import axios from "axios";
import {
  Heading,
  SubHeading,
  Input,
  Button,
  BottomWarning,
} from "../components/index";
import {formFieldSelectorFamily} from "../utils/store/signupAtom";
import api from "../utils/api";

import { RecoilRoot, useRecoilState } from "recoil";

export default function Signup() {
  return (
    <RecoilRoot>
      <div className="min-h-screen flex items-center justify-center bg-gray-300 py-4">
        <div className="flex flex-col w-full max-w-md space-y-2 bg-white rounded-lg p-4">
          <div className="text-center">
            <Heading label="Signup" />
            <SubHeading label="Enter the following information to create your account for free!!" />
          </div>
          <RecoilInput
            label="First Name"
            fieldName="firstName"
            placeholder="John"
          />
          <RecoilInput
            label="Last Name"
            fieldName="lastName"
            placeholder="Doe"
          />
          <RecoilInput
            label="Username"
            fieldName="username"
            placeholder="john123doe"
          />
          <RecoilInput
            label="Email"
            fieldName="email"
            type="email"
            placeholder="johndoe@xyz.com"
          />
          <RecoilInput label="Password" fieldName="password" type="password" />
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
    </RecoilRoot>
  );
}

// Optimized Input Component using Recoil
function RecoilInput({ label, fieldName, ...props }) {
  const [value, setValue] = useRecoilState(formFieldSelectorFamily(fieldName));

  console.log(`${label} Input re-rendered`);

  return (
    <Input
      label={label}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
}
