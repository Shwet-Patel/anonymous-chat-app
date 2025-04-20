import { AsyncResponse } from "@/types/AsyncResponse";
import { pollSummary } from "@/types/poll.types";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

type pollProps = {
  poll: pollSummary;
  onPollDelete: (pollId: unknown) => void;
};

const MessageCard = ({ poll, onPollDelete }: pollProps) => {
  const [open, setOpen] = useState(false);

  const creationDate = new Date(poll.createdAt);

  const handlePollDelete = async (
    poll: pollSummary,
    handleDelete: (pollId: unknown) => void
  ) => {
    try {
      const response = await axios.post("/api/poll/delete-poll", {
        pollID: poll._id,
      });

      if (response.data.success == true) {
        toast.success("poll deleted successfully.");
        handleDelete(poll._id);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<AsyncResponse>;
      console.log(axiosError);
      toast.error(axiosError.response?.data.message || "error deleting poll");
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between p-4 shadow-md rounded-lg border border-gray-200 w-full max-w-md bg-white">
        <h3 className="text-lg font-semibold">Poll</h3>
        <p className="text-gray-700 font-normal text-md italic flex-grow overflow-hidden">
          {poll.pollName}
        </p>
        <div className="flex justify-between mt-4">
          <div className="text-sm font-normal flex items-center">
            {creationDate.toDateString()}
          </div>

          <div className="flex gap-x-2">
            <Link
              className="bg-sky-950 text-white px-4 py-2 rounded hover:bg-sky-950 transition"
              href={`/dashboard/view-poll-details/${poll._id}`}
            >
              Details
            </Link>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              onClick={() => setOpen(true)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="mt-2">Are you sure you want to delete this poll?</p>
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                onClick={() => setOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={() => {
                  handlePollDelete(poll, onPollDelete);
                  setOpen(false);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageCard;
