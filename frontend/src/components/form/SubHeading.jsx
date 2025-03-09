/* eslint-disable react/prop-types */
export default function SubHeading({ label = "", className = "", ...props }) {
  console.log('sub-Heading Re-rendered');

  return (
    <div
      className={`text-slate-500 text-md pt-1 px-4 pb-4 ${className}`}
      {...props}
    >
      {label}
    </div>
  );
}
