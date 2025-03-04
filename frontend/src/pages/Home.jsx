import { Link } from "react-router-dom";
import { Input, Button, UserLogo } from "../components/index";

export default function Home() {
  return (
    <div className="pt-2" id="home-container">
      <div className="user-balance-container text-lg font-medium">
        Your Balance {"$5000"}
      </div>
      <div className="users-container mt-2">
        <span className="block text-xl font-medium">Users</span>
        <Input placeholder="Search user" className="mt-2" />
        <div className="space-y-2 mt-4 px-2">
          {getRaandomUsersList().map((user, idx) => (
            <div key={idx} className="flex justify-between space-y-2">
              <div className="users-left-div flex items-center space-x-2">
                <UserLogo user={user} />
                <span className="block">{user.name}</span>
              </div>
              <Link to="/send">
                <Button
                  label="Send Mondey"
                  className="bg-black! hover:bg-gray-400! duration-500 focus:ring-black!"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getRaandomUsersList() {
  return [
    {
      name: "User1",
      profilePic: "",
    },
    {
      name: "User2",
      profilePic: "",
    },
    {
      name: "User3",
      profilePic: "",
    },
  ];
}
