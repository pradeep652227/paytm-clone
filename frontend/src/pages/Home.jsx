import { Link } from "react-router-dom";
import { Input, Button, UserLogo } from "../components/index";
import { useEffect, useState } from "react";
import  api  from "../utils/api";
import { userAtom } from "../utils/store/atoms";
import { useRecoilValue } from "recoil";

export default function Home() {
  const [users, setUsers] = useState([]);
  const User = useRecoilValue(userAtom);
  useEffect(() => {
    api.get("/api/v1/user/all?isIncludeRequestUser=false")
      .then((res) => {
        console.log("((((((((()))))))))))) ");
        return res.data; // This returns the data object from API response
      })
      .then((data) => {
        setUsers(data?.data?.users || []); // Setting the users state
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
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
        <Input placeholder="Search user" className="mt-2" />
        <div className="space-y-2 mt-4 px-2">
          {users.map((user, idx) => {
            const fullName = user.firstName + user.lastName;
            const profilePic = user.profilePic;

           return <div key={idx} className="flex justify-between space-y-2">
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
                  name: fullName
                }}
              >
                <Button
                  label="Send Money"
                  className="bg-black! hover:inset-ring-1! hover:ring-gray-400! duration-400!"
                />
              </Link>
            </div>;
          })}
        </div>
      </div>
    </div>
  );
}
