import FeedbackCarousel from "@/components/FeedbackCarousal";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 z-10 w-full">
        <Navbar />
      </div>

      <div className="container mx-auto">
        <div className="min-h-screen flex items-center justify-between gap-x-16">
          <div className="">
            <h1 className="text-6xl font-bold text-gray-800">
              Get Anonymous Feedback,{" "}
              <span className="text-blue-600">Honestly</span>
            </h1>
            <p className="text-lg text-gray-600 mt-4">
              Gather honest opinions from your team, friends, or
              customers—completely anonymously.
            </p>
            <div className="mt-6">
              <Link
                href="/sign-up"
                className=" bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
              >
                Start Collecting Feedback
              </Link>
            </div>
          </div>
          <img
            className=" max-w-[30vw] h-auto"
            src="https://img.freepik.com/free-vector/messages-concept-illustration_114360-583.jpg?t=st=1742563249~exp=1742566849~hmac=076f88f6e62ef30f6120829be7f2f9b426aa1a5255ef7975beffa72111aae4e1&w=900"
          />
        </div>
      </div>
      <div className="py-32 bg-zinc-100">
        <h1 className="text-4xl font-bold text-center">
          Honest Feedbacks are always Anonymous
        </h1>
        <FeedbackCarousel />
      </div>

      <div className="my-32">
        <h2 className="text-3xl text-center font-semibold my-8">
          What Features do We Offer ?
        </h2>
        <div className="flex justify-around  gap-x-8">
          <div className="flex flex-col items-center">
            <img
              className="h-52 w-auto"
              src="https://img.freepik.com/free-vector/top-secret-concept-illustration_114360-7692.jpg?semt=ais_hybrid"
              alt="Anonymous"
            />
            <h3 className="font-semibold text-xl mt-4">100% Anonymous</h3>
            <p className="text-gray-600">Your identity stays hidden—always.</p>
          </div>
          <div className="flex flex-col items-center">
            <img
              className="h-52 w-auto"
              src="https://img.freepik.com/free-vector/couple-chatting-social-media-vector_53876-62335.jpg?semt=ais_hybrid"
              alt="Easy to Share"
            />
            <h3 className="font-semibold text-xl mt-4">Easy to Share</h3>
            <p className="text-gray-600">
              Just send a link and start collecting feedback.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <img
              src="https://img.freepik.com/free-vector/access-control-system-abstract-concept_335657-3180.jpg?semt=ais_hybrid"
              alt="Secure & Private"
              className="h-52 w-auto"
            />
            <h3 className="font-semibold text-xl mt-4">Secure & Private</h3>
            <p className="text-gray-600">
              End-to-end encrypted for your peace of mind.
            </p>
          </div>
        </div>
      </div>
      <div className="text-center py-16">
        <h2 className="text-4xl font-bold">Ready to Get Honest Feedback?</h2>
        <div className="mt-8">
          <Link
            href="/sign-up"
            className=" bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            Get started for Free
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default page;
