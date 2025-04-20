"use client";
import { useState } from "react";
import { loginSchema } from "@/validationSchemas/loginSchema";
import toast, { LoaderIcon } from "react-hot-toast";
import { Formik } from "formik";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const Page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const mySubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);

    const response = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    // console.log(response);

    if (response?.ok) {
      toast.success("login successfull");
      setTimeout(() => {
        router.replace("/dashboard");
      }, 100);
    } else {
      toast.error(response?.error || "error occured while sign-in");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen justify-center ">
      <img
        className="fixed z-[-1] w-screen h-screen min-w-full min-h-full object-cover"
        src="https://images.unsplash.com/photo-1683059624536-c21b82316aec?q=80&w=1933&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />

      <div className=" my-8 px-6">
        <div className="my-8 text-center">
          <h1 className=" text-4xl md:text-6xl font-bold text-gray-50 font-[Playfair Display] tracking-wide">
            True Feedback
          </h1>
          <h3 className=" text-lg md:text-2xl text-gray-100 font-[Montserrat] my-4">
            start your Anonymous Journey now...
          </h3>
        </div>
        <div className="min-w-full place-self-center p-6 rounded-lg shadow-md bg-slate-100 font-[Montserrat]">
          <h3 className="text-center text-xl font-semibold">SIGN IN</h3>
          <Formik
            initialValues={{
              identifier: "",
              password: "",
            }}
            validate={(values) => {
              const validationResult = loginSchema.safeParse(values);
              if (!validationResult.success) {
                const errors = validationResult.error.format() || [];
                const identifier = errors.identifier?._errors.join(",");
                const Password = errors.password?._errors.join(",");

                return { identifier, Password };
              }
              return {};
            }}
            onSubmit={(values) => mySubmit(values)}
          >
            {({ values, handleChange, handleSubmit, errors, touched }) => (
              <form
                className=""
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit(e);
                }}
              >
                <div className="my-2">
                  <div className="font-medium text-lg">Username / Email</div>
                  <input
                    type="text"
                    name="identifier"
                    placeholder="Enter username or email"
                    className={`w-full my-2 py-2 px-4 border-b-2 ${touched.identifier && errors.identifier ? "border-red-500" : "border-black focus:border-sky-600"} focus:outline-none`}
                    onChange={handleChange}
                    value={values.identifier}
                  />
                  <div className="min-h-5 text-red-500 text-sm">
                    {touched.identifier
                      ? errors.identifier && <div>{errors.identifier}</div>
                      : null}
                  </div>
                </div>

                <div className="my-2">
                  <div className="font-medium text-lg">Password</div>
                  <input
                    type="password"
                    name="password"
                    className={`w-full my-2 py-2 px-4 border-b-2 ${touched.password && errors.password ? "border-red-500" : "border-black focus:border-sky-600"}  focus:outline-none`}
                    onChange={handleChange}
                    value={values.password}
                  />
                  <div className="min-h-5 text-red-500 text-sm">
                    {touched.password
                      ? errors.password && <div>{errors.password}</div>
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
                    "Sign-in"
                  )}
                </button>
              </form>
            )}
          </Formik>

          <div className="my-3">
            Not a member yet?
            <Link
              href={"/sign-up"}
              className="text-sky-700 font-semibold hover:text-sky-950 duration-150"
            >
              {" "}
              Register instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
