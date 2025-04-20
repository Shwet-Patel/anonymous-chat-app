"use client";
import { useParams } from "next/navigation";
import { AsyncResponse, responsePollDetails } from "@/types/AsyncResponse";
import PieChartComponent from "@/components/PieChart";
import axios, { AxiosError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Link from "next/link";
import JoinUsSection from "@/components/JoinUsSection";
import SendAnonymousMessageToPollCreator from "@/components/SendAnonymousMessageToPollCreator";
import LoadingComponent from "@/components/LoadingComponent";

function Page() {
  const pollId = useParams().pollid;
  const [status, setStatus] = useState<string>("loading");
  const [poll, setPoll] = useState<responsePollDetails>();

  const router = useRouter();

  //get Poll result details
  const getPollResultDetails = useCallback(
    async (refresh: boolean = false) => {
      setStatus("loading");

      try {
        const response = await axios.get<AsyncResponse>(
          `/api/poll/get-results?pollid=${pollId}`
        );
        if (response.data.success === true) {
          setPoll(response.data.pollResults);
          console.log("this is result", response.data.pollResults);

          if (refresh) {
            toast.success("poll details refreshed successfully");
          }

          setStatus("success");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        const axiosError = error as AxiosError<AsyncResponse>;
        if (axiosError.response?.status === 404) {
          setStatus("not-found");
        } else if (axiosError.response?.status === 403) {
          setStatus("private");
        } else if (axiosError.response?.status === 423) {
          setStatus("locked");
        } else {
          setStatus("error");
        }
        toast.error(
          axiosError.response?.data.message || "error getting poll details"
        );
      }
    },
    [pollId, setPoll, setStatus]
  );

  useEffect(() => {
    getPollResultDetails();
  }, [getPollResultDetails]);

  return (
    <div className="font-[montserrat]">
      <div className="container mt-16 mx-auto px-6">
        <div className="flex place-self-center text-center px-4 py-2 my-4 rounded bg-gray-200 text-semibold text-lg">
          Public Results Board
        </div>

        {status === "loading" && (
          <LoadingComponent
            title="Loading Poll Details..."
            subtitle="Please wait..."
            imageUrl="https://img.freepik.com/free-vector/progress-indicator-concept-illustration_114360-4722.jpg?t=st=1744530321~exp=1744533921~hmac=df8e423ee49e1767a0c1b02b5f6e6f4cc7a44ea3703e4de488d3b76706b97866&w=900"
          />
        )}

        {status === "not-found" && (
          <LoadingComponent
            title="Poll not Found"
            subtitle="Please check the poll ID."
            imageUrl="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?t=st=1744976045~exp=1744979645~"
          />
        )}

        {status === "private" && (
          <LoadingComponent
            title="Poll Result is Private"
            subtitle="Please contact the admin."
            imageUrl="https://img.freepik.com/premium-vector/secure-login-sign-up-concept-illustration-user-use-secure-login-password-protection-website-social-media-account-vector-flat-style_7737-2270.jpg?w=1380"
          />
        )}

        {status === "locked" && (
          <LoadingComponent
            title="Poll voting is not yet completed"
            subtitle="please wait for the voting window to end"
            imageUrl="https://img.freepik.com/free-vector/flat-design-time-management-concept_23-2148813012.jpg?t=st=1744978138~exp=1744981738~hmac=5b814760bd7a122ead92aee6f01e29b3710a8448638d57b986fa31b6fc2628bf&w=900"
          />
        )}

        {poll && (
          <>
            <div className="flex justify-center my-4">
              <span
                className={
                  "px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-600"
                }
              >
                Results are live
              </span>
            </div>

            <div className="text-4xl font-bold text-center">
              {poll?.statement}
            </div>

            {poll?.winners && (
              <div className="my-10 text-center px-6 py-8 rounded-lg bg-gradient-to-r from-sky-100 via-white to-sky-100 border border-sky-200 shadow-md">
                <h2 className="text-3xl font-bold text-sky-950 flex justify-center items-center gap-2">
                  {poll.winners.length > 1 ? "🤝 It's a Draw!" : "🏆 Winner"}
                </h2>
                <p className="text-gray-600 mt-2 text-sm">
                  Top Voted Candidate{poll.winners.length > 1 && "s"}
                </p>

                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  {poll.winners.map((winner, idx) => (
                    <span
                      key={idx}
                      className="px-6 py-2 bg-sky-950 text-white font-semibold rounded-full text-lg shadow"
                    >
                      {winner.title}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Candidate vote breakdown and piechart*/}
            <h3 className="text-xl font-bold mb-6 text-center">
              Vote Breakdown
            </h3>
            {poll?.options && (
              <div className="my-8 max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                <div className="">
                  <PieChartComponent candidates={poll.options} />
                </div>
                {/* Vote Breakdown */}
                <div>
                  {poll.options.map((opt, i) => {
                    const isWinner = poll.winners.some(
                      (winner) => winner.title === opt.title
                    );
                    return (
                      <div
                        key={i}
                        className={`p-4 rounded-lg mb-4 border ${
                          isWinner
                            ? "border-sky-950 bg-sky-50"
                            : "border-gray-300"
                        }`}
                      >
                        <div className="flex justify-between font-medium">
                          <span>{opt.title}</span>
                          <span>
                            {opt.votes} votes ({opt.votePercentage?.toFixed(2)}
                            %)
                          </span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full mt-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isWinner ? "bg-sky-950" : "bg-sky-800"
                            }`}
                            style={{ width: `${opt.votePercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="my-8">
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
              createdBy={poll?.createdBy || ""}
              buttonMessage="Visit Public Message Board"
            />
          </>
        )}
      </div>

      <JoinUsSection
        callOutMessage="create your own polls"
        buttonMessage=" Register Now"
      />
      <Footer />
    </div>
  );
}

export default Page;
