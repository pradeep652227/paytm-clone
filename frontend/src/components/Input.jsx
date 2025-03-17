/* eslint-disable react/prop-types */
import { useId, forwardRef } from "react";

export default forwardRef(function Input({
  label = "",
  type = "text",
  id = "",
  className = "",
  labelClassName = "",
  required = true,
  ...props
}, ref) {
  const uniqueId = useId();

  const inputId = id || Math.random() * 6 + 1 + "-" + uniqueId;
  console.log(`${label} Input is rendered`);
  return (
    <div className="flex flex-col">
      {label && (
        <label
          htmlFor={inputId}
          className={`mb-2 text-sm font-medium text-gray-900 dark:text-white ${labelClassName}`}
        >
          {label}
        </label>
        // <label htmlFor={inputId} className={`text-sm font-medium text-left py-2 ${labelClassName}`}></label>
      )}
      <input
        id={inputId}
        type={type}
        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className}`}
        required={required}
        ref = {ref}
        {...props}
      />
    </div>
  );
});

// export default Input;