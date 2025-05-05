import { Link } from "react-router-dom";
import { Input, Button, UserLogo } from "../components/index";
import { useEffect, useState, useRef, useCallback } from "react";
import api from "../utils/api";
import { userAtom } from "../utils/store/atoms";
import { useRecoilValue } from "recoil";

export default function Home() {
  const [users, setUsers] = useState([]);
  // const [fullName, setFullName] = useState("");
  const fullNameRef = useRef("");
  const User = useRecoilValue(userAtom);

  let debounceTime = 700;
  const timeoutId = useRef(null);
  const startTime = useRef(Date.now()); // Track the start time of the window
  const throttlingLimit = 3;
  const perTimeLimit = 5000; // 5 seconds
  const counter = useRef(0);

  const handleSearch = useCallback(() => {
    console.log(`🚀 ~ Home.jsx:78 ~ handleSearch ~ counter:`, counter.current);

    const searchValue = fullNameRef.current?.value.trim() || "";
    if (!searchValue) {
      setUsers([]);
      return;
    }

    const currTime = Date.now();

    // Reset counter if time window has passed
    if (currTime - startTime.current > perTimeLimit) {
      startTime.current = currTime;
      counter.current = 0;
    }

    if (counter.current >= throttlingLimit) {
      alert("Throttling Limit Reached");
      return;
    }

    counter.current++;

    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = setTimeout(async () => {
      try {
        const apiResponse = await api.get(
          "/api/v1/user/all?search=" + searchValue
        );
        const apiData = apiResponse.data;
        if (!apiData.status || !apiData.data.users) throw new Error("");
        setUsers(apiData.data.users);
      } catch (error) {
        setUsers([]);
      } finally {
        timeoutId.current = null;
      }
    }, debounceTime);
  }, []);


  useEffect(() => {
    api
      .get("/api/v1/user/all?isIncludeRequestUser=false")
      .then((res) => res.data)
      .then(
        (data) => setUsers(data?.data?.users || []) // Setting the users state
      )
      .catch((error) => {
        setUsers([]); // Fallback to an empty array in case of error
      });
  }, []);

  return (
    <div className="pt-2" id="home-container">
      <div className="user-balance-container text-lg font-medium">
        Your Balance {User?.balance || 0}
      </div>
      <div className="users-container mt-2">
        <span className="block text-xl font-medium">Users</span>
        <Input
          placeholder="Search user"
          className="mt-2"
          onChange={handleSearch}
          ref={fullNameRef}
        />
        <div className="space-y-2 mt-4 px-2">
          {users.map((user, idx) => {
            const fullName = user.firstName + user.lastName;
            const profilePic = user.profilePic;
            return (
              <div key={idx} className="flex justify-between space-y-2">
                <div className="users-left-div flex items-center space-x-2">
                  <UserLogo name={fullName} profilePic={profilePic} />
                  <span className="block">{fullName}</span>
                </div>
                <Link
                  to="/send"
                  state={{
                    userId: user._id,
                    username: user.username,
                    profilePic: profilePic,
                    name: fullName,
                  }}
                >
                  <Button
                    label="Send Money"
                    className="bg-black! hover:inset-ring-1! hover:ring-gray-400! duration-400!"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  
}
