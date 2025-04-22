import React from "react";
import Link from "next/link";

type componentPropsType = {
  callOutMessage: string;
  subtitleMessage: string;
  createdBy: string;
  buttonMessage: string;
};

function SendAnonymousMessageToPollCreator({
  callOutMessage,
  subtitleMessage,
  createdBy,
  buttonMessage,
}: componentPropsType) {
  return (
    <div className="my-8 bg-gray-100 py-12 px-6 rounded-md text-center">
      <h2 className="text-2xl font-semibold text-gray-800">{callOutMessage}</h2>
      <p className="text-gray-600 mt-2 mb-4">{subtitleMessage}</p>
      <Link
        href={`/u/${createdBy}`}
        className="inline-block px-6 py-2 rounded border border-sky-950 text-sky-950 hover:bg-sky-100 transition-colors font-medium"
      >
        {buttonMessage}
      </Link>
    </div>
  );
}

export default SendAnonymousMessageToPollCreator;
