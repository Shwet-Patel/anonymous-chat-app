import { AsyncResponse } from "@/types/AsyncResponse";
import { message } from "@/types/user.types";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

type messageProps = {
  message: message;
  onMessageDelete: (messageId: unknown) => void;
};

const MessageCard = ({ message, onMessageDelete }: messageProps) => {
  const [open, setOpen] = useState(false);

  const messageDate = new Date(message.createdAt);

  const handleMessageDelete = async (
    message: message,
    handleDelete: (messageId: unknown) => void
  ) => {
    try {
      const response = await axios.delete<AsyncResponse>(
        `/api/delete-message/${message._id}`
      );

      if (response.data.success == true) {
        toast.success("message deleted successfully.");
        handleDelete(message._id);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<AsyncResponse>;
      console.log(axiosError);
      toast.error(
        axiosError.response?.data.message || "error getting messages"
      );
    }
  };

  return (
    <>
      <div className="flex flex-col justify-between p-4 shadow-md rounded-lg border border-gray-200 w-full h-44 max-w-md bg-white">
        <h3 className="text-lg font-semibold">Message</h3>
        <p className="text-gray-700 font-normal text-md italic flex-grow overflow-hidden">
          {message.content}
        </p>
        <div className="flex justify-between mt-4">
          <div className="text-sm font-normal flex items-center">
            {messageDate.toDateString()}
          </div>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            onClick={() => setOpen(true)}
          >
            Delete
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            <p className="mt-2">
              Are you sure you want to delete this message?
            </p>
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
                  handleMessageDelete(message, onMessageDelete);
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
