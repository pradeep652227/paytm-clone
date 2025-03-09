/* eslint-disable react/prop-types */
export default function Heading({ label = "", className = "", ...props }) {
  console.log('Heading Re-rendered');
  return (
    <h1 className={`font-bold text-4xl pt-6 ${className}`} {...props}>
      {label}
    </h1>
  );
}
