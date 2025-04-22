"use client";

import Footer from "@/components/Footer";
import { AsyncResponse } from "@/types/AsyncResponse";
import { createPollSchema } from "@/validationSchemas/createPollSchema";
import axios, { AxiosError } from "axios";
import { FieldArray, Formik } from "formik";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

function getLocalDateTime() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:MM'
}

function Page() {
  const [newCandidate, setNewCandidate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();
  const user = session?.user as User;

  const mySubmit = async (data: z.infer<typeof createPollSchema>) => {
    setIsSubmitting(true);

    const pollDetails = { ...data, username: user.username || "" };

    try {
      const response = await axios.post<AsyncResponse>(
        "/api/poll/create-poll",
        pollDetails
      );

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => {
          router.replace(`/dashboard`);
        }, 100);
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

  // const formik = useFormik({
  //   initialValues: {
  //     pollName: "",
  //     startDate: getLocalDateTime(),
  //     endDate: getLocalDateTime(),
  //     statement: "",
  //     description: "",
  //     candidates: [],
  //     isResultPublic: true,
  //   },
  //   onSubmit: (values) => {
  //     console.log(values);
  //   },
  //   validate: (values) => {
  //     const validationResult = createPollSchema.safeParse(values);
  //     if (!validationResult.success) {
  //       const errors = validationResult.error.format() || [];

  //       const pollName = errors.pollName?._errors.join(",");
  //       const startDate = errors.startDate?._errors.join(",");
  //       const endDate = errors.endDate?._errors.join(",");
  //       const statement = errors.statement?._errors.join(",");
  //       const description = errors.description?._errors.join(",");
  //       const candidates = errors.candidates?._errors.join(",");
  //       const isResultPublic = errors.isResultPublic?._errors.join(",");

  //       return {
  //         pollName,
  //         startDate,
  //         endDate,
  //         statement,
  //         description,
  //         candidates,
  //         isResultPublic,
  //       };
  //     }
  //     return {};
  //   },
  // });

  return (
    <>
      <div className="container my-10 mx-auto max-w-4xl px-6">
        <div className="mb-6">
          <Link
            href={"/dashboard"}
            className=" w-fit px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 hover:text-gray-700 font-medium duration-200 transition-colors"
          >
            Go To Dashboard
          </Link>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Create Poll</h1>
          <p className="text-lg text-gray-600">
            Fill in the details to get started
          </p>
        </div>

        <Formik
          initialValues={{
            pollName: "",
            startDate: getLocalDateTime(),
            endDate: getLocalDateTime(),
            statement: "",
            description: "",
            candidates: [],
            isResultPublic: true,
          }}
          onSubmit={(values) => {
            const convertedStartDate = new Date(values.startDate);
            const convertedEndDate = new Date(values.endDate);
            const Data = {
              ...values,
              startDate: convertedStartDate,
              endDate: convertedEndDate,
            };
            mySubmit(Data);
          }}
          validate={(values) => {
            const validationResult = createPollSchema.safeParse(values);
            if (!validationResult.success) {
              const errors = validationResult.error.format() || [];

              const pollName = errors.pollName?._errors.join(",");
              const startDate = errors.startDate?._errors.join(",");
              const endDate = errors.endDate?._errors.join(",");
              const statement = errors.statement?._errors.join(",");
              const description = errors.description?._errors.join(",");
              const candidates = errors.candidates?._errors.join(",");
              const isResultPublic = errors.isResultPublic?._errors.join(",");

              return {
                pollName,
                startDate,
                endDate,
                statement,
                description,
                candidates,
                isResultPublic,
              };
            }
            return {};
          }}
        >
          {(formik) => (
            <form
              className="space-y-6 bg-white p-8 rounded-xl border shadow-md"
              onSubmit={formik.handleSubmit}
            >
              {/* Poll Name */}
              <div>
                <label className="block text-lg font-medium mb-1">
                  Poll Name
                </label>
                <input
                  type="text"
                  name="pollName"
                  placeholder="e.g., Favorite Programming Language"
                  className={`w-full px-4 py-2 rounded-md border ${formik.touched.pollName && formik.errors.pollName ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  onChange={formik.handleChange}
                  value={formik.values.pollName}
                />
                {formik.touched.pollName && formik.errors.pollName && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.pollName}
                  </p>
                )}
              </div>
              {/* Statement */}
              <div>
                <label className="block text-lg font-medium mb-1">
                  Poll Statement
                </label>
                <input
                  type="text"
                  name="statement"
                  placeholder="e.g., Vote for your favorite language"
                  className={`w-full px-4 py-2 rounded-md border ${formik.touched.statement && formik.errors.statement ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  onChange={formik.handleChange}
                  value={formik.values.statement}
                />
                {formik.touched.statement && formik.errors.statement && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.statement}
                  </p>
                )}
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-lg font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  className={`w-full px-4 py-2 rounded-md border ${formik.touched.startDate && formik.errors.startDate ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  onChange={formik.handleChange}
                  value={formik.values.startDate}
                />
                {formik.touched.startDate && formik.errors.startDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.startDate}
                  </p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-lg font-medium mb-1">
                  End Date
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  className={`w-full px-4 py-2 rounded-md border ${formik.touched.endDate && formik.errors.endDate ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  onChange={formik.handleChange}
                  value={formik.values.endDate}
                />
                {formik.touched.endDate && formik.errors.endDate && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.endDate}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-lg font-medium mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Provide more details about your poll..."
                  className={`w-full px-4 py-2 rounded-md border ${formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-300"} focus:outline-none focus:ring-2 focus:ring-sky-500`}
                  onChange={formik.handleChange}
                  value={formik.values.description}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-sm text-red-500 mt-1">
                    {formik.errors.description}
                  </p>
                )}
              </div>

              {/* Result Visibility */}
              <div>
                <label className="block text-lg font-medium mb-2">
                  Make Poll Results Public?
                </label>

                <div className="flex gap-x-2 mt-2 items-center">
                  <label className="relative inline-block w-11 h-6 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isResultPublic"
                      className="peer sr-only"
                      onChange={formik.handleChange}
                      checked={formik.values.isResultPublic}
                    />
                    <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-sky-950  peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
                    <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full "></span>
                  </label>
                  <label className="text-lg font-medium">
                    {formik.values.isResultPublic ? "Yes" : "No"}
                  </label>
                </div>
              </div>
              {/* Add Candidates */}
              <FieldArray
                name="candidates"
                render={(arrayHelpers) => (
                  <div className="flex flex-col gap-4 mt-6">
                    <label className="font-semibold text-lg">
                      Add Candidates
                    </label>

                    {formik.values.candidates.map((candidate, index) => (
                      <div key={index} className="flex gap-2 items-center">
                        <input
                          name={`candidates.${index}`}
                          value={candidate}
                          disabled={true}
                          placeholder={`Candidate ${index + 1}`}
                          className="w-full max-w-md py-2 px-4 rounded-md border-2 border-black focus:border-sky-600 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => arrayHelpers.remove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}

                    <div className="flex items-center gap-2 mt-2 w-full max-w-md">
                      <input
                        type="text"
                        className="flex-1 py-2 px-4 rounded-md border-2 border-black focus:border-sky-600 focus:outline-none"
                        value={newCandidate}
                        onChange={(e) => setNewCandidate(e.target.value)}
                        placeholder="New candidate name"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (newCandidate.trim()) {
                            arrayHelpers.push(newCandidate.trim());
                            setNewCandidate("");
                          }
                        }}
                        className="bg-sky-950 text-white px-4 py-2 rounded hover:bg-sky-900 transition"
                      >
                        Add
                      </button>
                    </div>

                    {/* show error if any */}
                    <div className="min-h-5 text-red-500 text-sm">
                      {formik.errors.candidates && formik.touched.candidates ? (
                        <div>{formik.errors.candidates}</div>
                      ) : null}
                    </div>
                  </div>
                )}
              />

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full mt-4 bg-sky-950 hover:bg-sky-900 text-white font-medium py-2 px-4 rounded-md transition"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Poll"}
              </button>
            </form>
          )}
        </Formik>
      </div>
      <Footer />
    </>
  );
}

export default Page;
