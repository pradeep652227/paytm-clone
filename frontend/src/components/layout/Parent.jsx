/* eslint-disable react/prop-types */
export default function Parent({ children, className }) {
    return (
      <div className={`max-w-screen-xl mx-auto ${className}`} id="parent-div">
        {children}
      </div>
    );
  }