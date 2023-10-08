import React from "react";
import { ReactComponent as Loader } from "../Assets/Loader/loader.svg";
export default function LoadingFallback() {
  return (
    <div className="flex justify-center items-center h-screen">
      {/* <div
                className="spinner-border text-movementColor animate-spin inline-block w-8 h-8 border-4 rounded-full"
                role="status"
            ></div> */}
      <Loader />
    </div>
  );
}
