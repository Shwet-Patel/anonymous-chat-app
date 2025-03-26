"use client";
import { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { Formik } from "formik";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { AsyncResponse } from "@/types/AsyncResponse";

const Page = () => {
  const username = useParams().username;
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const mySubmit = async (code: string) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<AsyncResponse>("/api/verify-code", {
        username,
        code,
      });

      if (response.data.success) {
        toast.success("Email Verified successfully!");
        setTimeout(() => {
          router.replace(`/sign-in`);
        }, 1000);
      } else {
        toast.error("Email Verification Failed!");
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      toast.error("Email Verification Failed!");
      const axiosError = error as AxiosError<AsyncResponse>;
      const errMessage =
        axiosError.response?.data.message || "Error in verifying otp";
      setErrorMessage(errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen justify-center ">
      <img
        className="fixed z-[-1] w-screen h-screen min-w-full min-h-full object-cover"
        src="https://images.unsplash.com/photo-1683059624536-c21b82316aec?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <div className=" my-16">
        <div className="my-8 text-center">
          <h1 className=" text-6xl font-bold text-gray-50 font-[Playfair Display] tracking-wide">
            True Feedback
          </h1>
          <h3 className="text-2xl text-gray-100 font-[Montserrat] my-4">
            start your Anonymous Journey now...
          </h3>
        </div>
        <div className="max-w-fit place-self-center p-6 rounded-lg shadow-md bg-slate-100 font-[Montserrat]">
          <h3 className="text-center text-xl font-semibold">
            VERIFY YOUR EMAIL
          </h3>

          <h4 className="text-center text-lg font-light my-2">
            We have sent a verification code to your email.
          </h4>
          <Formik
            initialValues={{
              code: "",
            }}
            onSubmit={(values) => {
              mySubmit(values.code);
            }}
          >
            {({ values, handleChange, handleSubmit, touched }) => (
              <form
                className="my-2 flex flex-col items-center"
                onSubmit={handleSubmit}
              >
                <div className="my-2">
                  <input
                    type="string"
                    name="code"
                    placeholder="Enter 6-digit verification code"
                    className={`min-w-96 text-center my-2 py-2 px-4 border-b-2 ${errorMessage ? "border-red-500" : " border-black focus:border-sky-600"} focus:outline-none`}
                    onChange={handleChange}
                    value={values.code}
                  />
                  <div className={`min-h-5 text-red-500 text-center text-sm`}>
                    {touched.code ? errorMessage : ""}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded text-white bg-sky-950 "
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex gap-x-2 items-center ">
                      <LoaderIcon /> Please wait
                    </div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Page;
