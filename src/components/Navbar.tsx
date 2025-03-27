"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const router = useRouter();
  const { data, status } = useSession();
  const isLoggedIn = status === "authenticated" ? true : false;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-sky-950 relative text-white py-6 shadow-md">
      <div className="container mx-auto px-6 flex justify-around md:justify-between items-center">
        <div className="text-xl md:text-3xl font-bold">True Feedback</div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-x-8 items-center">
          {isLoggedIn ? (
            <>
              <div className="text-lg font-semibold">
                Hi, {data?.user.username}
              </div>
              <button
                className="bg-white px-4 py-2 rounded text-sky-950 hover:bg-gray-200 duration-200"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="bg-white px-4 py-2 rounded text-sky-950"
              onClick={() => router.push("/sign-in")}
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(true)}>
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        {/* Sidebar for Small Screens */}
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 100 }}
            className="fixed top-0 right-0 h-full w-2/3 bg-sky-950 text-white shadow-lg z-50 flex flex-col p-6"
          >
            {/* Close Button */}
            <button className="self-end mb-4" onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>

            {/* Menu Items */}
            {isLoggedIn ? (
              <>
                <div className="text-lg font-semibold mb-4">
                  Hi, {data?.user.username}
                </div>
                <button
                  className="bg-white px-4 py-2 rounded text-sky-950 hover:bg-gray-200 duration-200"
                  onClick={() => signOut()}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="bg-white px-4 py-2 rounded text-sky-950"
                onClick={() => {
                  router.push("/sign-in");
                  setIsOpen(false);
                }}
              >
                Login
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
