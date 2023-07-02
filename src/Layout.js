import React, { useState, useEffect } from "react";
import "./layout.css";
import logo from "./user.jpeg"
import { Configuration, OpenAIApi } from "openai";
import { useWhisper } from "@chengsokdara/use-whisper";
import { useSpeechSynthesis } from "react-speech-kit";
import BotAudio from "./BotAudio";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_TOKEN, //OPEN_AI_TOKEN
});
delete configuration.baseOptions.headers["User-Agent"]; //because calling api from frontend
const openai = new OpenAIApi(configuration);
console.log(process.env.REACT_APP_OPENAI_API_TOKEN);


function Layout() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [swpDwn, setSwpDwn] = useState(true);
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);

  function handleSwipe() {
    setSwpDwn((swpDwn) => !swpDwn);
  }

  function handleMicPress(){
    userIsSpeaking? stopRecording() : startRecording()
    setUserIsSpeaking(!userIsSpeaking)
  }

  const { transcript, startRecording, stopRecording } = useWhisper({
    apiKey: process.env.REACT_APP_OPENAI_API_TOKEN, //OPEN_AI_TOKEN
  });

  const { speak } = useSpeechSynthesis();
  let speech = new SpeechSynthesisUtterance();
  speech.lang = "en-US";
  let voices = []; // global array

  window.speechSynthesis.onvoiceschanged = () => {
    // Get List of Voices
    voices = window.speechSynthesis.getVoices();
    // console.log(voices);
    speech.voice = voices[3];
    // speech.voice = res1.audioUrl;
    // console.log(voices[3]);
    // console.log(speech.lang);
    // Initially set the First Voice in the Array.

    // Set the Voice Select List. (Set the Index as the value, which we'll use later when the user updates the Voice using the Select Menu.)
    // let voiceSelect = document.querySelector("#voices");
    // voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
  };

  const chat = async ( message) => {
    // e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    window.scrollTo(0, 1e10);
    // console.log(chats)
    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `you are languageGPT an assistant to help me improve my english language and conversation skills. You have to act like we are a tinder match and have a conversation with me. Reply should be a proper sentence and make up details about yourself if required.along with reply, include a short feedback of the grammar, vocabulary (ignore punctuations) and what can be improved in my previous message. use only the following json format and do not return any text outside the json object. format: {"reply": "CHAT_REPLY", "feedback": "FEEDBACK"} Your response should not contain any text outside of the curly braces as used in format`,
          },
          {
            role: "user",
            content: "Hi! What is your name",
          },
          {
            role: "assistant",
            content: `{"reply":"My name is Habble, and I'm excited to get to know you! What brings you to Tinder?", "feedback":"Good grammar and vocabulary. Keep it up!"}`,
          },
          ...chats,
        ],
      })
      .then((res) => {
        msgs.push(res.data.choices[0].message);
        setChats(msgs);
        window.scrollTo(0, 1e10);
        let assistantMessage = JSON.parse(res.data.choices[0].message.content);
        // speak({text: assistantMessage.reply})//text to speech
        // console.log(assistantMessage.reply);
        BotAudio(assistantMessage.reply);
        setIsTyping(false);
        // speech.text = assistantMessage.reply;
        // window.speechSynthesis.speak(speech);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  
  useEffect(() => {
    setMessage(transcript.text);
    console.log(transcript.text)
    chat(transcript.text)
  }, [transcript.text]);

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
        <div className="chat m-4 flex-col flex gap-5 overflow-y-auto"> 
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
          onClick={handleMicPress}
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
