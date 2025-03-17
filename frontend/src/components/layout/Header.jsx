import { Heading, Button } from "../index";
import { Link } from "react-router-dom";
import { userAtom } from "../../utils/store/atoms";
import { useRecoilValue } from "recoil";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../utils/slice/authSlice";
import { api } from "../../utils";
import { useState, useRef } from "react";
export default function Header() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const User = useRecoilValue(userAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const menuItems = ["Profile", "Settings", "Logout"];

  return (
    <>
      <div className="py-2 flex justify-between">
        <div className="header-left">
          <Link to="/">
            <Heading label="Payments App" className="pt-0! text-3xl!" />
          </Link>
        </div>
        <div className="header-right flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div
                className="relative flex flex-col w-fit"
                onMouseEnter={() => setIsMenuOpen(true)}
                onMouseLeave={() => setIsMenuOpen(false)}
              >
                <div
                  id="user-name-menu"
                  className="flex items-center space-x-2 w-fit mb-1"
                  ref={menuRef}
                >
                  <span className="inline-block font-medium text-lg hover:text-blue-500 duration-300">
                    Hello, {User.firstName + " " + User.lastName}
                  </span>
                  {/* <Button
                  label={User.firstName.charAt(0) || "N/A"}
                  className="bg-gray-300! text-black rounded-full! p-0! w-10! h-10!"
                />   */}
                  <span
                    className={`self-end relative bottom-2 right-0 d w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-black transition-transform ${
                      isMenuOpen ? "rotate-180" : ""
                    }`}
                  ></span>
                </div>
                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute top-full w-full rounded-lg bg-white shadow-lg shadow-gray-400 border-1 border-gray-200 overflow-hidden z-50">
                    <ul className="py-2">
                      {menuItems.map((item, idx) => (
                        <li
                          key={idx}
                          className="text-sm px-4 py-2 hover:bg-gray-100 cursor-pointer hover:text-blue-400 duration-300 font-medium"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <Button
                label="Signout"
                className="bg-gray-300! text-black! hover:opacity-80! hover:ring-1! hover:ring-gray-400! duration-500!"
                onClick={handleLogout}
              />
            </>
          ) : (
            <Link to="/signin">
              <Button
                label="Signin"
                className="bg-gray-300! text-black! hover:opacity-80! hover:ring-1! hover:ring-gray-400! duration-500!"
              />
            </Link>
          )}
          <Link to="/signup">
            <Button
              label="Signup"
              className="bg-black! text-white hover:opacity-80! hover:ring-1! hover:ring-gray-400! duration-500!"
            />
          </Link>
        </div>
      </div>
      <div className="border-b-1 border-b-color-gray-400 w-screen absolute left-0 "></div>
    </>
  );

  async function handleLogout() {
    api
      .get("/api/v1/user/signout")
      .then((res) => res.data)
      .then((apiData) => {
        if (!apiData.status) {
          alert("User can not be signed out!!");
          return;
        }
        alert("User signed out successfully!!");
        dispatch(logout());
      })
      .catch(() => alert("Internal Server Error!!"));
  }
}
