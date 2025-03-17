/* eslint-disable react/prop-types */
import axios from "axios";
import {
  Heading,
  SubHeading,
  Input,
  Button,
  BottomWarning,
  Error,
} from "../components/index";
import {
  formDataAtom,
  formFieldSelectorFamily,
} from "../utils/store/signupAtom";

import { errorAtom } from "../utils/store/atoms";
import api from "../utils/api";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

export default function Signup() {
  return (
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
        <RecoilInput label="Last Name" fieldName="lastName" placeholder="Doe" />
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
        <SubmitSignupButton />
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

/*Components*/
function SubmitSignupButton() {
  const formData = useRecoilValue(formDataAtom);
  const setErrors = useSetRecoilState(errorAtom);
  return (
    <Button
      onClick={handleSubmit}
      className="mt-4 bg-black! hover:bg-gray-800! duration-500"
    />
  );

  //Utility functions
  function validateForm() {
    const errors = {};
    if (!formData.firstName.trim()) errors.firstName = "First Name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.username.trim()) errors.username = "Username is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errors.email = "Invalid email format";
    if (!formData.password.trim()) errors.password = "Password is required";
    else if (formData.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    try {
      console.log("handleSubmit");
      e.preventDefault();
      if (!validateForm()) return;

      const response = await api.post("/api/v1/user/signup", formData);
      console.log("Signup successful", response.data);
      alert("Signup Successful!");
    } catch (error) {
      console.error("error in handleSubmit of signup Page ", error);
    }
  }
}

// Optimized Input Component using Recoil
function RecoilInput({ label, fieldName, ...props }) {
  const [value, setValue] = useRecoilState(formFieldSelectorFamily(fieldName));
  // const errors = useRecoilValue(errorAtom); // ✅ Fixed
  const [errors, setErrors] = useRecoilState(errorAtom);

  console.log(`${label} Input re-rendered`);

  return (
    <>
      <Input
        label={label}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
      {errors[fieldName] && <Error text={errors[fieldName]} />}
    </>
  );
}
