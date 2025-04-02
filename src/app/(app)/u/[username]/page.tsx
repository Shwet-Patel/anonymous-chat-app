"use client";
import { AsyncResponse } from "@/types/AsyncResponse";
import { messageSchema } from "@/validationSchemas/messageSchema";
import axios, { AxiosError } from "axios";
import { useFormik } from "formik";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";

import { useRouter } from "next/navigation";

import { z } from "zod";
import Footer from "@/components/Footer";

const Page = () => {
  const username = useParams().username;
  const [isAcceptingMessages, setIsAcceptingMessages] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingSuggestions, setIsGettingSuggestions] = useState(false);
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);

  const router = useRouter();

  const getAcceptingMessageStatus = useCallback(async () => {
    try {
      const response = await axios.get<AsyncResponse>(
        `/api/messaging/accept-messages?username=${username}`
      );
      console.log(response);

      if (response.data.success === true) {
        setIsAcceptingMessages(response.data?.isAcceptingMessages || false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
      toast.error("could not read accepting messages status");
    } finally {
    }
  }, [setIsAcceptingMessages]);

  const sendMessage = async (message: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<AsyncResponse>(
        "/api/messaging/send-messages",
        {
          username: username,
          content: message,
        }
      );

      if (response.data.success) {
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
      formik.setValues({ message: "" });
    }
  };

  const getMessageSuggestions = async (refresh: boolean = false) => {
    setIsGettingSuggestions(true);

    try {
      const response = await axios.get<AsyncResponse>(
        "/api/messaging/suggest-messages"
      );

      if (response.data.success === true) {
        const suggestions = response.data.messageSuggestions || "";
        const processedSuggestions = suggestions
          ?.split("|")
          .filter((msg) => msg != "");
        setSuggestedMessages(processedSuggestions);
        if (refresh) toast.success("Suggestions Refreshed");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<AsyncResponse>;
      toast.error(
        axiosError.response?.data.message || "error getting suggestions"
      );
    } finally {
      setIsGettingSuggestions(false);
    }
  };

  useEffect(() => {
    getMessageSuggestions();
    getAcceptingMessageStatus();
  }, []);

  const formik = useFormik({
    initialValues: {
      message: "",
    },
    onSubmit: (values) => sendMessage(values.message),
    validate: (values) => {
      const validationResult = messageSchema.safeParse(values.message);
      if (!validationResult.success) {
        const message = validationResult.error.format()._errors.join(",");
        return { message };
      }
      return {};
    },
  });

  return (
    <div className="font-[montserrat]">
      <div className="container mt-16 mx-auto px-6">
        <div className="text-4xl font-bold text-center">
          Public Message Board
        </div>

        {isAcceptingMessages ? (
          <></>
        ) : (
          <div className="flex place-self-center text-center px-4 py-2 my-4 rounded bg-gray-200 text-semibold text-lg">
            This user is not accepting messages right now
          </div>
        )}

        <div className="my-8">
          <div className=" text-lg font-bold text-gray-800">
            send your anonymous message to @{username}
          </div>

          <form className="" onSubmit={formik.handleSubmit}>
            <div className="my-2">
              <textarea
                name="message"
                placeholder="Enter your anonymous message..."
                rows={3}
                className={`w-full my-2 px-4 py-3 border-2 rounded-lg transition-all duration-200 resize-none
    ${formik.touched.message && formik.errors.message ? "border-red-500" : "border-gray-300 focus:border-sky-600"} 
    focus:outline-none`}
                onChange={formik.handleChange}
                value={formik.values.message}
                disabled={!isAcceptingMessages}
              />
              <div className="min-h-5 text-red-500 text-sm">
                {formik.errors.message && formik.touched.message ? (
                  <div>{formik.errors.message}</div>
                ) : null}
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded text-white bg-sky-950 flex place-self-center disabled:bg-gray-600"
              disabled={
                isSubmitting ||
                !isAcceptingMessages ||
                formik.values.message.length == 0
              }
            >
              {isSubmitting ? (
                <div className="flex gap-x-2 items-center ">
                  <LoaderIcon /> sending message...
                </div>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
        <hr />
        <div className="my-8">
          <button
            className="px-4 py-2 rounded text-white bg-sky-950 flex place-self-center"
            onClick={() => getMessageSuggestions(true)}
            disabled={isGettingSuggestions}
          >
            {isGettingSuggestions ? (
              <div className="flex gap-x-2 items-center ">
                <LoaderIcon /> wait a Minute...
              </div>
            ) : (
              "click me to get suggestions"
            )}
          </button>

          <div className="my-8">
            {isGettingSuggestions || suggestedMessages.length === 0
              ? [
                  "Keep pushing forward! 🚀",
                  "You are stronger than you think 💪",
                  "A small step today leads to big changes! 🌱",
                ].map((msg, index) => (
                  <button
                    key={index}
                    className="min-w-full bg-zinc-50 hover:bg-sky-100 text-sky-950 duration-200 my-4 px-4 py-2 rounded shadow-sm text-base font-medium"
                    onClick={() => {
                      formik.setValues({ message: msg });
                    }}
                  >
                    {msg}
                  </button>
                ))
              : suggestedMessages.map((msg, index) => {
                  return (
                    <button
                      key={index.toString()}
                      className=" min-w-full bg-zinc-50 hover:bg-sky-100 hover: text-sky-950 duration-200 my-4 px-4 py-2 rounded shadow-sm text-base font-medium"
                      onClick={() => {
                        formik.setValues({ message: msg });
                      }}
                    >
                      {msg}
                    </button>
                  );
                })}
          </div>
        </div>
        <hr />
        <div className="my-16">
          <div className="text-4xl font-bold text-center">
            get your own message board
          </div>
          <button
            className="px-4 py-2 rounded text-white bg-sky-950 flex place-self-center mt-4"
            onClick={() => {
              router.push("/sign-up");
            }}
          >
            Register Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Page;
