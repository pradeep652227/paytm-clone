/* eslint-disable react/prop-types */
export default function Heading({ label = "", className = "", ...props }) {
  return (
    <h1 className={`font-bold text-4xl pt-6 ${className}`} {...props}>
      {label}
    </h1>
  );
}
