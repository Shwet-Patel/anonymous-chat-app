"use client";
import axios, { AxiosError } from "axios";
import { AsyncResponse } from "@/types/AsyncResponse";
import Footer from "@/components/Footer";
import MessageCard from "@/components/MessageCard";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import { useCopyToClipboard } from "usehooks-ts";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import { message } from "@/types/user.types";
import { acceptMessageSchema } from "@/validationSchemas/acceptMessagesSchema";

const Page = () => {
  const [url, setUrl] = useState("");
  const [messages, setMessages] = useState<message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { data: session } = useSession();
  const user = session?.user as User;

  //copy to clipboard
  const [copiedText, copy] = useCopyToClipboard();
  const CopyToClipboard = () => {
    copy(url)
      .then(() => {
        toast.success("copied to clipboard");
      })
      .catch((error) => {
        toast.error(`can't copy to clipboard, url: ` + `${copiedText}`, error);
      });
  };

  //acept-message status related
  const formik = useFormik({
    initialValues: {
      acceptingMessages: false,
    },
    onSubmit: (values) => {
      console.log(values);
    },
    validate: (values) => {
      const validationResult = acceptMessageSchema.safeParse(values);
      if (!validationResult.success) {
        const errors = validationResult.error.format() || [];
        const acceptingMessages = errors.acceptingMessages?._errors.join(",");

        return { acceptingMessages };
      }
      return {};
    },
  });

  //get initial accept-message status
  const getIsAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true);

    try {
      const response = await axios.get<AsyncResponse>(
        `/api/messaging/accept-messages?username=${user.username}`
      );

      if (response.data.success === true) {
        formik.setValues({
          acceptingMessages: response.data.isAcceptingMessages || false,
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
      toast.error("could not read accepting messages status");
    } finally {
      setIsSwitchLoading(false);
    }
  }, [session, setIsSwitchLoading]);

  // update accept messages status
  const handleAcceptMessagesChange = useCallback(
    async (updatedval: boolean) => {
      setIsSwitchLoading(true);

      try {
        const response = await axios.post<AsyncResponse>(
          "/api/messaging/accept-messages",
          {
            acceptingMessages: updatedval,
          }
        );

        if (response.data.success === true) {
          toast.success("accept messages status updated successfully");
        } else {
          toast.error("can not update accept messaegs status");
        }
      } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError<AsyncResponse>;
        toast.error(
          axiosError.response?.data.message ||
            "can not update accept messaegs status"
        );
      } finally {
        setIsSwitchLoading(false);
      }
    },
    [setIsSwitchLoading]
  );

  //get messages
  const getMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);

      try {
        const response = await axios.get<AsyncResponse>(
          "api/messaging/get-messages"
        );
        if (response.data.success === true) {
          setMessages(response.data.messages || []);

          if (refresh) {
            toast.success("messages refreshed successfully");
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError<AsyncResponse>;
        toast.error(
          axiosError.response?.data.message || "error getting messages"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [setMessages, setIsLoading]
  );

  //handle delete message for UI
  const handleMessageDelete = (messageId: unknown) => {
    setMessages(messages.filter((msg) => msg._id != messageId));
  };

  useEffect(() => {
    if (!session || !session.user) return;

    //setting public URL
    const protocol = window.location.protocol;
    const hostname = window.location.host;
    setUrl(`${protocol}//${hostname}/u/${user.username}`);

    //get messages
    getMessages();

    //get initial status of accepting messages
    getIsAcceptingMessages();

    setIsLoading(false);
  }, [session, setUrl, getMessages, getIsAcceptingMessages]);

  return (
    <>
      <div className=" container my-8 mx-auto px-6">
        <h1 className=" font-bold text-3xl">User Dashboard</h1>

        <div className="my-8">
          <div className="font-semibold text-xl">Your Unique Link</div>
          <div className="my-4 flex flex-col md:flex-row gap-6 justify-between bg-gray-50 text-xl">
            <div
              className={`mx-4 flex min-h-full items-center ${isLoading ? "animate-pulse" : ""}`}
            >
              {url}
            </div>
            <button
              onClick={CopyToClipboard}
              className="bg-sky-950 text-white px-4 py-2 rounded"
            >
              Copy
            </button>
          </div>
        </div>

        <form className="" onSubmit={formik.handleSubmit}>
          <div className="my-2 ml-2 flex items-center gap-x-4">
            <label className="relative inline-block w-11 h-6 cursor-pointer">
              <input
                type="checkbox"
                name="acceptingMessages"
                className="peer sr-only"
                onChange={(e) => {
                  formik.handleChange(e);
                  handleAcceptMessagesChange(e.target.checked);
                }}
                checked={formik.values.acceptingMessages}
                disabled={isSwitchLoading}
              />
              <span className="absolute inset-0 bg-gray-200 rounded-full transition-colors duration-200 ease-in-out peer-checked:bg-sky-950  peer-disabled:opacity-50 peer-disabled:pointer-events-none"></span>
              <span className="absolute top-1/2 start-0.5 -translate-y-1/2 size-5 bg-white rounded-full shadow-xs transition-transform duration-200 ease-in-out peer-checked:translate-x-full "></span>
            </label>

            <label className="text-lg font-medium">
              Accept Messages: {formik.values.acceptingMessages ? "Yes" : "No"}
            </label>
          </div>
        </form>
        <hr className="my-4 h-[2px] bg-black" />

        <div>
          <div className="flex justify-between items-center">
            <div className=" font-semibold text-xl">Your Messages</div>
            <button
              className="bg-sky-950 text-lg text-white px-4 py-2 rounded"
              onClick={() => {
                getMessages(true);
              }}
            >
              Refresh
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="p-4 shadow-md rounded-lg border bg-zinc-200 border-gray-200 w-full h-44 max-w-md animate-pulse"
                ></div>
              ))}
            </div>
          ) : messages.length > 0 ? (
            // Show messages once loaded
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
              {messages.map((msg, index) => (
                <MessageCard
                  key={index}
                  message={msg}
                  onMessageDelete={handleMessageDelete}
                />
              ))}
            </div>
          ) : (
            // No messages but loading is done
            <div className="flex flex-col items-center">
              <img
                className="w-full max-w-60 h-auto"
                src="https://img.freepik.com/free-vector/hand-drawn-no-data-concept_52683-127829.jpg?t=st=1742878745~exp=1742882345~hmac=a6e7fed524a976102ea7b02db6b1c838b1d63bdc8519541da1ea7779986db5e3&w=900"
              />
              <p className="text-xl text-gray-500">No messages yet.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
