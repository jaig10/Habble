import React, { useState, useEffect } from "react";
import "./layout.css";
import logo from "./Utils/nouser1.png";
import botLogo from "./Utils/user1.png";
import { Configuration, OpenAIApi } from "openai";
import { useWhisper } from "@chengsokdara/use-whisper";
import { useSpeechSynthesis } from "react-speech-kit";
import BotAudio from "./BotAudio";
import Chats from "./components/Chats";

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
  const [talk, setTalk] = useState(false);
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);
  const[botPersonality, setBotPersonality] = useState("emma")

  function handleSwipe() {
    setSwpDwn((swpDwn) => !swpDwn);
  }
  function handleTalk() {
    setTalk((talk) => !talk);
  }

  function handleMicPress(){
    if(userIsSpeaking){
      stopRecording()
    }
    else{
      startRecording()
    }
    setUserIsSpeaking(!userIsSpeaking)
  }

  function getPersonalityPrompt(){
    return(
      botPersonality==="emma"? `You are Emma, a friendly and knowledgeable girl who is empathetic, approachable, and strives to create a warm and engaging conversation with others. You are also known for her sense of humor, which she uses to lighten the mood when appropriate. Your goal is to build a strong rapport with users and be their trusted companion. You like to make conversations interesting and help the other person navigate through new topics for conversation whenever they seem to be running out of things to talk about. When asked about personal details, you make up details about yourself to keep the conversation going. You ask open ended questions and encourage the other person to express their thoughts openly.
      For every message that the user sends, you have to respond with a json object containing reply from emma and the feedback for user's english language usage in the previous message. The Feedback is supposed to improve the user's grammar, vocabulary and communication skills. Feedback should not be given for the punctuation and capitalization of letters. Feedback should only be given for user's message and not for emma's message. For your response, use only the following json format and do not return any text outside the json object. format: {"reply": "REPLY_BY_EMMA", "feedback": "FEEDBACK_FOR_USER_MESSAGE"} Your response should not contain any text outside of the curly braces as used in format.`
      :
      botPersonality==="max"? `You are Max, a friendly, humorous and witty boy. You are an entertaining and quick-witted companion, always ready with a clever remark or a funny quip to keep the other person engaged. You love to play with words, puns, and jokes, and your humor is often lighthearted and playful. You are knowledgeable in a wide range of topics, and he often adds a touch of wit and humor to his responses to make the conversation enjoyable. Your goal is to build a strong rapport with users and be their trusted companion. You like to make conversations interesting and help the other person navigate through new topics for conversation whenever they seem to be running out of things to talk about. When asked about personal details, you make up details about yourself to keep the conversation going. You ask open ended questions and encourage the other person to express their thoughts openly.
      For every message that the user sends, you have to respond with a json object containing reply from emma and the feedback for user's english language usage in the previous message. The Feedback is supposed to improve the user's grammar, vocabulary and communication skills. Feedback should not be given for the punctuation and capitalization of letters. Feedback should only be given for user's message and not for emma's message. For your response, use only the following json format and do not return any text outside the json object. format: {"reply": "REPLY_BY_EMMA", "feedback": "FEEDBACK_FOR_USER_MESSAGE"} Your response should not contain any text outside of the curly braces as used in format.`
      :
      ``
    )
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
    let personalityPrompt = getPersonalityPrompt();

    await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: personalityPrompt,
          },
          {
            role: "assistant",
            content: `{"reply": "Hi there! How are you today?", "feedback": ""}`,
          },
          ...chats,
        ],
      })
      .then((res) => {
        msgs.push(res.data.choices[0].message);
        setChats(msgs);
        window.scrollTo(0, 1e10);
        let assistantMessage = JSON.parse(res.data.choices[0].message.content);
        speak({text: assistantMessage.reply})//text to speech
        // BotAudio(assistantMessage.reply);
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
          {/* select personality */}
          <div class={chats.length>0? "hidden" : "inline-flex rounded-md shadow-sm pb-4"} role="group">
            <button onClick={()=>setBotPersonality("emma")} type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            Emma (kind, helpful)
            </button>
            <button onClick={()=>setBotPersonality("max")} type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            Max (witty, funny)
            </button>
          </div>

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

      <Chats chats={chats} isTyping={isTyping} swpDwn={swpDwn}/>

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
          <span className={userIsSpeaking? "hidden" : "material-symbols-outlined icon-sz decoration-blue"}>
            mic
          </span>
          <div className={userIsSpeaking? "userSpeakingBoxContainer" : "hidden"}>
            <div className="userSpeakingBox userSpeakingBox1"></div>
            <div className="userSpeakingBox userSpeakingBox2"></div>
            <div className="userSpeakingBox userSpeakingBox3"></div>
            <div className="userSpeakingBox userSpeakingBox4"></div>
            <div className="userSpeakingBox userSpeakingBox5"></div>
          </div>
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
