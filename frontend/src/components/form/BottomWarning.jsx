import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
export default function BottomWarning({
  label = "",
  buttonText = "",
  to = "",
  className = "",
  linkClass = "",
}) {
  return (
    <p
      className={`text-sm font-light text-gray-500 dark:text-gray-400 ${className}`}
    >
      <span>{label}</span>
      <Link
        to={to}
        className={`font-medium text-primary-600 hover:underline dark:text-primary-500 ${linkClass}`}
      >
        {buttonText}
      </Link>
    </p>
  );
}
