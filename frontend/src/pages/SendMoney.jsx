/* eslint-disable react/prop-types */
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useRecoilValue, useSetRecoilState, useRecoilRefresher_UNSTABLE } from "recoil";
import {
  Button,
  Input,
  Heading,
  UserLogo,
  SubHeading,
} from "../components/index";

import api from "../utils/api";
import { resetUserSelector, userAtom } from "../utils/store/atoms";

export default function SendMoney() {
  const location = useLocation();
  const { userId, username, profilePic, name } = location?.state || {};

  const navigate = useNavigate();

  const amountRef = useRef();
  
  const resetUser = useSetRecoilState(resetUserSelector);
  const refreshUser = useRecoilRefresher_UNSTABLE(userAtom); // ✅ Refreshes userAtom

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
              name={name}
              profilePic={profilePic}
              className="inline-block"
              logoClass="bg-green-400!"
            />
            <span className="inline-block font-md text-lg ml-4">
              {name || "Test User"}
            </span>
            <SubHeading label="Amount in (Rs)" className="text-black! p-0!" />
          </div>
          <Input
            type="number"
            placeholder="Enter amount"
            className="w-full!"
            ref={amountRef}
          />
          <Button label="Initiate Transfer" className="bg-green-400! w-full!" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );

  async function handleSubmit(e) {
    e.preventDefault();
    const currentAmount = amountRef.current?.value;
    if (!currentAmount) {
      alert("Please enter a valid amount to continue");
      return;
    }
    if (!userId) {
      alert("No target user set");
      return;
    }
    const apiResponse = await api.post("/api/v1/account/transfer", {
      toUserId: userId,
      amount: currentAmount,
    });
    const apiData = apiResponse.data;
    if (!apiData.status) {
      alert("Payment can not be transfered due to " + apiData.message);
      return;
    }
    alert("Amount transferred successfully!!");
    refreshUser();
    setTimeout(() => navigate("/", { replace: true }), 500);
  }
}
