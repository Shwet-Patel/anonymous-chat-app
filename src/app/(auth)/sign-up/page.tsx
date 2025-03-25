"use client";
import { useEffect, useState } from "react";
import { signupSchema } from "@/validationSchemas/signupSchema";
import { useDebounceValue } from "usehooks-ts";
import toast, { LoaderIcon } from "react-hot-toast";
import { Formik } from "formik";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AsyncResponse } from "@/types/AsyncResponse";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingMessage, setIsCheckingMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [debouncedValue, setValue] = useDebounceValue(username, 500);
  const router = useRouter();

  useEffect(() => {
    const checkUsername = async () => {
      if (debouncedValue === "") return;

      setIsCheckingMessage(true);
      setUsernameMessage("");

      try {
        const response = await axios.get<AsyncResponse>(
          `/api/check-username?username=${debouncedValue}`
        );
        // console.log(response);
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<AsyncResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? "error checking username"
        );
      } finally {
        setIsCheckingMessage(false);
      }
    };

    checkUsername();
  }, [debouncedValue]);

  const mySubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<AsyncResponse>("/api/signup", data);

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          router.replace(`/verify/${username}`);
        }, 1000);
        setIsSubmitting(false);
      } else {
        toast.error(response.data.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      // console.log("error in sigining up user", error);

      const axiosError = error as AxiosError<AsyncResponse>;
      const errorMessage = axiosError.response?.data.message || "";

      toast.error(errorMessage);
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
          <h3 className="text-center text-xl font-semibold">SIGN UP</h3>
          <Formik
            initialValues={{
              username: "",
              email: "",
              Password: "",
            }}
            validate={(values) => {
              const validationResult = signupSchema.safeParse(values);
              if (!validationResult.success) {
                const errors = validationResult.error.format() || [];
                const username = errors.username?._errors.join(",");
                const email = errors.email?._errors.join(",");
                const Password = errors.Password?._errors.join(",");

                return { username, email, Password };
              }
              return {};
            }}
            onSubmit={(values) => mySubmit(values)}
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <form className="" onSubmit={handleSubmit}>
                <div className="my-2">
                  <div className="font-medium text-lg">Username</div>
                  <input
                    type="text"
                    name="username"
                    placeholder="John123"
                    className={`min-w-96 my-2 py-2 px-4 border-b-2 ${touched.username && !isCheckingMessage && usernameMessage !== "This username is available" ? "border-red-500" : "border-black focus:border-sky-600"} focus:outline-none`}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      handleChange(e);
                    }}
                    value={values.username}
                  />
                  <div
                    className={`min-h-5 ${usernameMessage === "This username is available" ? "text-sky-950" : "text-red-500"} text-sm`}
                  >
                    {isCheckingMessage ? <LoaderIcon /> : usernameMessage}
                  </div>
                </div>

                <div className="my-2">
                  <div className="font-medium text-lg">Email</div>
                  <input
                    type="text"
                    name="email"
                    placeholder="john123@mail.com"
                    className={`min-w-96 my-2 py-2 px-4 border-b-2 ${touched.email && errors.email ? "border-red-500" : "border-black focus:border-sky-600"}  focus:outline-none`}
                    onChange={handleChange}
                    value={values.email}
                  />
                  <div className={`min-h-5 text-red-500 text-sm`}>
                    {errors.email && touched.email ? (
                      <div>{errors.email}</div>
                    ) : null}
                  </div>
                </div>

                <div className="my-2">
                  <div className="font-medium text-lg">Password</div>
                  <input
                    type="password"
                    name="Password"
                    className={`min-w-96 my-2 py-2 px-4 border-b-2 ${touched.Password && errors.Password ? "border-red-500" : "border-black focus:border-sky-600"}  focus:outline-none`}
                    onChange={handleChange}
                    value={values.Password}
                  />
                  <div className="min-h-5 text-red-500 text-sm">
                    {touched.Password
                      ? errors.Password && <div>{errors.Password}</div>
                      : null}
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

          <div className="my-3">
            Already registered?
            <Link
              href={"/sign-in"}
              className="text-sky-700 font-semibold hover:text-sky-950 duration-150"
            >
              {" "}
              Login instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
