"use client";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { AsyncResponse } from "@/types/AsyncResponse";
import Footer from "@/components/Footer";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { responsePollDetails } from "@/types/AsyncResponse";
import UrlBox from "@/components/UrlBox";
import PieChartComponent from "@/components/PieChart";
import LoadingComponent from "@/components/LoadingComponent";

function Page() {
  const pollId = useParams().pollid;
  const [url, setUrl] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [status, setStatus] = useState<string>("loading");
  const [poll, setPoll] = useState<responsePollDetails>();
  const [isPollLoading, setIsPollLoading] = useState(true);

  const { data: session } = useSession();

  //get Poll details
  const getPollDetails = useCallback(
    async (refresh: boolean = false) => {
      setIsPollLoading(true);

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
        const axiosError = error as AxiosError<AsyncResponse>;
        toast.error(
          axiosError.response?.data.message || "error getting poll details"
        );
      } finally {
        setIsPollLoading(false);
      }
    },
    [pollId, setPoll, setIsPollLoading]
  );

  useEffect(() => {
    if (!session || !session.user) return;

    //setting public URL
    const protocol = window.location.protocol;
    const hostname = window.location.host;
    setUrl(`${protocol}//${hostname}/p/vote/${pollId}`);
    setResultUrl(`${protocol}//${hostname}/p/results/${pollId}`);

    //get poll Details
    getPollDetails();
  }, [session, setUrl, getPollDetails]);

  if (isPollLoading) {
    return (
      <LoadingComponent
        title="Loading Poll Details..."
        subtitle="Please wait..."
        imageUrl="https://img.freepik.com/free-vector/progress-indicator-concept-illustration_114360-4722.jpg?t=st=1744530321~exp=1744533921~hmac=df8e423ee49e1767a0c1b02b5f6e6f4cc7a44ea3703e4de488d3b76706b97866&w=900"
      />
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full h-full p-6 max-w-4xl mx-auto">
        <Link
          href={"/dashboard"}
          className=" w-fit px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 hover:text-gray-700 font-medium duration-200 transition-colors"
        >
          Go To Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{poll?.pollName}</h1>
            <p className="mt-1 text-sm text-gray-500">Poll ID: {pollId}</p>
            <p className="mt-1 text-sm text-gray-400">
              Created by <span className="font-medium">{poll?.createdBy}</span>{" "}
              on {new Date(poll?.createdAt || "").toLocaleString()}
            </p>
          </div>
          <div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-600"
                  : status === "not-started"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-red-100 text-red-600"
              }`}
            >
              {status === "active"
                ? "Active"
                : status === "not-started"
                  ? "Not Started"
                  : "Ended"}
            </span>
          </div>
        </div>

        <UrlBox
          title="Public Voting URL"
          url={url}
          disabled={status == "ended"}
        />

        {status === "ended" && (
          <UrlBox title="Public Result URL" url={resultUrl} />
        )}

        <div>
          <p className="text-lg font-semibold mb-2">Poll Question</p>
          <p className="text-gray-700">{poll?.statement}</p>
        </div>

        {poll?.description && (
          <div>
            <p className="text-lg font-semibold mb-2">Description</p>
            <p className="text-gray-700">{poll.description}</p>
          </div>
        )}

        <div>
          <p className="text-lg font-semibold mb-2">Options</p>
          <ul className="space-y-2">
            {poll?.options.map((opt, idx) => (
              <li
                key={idx}
                className="border border-gray-200 rounded-lg px-4 py-2 hover:bg-gray-50"
              >
                <span className="font-medium">{idx + 1}.</span> {opt.title}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-4 items-center">
            <p className="text-gray-700 font-medium">Start:</p>
            <p>{new Date(poll?.startDate || "").toLocaleString()}</p>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-gray-700 font-medium">End:</p>
            <p>{new Date(poll?.endDate || "").toLocaleString()}</p>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-gray-700 font-medium">Total Votes:</p>
            <p>{poll?.voteCount}</p>
          </div>
          <div className="flex gap-4 items-center">
            <p className="text-gray-700 font-medium">Result Visibility:</p>
            <p>{poll?.isResultPublic ? "Public" : "Private"}</p>
          </div>
        </div>

        {/* Live Results */}
        <p className="text-lg font-semibold mb-2 md:text-center">
          Live Results
        </p>
        {(status === "active" || status === "ended") && (
          <div className=" grid md:grid-cols-2 gap-x-8">
            {/* Pie Chart */}
            <div className="">
              <PieChartComponent candidates={poll?.options || []} />
            </div>
            {/* Vote Breakdown */}
            <div>
              <ul className="space-y-2">
                {poll?.options.map((opt, idx) => {
                  const percent =
                    poll?.voteCount && poll.voteCount > 0
                      ? ((opt.votes / poll.voteCount) * 100).toFixed(2)
                      : "0.00";
                  return (
                    <li
                      key={idx}
                      className="border border-gray-300 rounded-lg px-4 py-2"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">{opt.title}</span>
                        <span className="text-sm text-gray-500">
                          {opt.votes} vote{opt.votes !== 1 ? "s" : ""} (
                          {percent}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-sky-950 h-2.5 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

export default Page;
