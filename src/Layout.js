import React, { useState } from "react";
import "./layout.css";
import logo from "./user.jpeg"

function Layout() {
  const [swpDwn, setSwpDwn] = useState(true);
  function handleSwipe() {
    setSwpDwn((swpDwn) => !swpDwn);
  }
  return (
    <div className="h-screen">
      {swpDwn && (
        <div className="voice bg-grey flex flex-col justify-center items-center">
              <img
                className="rounded-full border user-sz mb-5 border-gray-100 shadow-sm"
                src="https://randomuser.me/api/portraits/women/81.jpg"
                alt="user image"
              />
              <img
                className="rounded-full border user-sz border-gray-100 shadow-sm"
                src={logo}
                alt="user image"
              />
        </div>
      )}
      {!swpDwn && <div className="chat">chatbot</div>}
      <div className="controls absolute bottom-0 w-full h-25 bg-grey flex justify-center items-center">
        <div
          className="w-12 h-12 mx-2 bg-lightgrey rounded-full  flex justify-center items-center"
          onClick={handleSwipe}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-message-circle bubble"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5"></path>
          </svg>
        </div>
        <div
          className="w-22 h-22 mx-2 bg-lightgrey rounded-full p-4 flex justify-center items-center"
          onClick={handleSwipe}
        >
          <span className="material-symbols-outlined icon-sz decoration-blue">mic</span>
        </div>
        <div
          className="w-12 h-12 mx-2 bg-lightgrey rounded-full p-5 flex justify-center items-center"
          onClick={handleSwipe}
        >
          <span className="material-symbols-outlined call">phone_disabled</span>
        </div>
      </div>
    </div>
  );
}

export default Layout;
