/* eslint-disable react/prop-types */
import {
  Heading,
  SubHeading,
  Input,
  Button,
  BottomWarning,
  Error,
} from "../components/index";

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  formDataAtom,
  formFieldSelectorFamily,
} from "../utils/store/signupAtom";
import { errorAtom, authAtom } from "../utils/store/atoms";
import { customTypes, api } from "../utils/index";
import { login } from "../utils/slice/authSlice";

export default function Signin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300">
      <div className="flex flex-col w-full max-w-md space-y-2 bg-white rounded-lg p-4">
        <div className="text-center">
          <Heading label="Signin" />
          <SubHeading label="Enter the information to Signin to your account" />
        </div>
        <RecoilInput
          fieldName="email"
          label="Email"
          type="email"
          placeholder="johndoe@xyz.com"
        />
        <RecoilInput fieldName="password" label="Password" type="password" />
        <SubmitButton />
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

/*Components*/

function SubmitButton({ ...props }) {
  const formData = useRecoilValue(formDataAtom);
  const setErrors = useSetRecoilState(errorAtom);
  const navigate = useNavigate();
  const setAuth = useSetRecoilState(authAtom);
  const dispath = useDispatch();
  return (
    <Button
      className="mt-4 bg-black! hover:bg-gray-800! duration-500"
      onClick={handleSubmit}
      {...props}
    />
  );

  function validateForm() {
    console.log("validateForm is called!!");
    const errors = {};
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      errors.email = "Invalid email format";
    if (!formData.password.trim()) errors.password = "Password is required";

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e) {
    try {
      e.preventDefault();
      if (!validateForm()) return;

      const apiResponse = await api.post("/api/v1/user/signin", formData);
      console.log("apiResponse ", apiResponse);
      const signinResponse = apiResponse.data;
      if (!signinResponse.status) {
        alert(signinResponse.message);
        return;
      }
      alert("Signin Successful");
      const signinData = signinResponse.data;
      if (!signinData || !signinData.user || !signinData.token)
        throw new customTypes.CustomError(
          500,
          signinResponse.message || "Internal Server Error"
        );

      const { user, token } = signinData;
      // setAuth({ isAuthenticated: true, user, token });
      dispath(login());
      setTimeout(() => navigate("/", { replace: true }), 500);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.message ||
          "Internal Server Error"
      );
    }
  }
}
function RecoilInput({ fieldName, ...props }) {
  const [value, setValue] = useRecoilState(formFieldSelectorFamily(fieldName));
  const errors = useRecoilValue(errorAtom);
  return (
    <>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
      {errors[fieldName] && <Error text={errors[fieldName]} />}
    </>
  );
}
