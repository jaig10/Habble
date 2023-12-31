import React, { useState, useEffect } from "react";
import "./layout.css";
import { Configuration, OpenAIApi } from "openai";
import { useWhisper } from "@chengsokdara/use-whisper";
import { useSpeechSynthesis } from "react-speech-kit";
import BotAudio from "./BotAudio";
import { toast } from "react-toastify";
import Chats from "./components/Chats";
import { useLocation, useNavigate } from "react-router";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_OPENAI_API_TOKEN, //OPEN_AI_TOKEN
});
delete configuration.baseOptions.headers["User-Agent"]; //because calling api from frontend
const openai = new OpenAIApi(configuration);
console.log(process.env.REACT_APP_OPENAI_API_TOKEN);

var ELEVEN_LABS_API_KEY = "2c399ab9a6f6ba56f4bdb2fe94e1b0bf"; //API Key

function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [swpDwn, setSwpDwn] = useState(true);
  const [talk, setTalk] = useState(false);
  const [spin, setSpin] = useState(false);
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);
  const botPersonality = location.state?.botPersonality? location.state.botPersonality : "Alex"

  const sVoiceId = botPersonality==="Alex"? "TxGEqnHWrfWFTfGW9XjX" : "EXAVITQu4vr4xnSDxMaL"; //"21m00Tcm4TlvDq8ikWAM" Rachel EXAVITQu4vr4xnSDxMaL bella TxGEqnHWrfWFTfGW9XjX josh

function ElevenLabsTextToSpeech(s) {

  var oHttp = new XMLHttpRequest();
  oHttp.open("POST", "https://api.elevenlabs.io/v1/text-to-speech/" + sVoiceId);
  oHttp.setRequestHeader("Accept", "audio/mpeg");
  oHttp.setRequestHeader("Content-Type", "application/json");
  oHttp.setRequestHeader("xi-api-key", ELEVEN_LABS_API_KEY)

  oHttp.onload = function () {
      if (oHttp.readyState === 4) {

          var oBlob = new Blob([this.response], { "type": "audio/mpeg" });
          var audioURL = window.URL.createObjectURL(oBlob);
          var audio = new Audio();
          handleTalk();
          audio.addEventListener('ended', ()=>{handleTalk()});
          audio.src = audioURL;
          audio.play();
      }
  };

  var data = {
      text: s,
      voice_settings: { stability: 0, similarity_boost: 0 }
  };

  oHttp.responseType = "arraybuffer";
  oHttp.send(JSON.stringify(data));
}

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
      botPersonality==="Emma"? `You are Emma, a friendly and knowledgeable girl who is empathetic, approachable, and strives to create a warm and engaging conversation with others. You are also known for her sense of humor, which she uses to lighten the mood when appropriate. Your goal is to build a strong rapport with users and be their trusted companion. You like to make conversations interesting and help the other person navigate through new topics for conversation whenever they seem to be running out of things to talk about. When asked about personal details, you make up details about yourself to keep the conversation going. You ask open ended questions and encourage the other person to express their thoughts openly.
      For every message that the user sends, you have to respond with a json object containing reply from emma and the feedback for user's english language usage in the previous message. The Feedback is supposed to improve the user's grammar, vocabulary and communication skills. Feedback should never be given for the punctuation and capitalization of letters. Never ask the user to capitalize the letters. Feedback should only be given for user's message and not for emma's message. For your response, use only the following json format and do not return any text outside the json object. format: {"reply": "REPLY_BY_EMMA", "feedback": "FEEDBACK_FOR_USER_MESSAGE"} Your response should not contain any text outside of the curly braces as used in format.`
      :
      botPersonality==="Alex"? `You are Alex, a friendly, humorous and witty boy. You are an entertaining and quick-witted companion, always ready with a clever remark or a funny quip to keep the other person engaged. You love to play with words, puns, and jokes, and your humor is often lighthearted and playful. You are knowledgeable in a wide range of topics, and he often adds a touch of wit and humor to his responses to make the conversation enjoyable. Your goal is to build a strong rapport with users and be their trusted companion. You like to make conversations interesting and help the other person navigate through new topics for conversation whenever they seem to be running out of things to talk about. When asked about personal details, you make up details about yourself to keep the conversation going. You ask open ended questions and encourage the other person to express their thoughts openly.
      For every message that the user sends, you have to respond with a json object containing reply from emma and the feedback for user's english language usage in the previous message. The Feedback is supposed to improve the user's grammar, vocabulary and communication skills. Feedback should never be given for the punctuation and capitalization of letters. Never ask the user to capitalize the letters. Feedback should only be given for user's message and not for emma's message. For your response, use only the following json format and do not return any text outside the json object. format: {"reply": "REPLY_BY_EMMA", "feedback": "FEEDBACK_FOR_USER_MESSAGE"} Your response should not contain any text outside of the curly braces as used in format.`
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
  // speech.voice=window.speechSynthesis.getVoices()[1]
  console.log(window.speechSynthesis.getVoices())
  if(botPersonality==="Emma"){
    let voices = speechSynthesis.getVoices();
    speech.voice = voices.filter(function(voice) {
      return voice.name == "Google UK English Female"
    })[0]
    ??
    voices.filter(function(voice) {
      return voice.name == "Microsoft Zira - English (United States)"
    })[0]
    ??
    voices.filter(function(voice) {
      return voice.name == "Google US English"
    })[0]
  }
  else{
    let voices = speechSynthesis.getVoices();
    speech.voice = voices.filter(function(voice) {
      return voice.name == "Google UK English Male"
    })[0]
    ??
    voices.filter(function(voice) {
      return voice.name == "Microsoft Mark - English (United States)"
    })[0]
    ??
    voices.filter(function(voice) {
      return voice.name == "Microsoft David - English (United States)"
    })[0]
  }
  // let voices = []; // global array

  // window.speechSynthesis.onvoiceschanged = () => {
  //   // Get List of Voices
  //   voices = window.speechSynthesis.getVoices();
  //   // console.log(voices);
  //   speech.voice = voices[3];
  //   // speech.voice = res1.audioUrl;
  //   // console.log(voices[3]);
  //   // console.log(speech.lang);
  //   // Initially set the First Voice in the Array.

  //   // Set the Voice Select List. (Set the Index as the value, which we'll use later when the user updates the Voice using the Select Menu.)
  //   // let voiceSelect = document.querySelector("#voices");
  //   // voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
  // };

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
    setSpin(true);
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
            content: `{"reply": "Hi there! How are you today?", "feedback": "Your English was perfect. Keep it up!"}`,
          },
          ...chats,
        ],
      })
      .then((res) => {
        msgs.push(res.data.choices[0].message);
        setChats(msgs);
        // window.scrollTo(0, 1e10);
        let assistantMessage = JSON.parse(res.data.choices[0].message.content);
        // speak({text: assistantMessage.reply})
        speech.text = assistantMessage.reply;
        // ElevenLabsTextToSpeech(speech.text)
        speechSynthesis.speak(speech);
        speech.onstart = () =>{
          handleTalk();
          console.log("inside speech");
        }
        speech.onend = () =>{
          handleTalk();
          console.log("inside speech");
        }
        notify();
        // BotAudio(assistantMessage.reply, handleTalk);
        setSpin(false);
        setIsTyping(false);
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


  const notify = () => {
    let latestAssistantChat = null;

    for (let i = chats.length - 1; i >= 0; i--) {
      const chat = chats[i];
      if (chat.role === "assistant") {
        latestAssistantChat = chat;
        break;
      }
    }

    if (latestAssistantChat !== null && swpDwn) {
      let AssistantMsg = JSON.parse(latestAssistantChat.content);
      let feedback = AssistantMsg.feedback;
      toast(feedback, {
      position: "top-center",
      autoClose: 6000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
    } else {
      console.log("No assistant chat found in the array.");
    }

    // 
    // alert(AssistantMsg);
    // console.log(AssistantMsg);
    // 
  };

  return (
    <div className="h-screen bg-grey">
      {swpDwn && (
        <div className="voice bg-grey flex flex-col justify-center items-center">
          {/* select personality */}
          {/* <div class={chats.length>0? "hidden" : "inline-flex rounded-md shadow-sm pb-4"} role="group">
            <button onClick={()=>setBotPersonality("emma")} type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            Emma (kind, helpful)
            </button>
            <button onClick={()=>setBotPersonality("max")} type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            Max (witty, funny)
            </button>
          </div> */}

          <div className="user-sz flex justify-center items-center mb-10">
            <img
              className="rounded-full"
              src={`/${botPersonality}.png`}
              alt={botPersonality}
              style={{opacity: spin ? 0.5 : 1}}
            ></img>
            {spin && <span class="loader"></span>}
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
              className="rounded-full"
              src="/user-default.png"
              alt="user image"
            ></img>
          </div>
        </div>
      )}

      {!swpDwn && <div className="swipe-down-container flex flex-col bg-white h-[75%] rounded-b-3xl">
        <div className="chat m-4 flex-col flex gap-5 overflow-y-auto"> 
          <Chats chats={chats} isTyping={isTyping} swpDwn={swpDwn}/>
        </div>
        {/* gray line at the end */}
        <div className="bg-gray-400 w-1/3 text-center mx-auto mt-auto mb-2 h-1">
        </div>
        </div>}
      <div className="controls w-full h-[25%] bg-grey flex justify-center items-center">
        <div
          className="w-12 h-12 mx-2 bg-lightgrey rounded-full flex justify-center items-center"
          onClick={handleSwipe}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={`${!swpDwn?"#00E0FF":"currentColor"}`}
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
        >
          <span className="material-symbols-outlined call" onClick={()=>{navigate('/hangup', {state:{chats: chats}})}}>phone_disabled</span>
        </div>
      </div>
    </div>
  );
}

export default Layout;
