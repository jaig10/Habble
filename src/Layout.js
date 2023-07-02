import React, { useState } from "react";
import "./layout.css";
import logo from "./Utils/nouser1.png";
import botLogo from "./Utils/user1.png";
function Layout() {
  const [swpDwn, setSwpDwn] = useState(true);
  const [talk, setTalk] = useState(false);
  function handleSwipe() {
    setSwpDwn((swpDwn) => !swpDwn);
  }
  function handleTalk() {
    setTalk((talk) => !talk);
  }
  return (
    <div className="h-screen">
      {swpDwn && (
        <div className="voice bg-grey flex flex-col justify-center items-center">
          <div className="user-sz flex justify-center items-center mb-10">
            <img
              className="rounded-full border border-gray-100 shadow-sm"
              src={botLogo}
              alt="bot image"
            ></img>
            {talk && (
              <svg
                className="absolute"
                width="220"
                height="220"
                viewBox="0 0 236 236"
                preserveAspectRatio="xMidYMin"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="Group 551">
                  <g id="Group 30">
                    <circle
                      id="Ellipse 4"
                      cx="118.5"
                      cy="118.5"
                      r="106"
                      stroke="#BCBCBC"
                      strokeOpacity="0.8"
                      strokeWidth="5"
                    />
                  </g>
                  <g id="Group 549">
                    <circle
                      id="Ellipse 4_2"
                      cx="118"
                      cy="118"
                      r="115.5"
                      stroke="#868686"
                      strokeOpacity="0.8"
                      strokeWidth="5"
                    />
                  </g>
                </g>
              </svg>
            )}
          </div>
          <div className="user-sz flex justify-center items-center">
            <img
              className="rounded-full border border-gray-100 shadow-sm"
              src={logo}
              // habble-chatbot-main\Utils\nouser.jpg
              alt="user image"
              onClick={handleTalk}
            ></img>
          </div>
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
          <span className="material-symbols-outlined icon-sz decoration-blue">
            mic
          </span>
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
