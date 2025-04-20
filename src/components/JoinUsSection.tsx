import React from "react";
import Link from "next/link";

function JoinUsSection({
  callOutMessage,
  buttonMessage,
}: {
  callOutMessage: string;
  buttonMessage: string;
}) {
  return (
    <div className="text-center py-16 px-6">
      <h2 className=" text-2xl md:text-4xl font-bold">{callOutMessage}</h2>
      <div className="mt-8">
        <Link
          href="/sign-up"
          className=" bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
        >
          {buttonMessage}
        </Link>
      </div>
    </div>
  );
}

export default JoinUsSection;
