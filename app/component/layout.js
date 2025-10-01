import { useSession, signIn, signOut } from "next-auth/react";
import Navigator from "./nav";
import { useState } from "react";
import Logo from "./logo";

export default function Layout({ children }) {
  const { data: session } = useSession();
  const [showNav, setShowNav] = useState(false);

  if (!session) {
    return (
      <div className={"bg-blue-900 w-screen h-screen flex items-center"}>
        <div className="text-center w-full">
          <button
            onClick={() => signIn("google")}
            className="bg-white p-2 px-4 rounded-lg text-black text-lg"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-200 h-screen overflow-y-hidden">
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setShowNav(!showNav)}
          className="  text-black flex gap-4 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </button>
        <Logo />
      </div>

      <div className={"flex h-full"}>
        <Navigator show={showNav} />
        <div className=" bg-gray-100 flex-grow m-2 rounded-lg text-black p-4">
          {children}
        </div>
      </div>
    </div>
  );
}
