import { Heading, Button } from "../index";

export default function Header() {
  return (
    <>
      <div className="py-2 flex justify-between">
        <div className="header-left">
          <Heading label="Payments App" className="pt-0! text-3xl!" />
        </div>
        <div className="header-right flex items-center space-x-4">
          <span className="text-lg">Hello, User</span>
          <Button
            label="U"
            className="bg-gray-300! text-black rounded-full! p-0! w-10! h-10!"
          />
        </div>
      </div>
      <div className="border-b-1 border-b-color-gray-400 w-screen absolute left-0 "></div>
    </>
  );
}
