"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { data, status } = useSession();
  const isLoggedIn = status === "authenticated" ? true : false;

  // console.log(data);
  return (
    <div className=" bg-sky-950 relative text-white py-6 shadow-md">
      {/* Background Image
      <img
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1] opacity-90"
        src="https://images.unsplash.com/photo-1683059624536-c21b82316aec?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="Navbar Background"
      /> */}

      <div className="container mx-auto flex justify-between">
        <div className="text-3xl font-bold ">True Feedback</div>
        {isLoggedIn ? (
          <div className="flex gap-x-8">
            <div className="flex items-center text-lg font-semibold">
              Hi,{" " + data?.user.username}
            </div>
            <button
              className="bg-white px-4 py-2 rounded text-sky-950 hover:bg-gray-200 duration-200"
              onClick={() => signOut()}
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <button
              className="bg-white px-4 py-2 rounded text-sky-950"
              onClick={() => router.push("/sign-in")}
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
