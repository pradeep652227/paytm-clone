/* eslint-disable react/prop-types */
import { RecoilRoot } from "recoil";
import { Suspense } from "react";
export default function Parent({ children, className }) {
  return (
    <div className={`max-w-screen-xl mx-auto ${className}`} id="parent-div">
      <RecoilRoot>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </RecoilRoot>
    </div>
  );
}
