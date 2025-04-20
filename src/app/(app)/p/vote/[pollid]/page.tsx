"use client";
import { AsyncResponse, responsePollDetails } from "@/types/AsyncResponse";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Footer from "@/components/Footer";
import { addVoteSchema } from "@/validationSchemas/addVoteSchema";
import JoinUsSection from "@/components/JoinUsSection";
import SendAnonymousMessageToPollCreator from "@/components/SendAnonymousMessageToPollCreator";
import LoadingComponent from "@/components/LoadingComponent";

function Page() {
  const pollId = useParams().pollid;
  const [status, setStatus] = useState<string>("loading");
  const [poll, setPoll] = useState<responsePollDetails>();
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  //get Poll details
  const getPollDetails = useCallback(
    async (refresh: boolean = false) => {
      setStatus("loading");

      try {
        const response = await axios.get<AsyncResponse>(
          `/api/poll/get-poll-details?pollid=${pollId}`
        );
        if (response.data.success === true) {
          setPoll(response.data.pollDetails);
          console.log(response.data.pollDetails);

          const now = new Date();
          const startDate = new Date(response.data.pollDetails?.startDate || 0);
          const endDate = new Date(response.data.pollDetails?.endDate || 0);

          if (now < startDate) {
            setStatus("not-started");
          } else if (now > endDate) {
            setStatus("ended");
          } else {
            setStatus("active");
          }

          if (refresh) {
            toast.success("poll details refreshed successfully");
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        setStatus("Error");
        const axiosError = error as AxiosError<AsyncResponse>;
        toast.error(
          axiosError.response?.data.message || "error getting poll details"
        );
      }
    },
    [pollId, setPoll, setStatus]
  );

  //add Vote
  const addVote = async (data: z.infer<typeof addVoteSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<AsyncResponse>(
        "/api/poll/vote",
        {
          pollID: poll?._id,
          chosenCandidate: data.option,
        },
        {
          withCredentials: true, // send cookies with the request
        }
      );

      if (response.data.success) {
        setHasVoted(true);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<AsyncResponse>;
      const errorMessage = axiosError.response?.data.message || "";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      option: "",
    },
    onSubmit: (values) => addVote(values),
    validate: (values) => {
      const validationResult = addVoteSchema.safeParse(values);
      if (!validationResult.success) {
        const errors = validationResult.error.format() || [];
        const option = errors.option?._errors.join(",");
        return { option };
      }
      return {};
    },
  });

  useEffect(() => {
    getPollDetails();
  }, [getPollDetails]);

  return (
    <div className="font-[montserrat]">
      <div className="container mt-16 mx-auto px-6">
        <div className="flex place-self-center text-center px-4 py-2 my-4 rounded bg-gray-200 text-semibold text-lg">
          Public voting Board
        </div>

        {(status === "loading" || !poll) && (
          <LoadingComponent
            title="Loading Poll Details..."
            subtitle="Please wait..."
            imageUrl="https://img.freepik.com/free-vector/progress-indicator-concept-illustration_114360-4722.jpg?t=st=1744530321~exp=1744533921~hmac=df8e423ee49e1767a0c1b02b5f6e6f4cc7a44ea3703e4de488d3b76706b97866&w=900"
          />
        )}

        {poll && (
          <>
            <div className="flex justify-center my-4">
              <span
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  status === "active"
                    ? "bg-green-100 text-green-600"
                    : status === "not-started"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-red-100 text-red-600"
                }`}
              >
                Poll Status : {status}
              </span>
            </div>
            <div className="text-4xl font-bold text-center">
              {poll?.statement}
            </div>

            <div className="my-8">
              {poll && (
                <form
                  onSubmit={formik.handleSubmit}
                  className="mt-8 max-w-2xl mx-auto text-center"
                >
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {poll.options?.map((opt, index) => (
                      <button
                        type="button"
                        key={index}
                        className={`px-4 py-2 rounded border text-lg font-medium ${
                          formik.values.option === opt.title
                            ? "bg-sky-900 text-white"
                            : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          formik.setFieldValue("option", opt.title)
                        }
                      >
                        {opt.title}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={
                      !formik.values.option ||
                      isSubmitting ||
                      hasVoted ||
                      status !== "active"
                    }
                    className={`mt-6 px-6 py-2 rounded text-white ${
                      !formik.values.option ||
                      isSubmitting ||
                      hasVoted ||
                      status !== "active"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-sky-950 hover:bg-sky-900"
                    }`}
                  >
                    Submit Vote
                  </button>
                </form>
              )}

              <div className="mt-10 bg-sky-50 border-l-4 border-sky-950 p-4 rounded text-gray-800 shadow-sm">
                <p className="mt-3 text-sm italic text-sky-800">
                  Need more context? This might help.
                </p>
                <p className="text-base md:text-lg leading-relaxed">
                  {poll?.description}
                </p>
              </div>

              <div className="text-center text-gray-600 mt-6 space-y-2 text-sm md:text-base">
                <p>
                  <span className="font-semibold">Poll Name:</span>{" "}
                  {poll?.pollName}
                </p>
                <p>
                  <span className="font-semibold">Voting Window:</span>{" "}
                  {new Date(poll?.startDate || "").toLocaleString()} →{" "}
                  {new Date(poll?.endDate || "").toLocaleString()}
                </p>
                <p>
                  <span className="font-semibold">Created By</span>{" "}
                  <span className=" italic">{poll?.createdBy}</span> at{" "}
                  {new Date(poll?.createdAt || "").toLocaleString()}
                </p>
              </div>
            </div>

            <hr />

            <SendAnonymousMessageToPollCreator
              callOutMessage=" Wanna send an anonymous message to the poll creator?"
              subtitleMessage="Share your thoughts, feedback, or just say hi—without revealing who
            you are."
              createdBy={poll?.createdBy}
              buttonMessage="Visit Public Message Board"
            />
          </>
        )}

        <JoinUsSection
          callOutMessage="create your own polls"
          buttonMessage=" Register Now"
        />
      </div>

      <Footer />
    </div>
  );
}

export default Page;
