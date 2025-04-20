import React from "react";

function LoadingComponent({
  title,
  subtitle,
  imageUrl,
}: {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}) {
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen max-w-4xl mx-auto">
      <div className="flex flex-col gap-2 items-center justify-center">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
      <img className="w-full max-w-96 h-auto" src={imageUrl} />
    </div>
  );
}

export default LoadingComponent;
