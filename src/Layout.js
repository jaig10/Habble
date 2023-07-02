import React, { useState } from "react";
import "./layout.css";
import logo from "./user.jpeg"

function Layout() {
  const [isTyping, setIsTyping] = useState(true)
  const [chats, SetChats] = useState([{"role":"user","content":"Hello Hello How are you?"},{"role":"assistant","content":"{\"reply\": \"Hello! I'm doing great, thank you for asking. How about you? How has your day been so far?\", \"feedback\": \"Good grammar and vocabulary. Just make sure to use proper capitalization for the first word of a sentence.\"}"},{"role":"user","content":"ok"}])
  
  const [swpDwn, setSwpDwn] = useState(true);
  function handleSwipe() {
    setSwpDwn((swpDwn) => !swpDwn);
  }
  return (
    <div className="h-screen bg-grey">
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
      {!swpDwn && <div className="swipe-down-container flex flex-col bg-white h-[67%] rounded-b-3xl">
        <div className="chat m-4 flex-col flex gap-5"> 
          {chats && chats.length
              ? chats.map((chat, index) => {
                  if (chat.role === "user") {
                    return (
                      <div
                        key={index}
                        className="userMsg rounded-md bg-darkpurple max-w-[60%] ml-auto"
                      >
                        <p className="text-white p-2">
                          {chat.content}
                        </p>
                      </div>
                    );
                  } else if(chat.role === "assistant") {
                    // console.log(JSON.parse(chat.content))
                    let AssistantMsg = JSON.parse(chat.content);
                    return (
                     <div key={index} className="flex-col flex gap-2">
                        <div
                          className="botMsg rounded-md bg-lightergrey max-w-[65%] mr-auto"
                        >
                          <p className="text-black font-medium p-2">
                            {AssistantMsg.reply}
                          </p>
                        </div>
                        
                        <div
                          className="botMsg rounded-md bg-lightpink max-w-[65%] mr-auto"
                        >
                          <p className="text-indigoish italic p-2">
                            {AssistantMsg.feedback}
                          </p>
                        </div>
                     </div>
                      
                    );
                  }
                }
                )
              : ""}
              <div className={isTyping? "rounded-xl bg-lightergrey mr-auto" : "hidden"}>
                <div className="typing-animation px-3 py-4">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
        </div>
        {/* gray line at the end */}
        <div className="bg-gray-400 w-1/3 text-center mx-auto mt-auto mb-2 h-1">
        </div>
        </div>}
      <div className="controls absolute bottom-0 w-full h-[33%] bg-grey flex justify-center items-center">
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
