/* eslint-disable react/prop-types */
export default function Error({ text, className = "", ...props }) {
  return (
    <p className={`text-red-500 text-sm ${className}`} {...props}>
      {text}
    </p>
  );
}
