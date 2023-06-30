import React, { useState } from "react";
import "./LayoutWeb.css";
import logo from "./user.jpeg";
function LayoutWeb() {
    const [chatVisible, setChatVisible] = useState(false);
    function handleVisibility(){
        setChatVisible((chatVisible)=>!chatVisible);
    }
  return (
    <div className="cover bg-creme h-screen flex justify-center items-center">
    <h1 className="logo">Habble</h1>
      <div className="main relative w-1/2 " >
        <div className={`voices ${chatVisible} bg-grey flex flex-col justify-center items-center pt-8`}>
          <img
            className="rounded-full border border-gray-100 shadow-sm m-4"
            src="https://randomuser.me/api/portraits/women/81.jpg"
            alt="user image"
          ></img>
          <img
            className="rounded-full border border-gray-100 shadow-sm user "
            src={logo}
            // habble-chatbot-main\Utils\nouser.jpg
            alt="user image"
          ></img>
          <div className="controls bg-grey flex justify-center items-center">
            <div
              className="w-12 h-12 mx-2 bg-lightgrey rounded-full  flex justify-center items-center"
                onClick={handleVisibility}
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
                onClick={handleVisibility}
            >
              <span className="material-symbols-outlined icon-sz decoration-blue">
                mic
              </span>
            </div>
            <div
              className="w-12 h-12 mx-2 bg-lightgrey rounded-full p-5 flex justify-center items-center"
             
            >
              <span className="material-symbols-outlined call">
                phone_disabled
              </span>
            </div>
          </div>
        </div>
        <div className={`chats ${chatVisible} bg-white  absolute top-0 right-0 z-0`}>Chat</div>
      </div>
    </div>
  );
}

export default LayoutWeb;
