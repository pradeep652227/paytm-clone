/* eslint-disable react/prop-types */
import { RecoilRoot } from "recoil";
export default function Parent({ children, className }) {
    return (
      <div className={`max-w-screen-xl mx-auto ${className}`} id="parent-div">
        <RecoilRoot>
        {children}
        </RecoilRoot>
      </div>
    );
  }