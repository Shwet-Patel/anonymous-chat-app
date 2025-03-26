"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const exampleFeedbacks = [
  "I really appreciate your work. Keep going!",
  "Your leadership skills have improved a lot!",
  "You need to communicate more clearly in meetings.",
  "Great job on the recent project! Your efforts didn’t go unnoticed.",
];

const FeedbackCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % exampleFeedbacks.length);
    }, 3000); // Change messages every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative max-w-xl mx-4 md:mx-auto mt-12">
      <div className="overflow-hidden rounded-lg bg-white p-4 md:p-6 shadow-lg">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="text-lg text-gray-800 text-center"
          >
            <div className="my-4">"{exampleFeedbacks[index]}"</div>
            <div className="flex justify-center text-black font-semibold">
              -Anonymous User
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FeedbackCarousel;
