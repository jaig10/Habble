import React, { useEffect, useState } from "react";
import "./LayoutWeb.css";
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

function LayoutWeb() {
  const location = useLocation()
  const navigate = useNavigate()
  const [chatVisible, setChatVisible] = useState(false);
  const [talk, setTalk] = useState(false);
  const [spin, setSpin] = useState(false);
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [userIsSpeaking, setUserIsSpeaking] = useState(false);
  const [hungup, setHungup] = useState(false);
  const botPersonality = location.state?.botPersonality? location.state.botPersonality : "Alex"
  const [message, setMessage] = useState("");
  function handleVisibility() {
    setChatVisible((chatVisible) => !chatVisible);
  }
  function handleTalk() {
    setTalk((talk) => !talk);
  }
  function handleMicPress() {
    userIsSpeaking ? stopRecording() : startRecording();
    setUserIsSpeaking(!userIsSpeaking);
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

  const chat = async (message) => {
    // e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    window.scrollTo(0, 1e10);
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
        window.scrollTo(0, 1e10);
        let assistantMessage = JSON.parse(res.data.choices[0].message.content);
        speech.text = assistantMessage.reply;
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
    console.log(transcript.text);
    chat(transcript.text);
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

    if (latestAssistantChat !== null && !chatVisible) {
      let AssistantMsg = JSON.parse(latestAssistantChat.content);
      let feedback = AssistantMsg.feedback;
    toast(feedback, {
      position: "top-center",
      autoClose: 5000,
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
    <div className="cover bg-creme h-screen flex justify-center items-center">
      <svg
        className="logo"
        width="150"
        height="94"
        viewBox="0 0 227 94"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M88.92 47.24C90.12 46.64 91.38 46.22 92.7 45.98C94.02 45.7 95.32 45.64 96.6 45.8C97.92 45.92 99.18 46.26 100.38 46.82C101.58 47.34 102.7 48.1 103.74 49.1C104.78 50.14 105.58 51.28 106.14 52.52C106.7 53.76 107.1 55.14 107.34 56.66C107.5 57.7 107.76 58.66 108.12 59.54C108.48 60.42 108.86 61.3 109.26 62.18C109.7 63.06 110.1 63.94 110.46 64.82C110.86 65.7 111.18 66.62 111.42 67.58C111.62 68.5 111.54 69.4 111.18 70.28C110.86 71.12 110.18 71.64 109.14 71.84C108.54 71.96 107.96 71.92 107.4 71.72C106.88 71.48 106.4 71.16 105.96 70.76C105.52 70.32 105.12 69.86 104.76 69.38C104.44 68.86 104.14 68.38 103.86 67.94C102.94 69.14 101.94 70.08 100.86 70.76C99.78 71.4 98.48 71.82 96.96 72.02C95.68 72.18 94.46 72.22 93.3 72.14C92.14 72.06 90.9 71.84 89.58 71.48C87.86 71.04 86.44 70.28 85.32 69.2C84.24 68.08 83.4 66.8 82.8 65.36C82.24 63.88 81.94 62.3 81.9 60.62C81.86 58.94 82.06 57.28 82.5 55.64C83.06 53.48 83.9 51.72 85.02 50.36C86.14 49 87.44 47.96 88.92 47.24ZM90.42 54.26C89.86 54.82 89.42 55.48 89.1 56.24C88.78 57 88.58 57.8 88.5 58.64C88.46 59.48 88.54 60.32 88.74 61.16C88.94 62 89.26 62.74 89.7 63.38C90.1 63.94 90.78 64.42 91.74 64.82C92.7 65.18 93.7 65.4 94.74 65.48C95.94 65.56 96.98 65.24 97.86 64.52C98.78 63.8 99.46 62.9 99.9 61.82C100.38 60.7 100.6 59.52 100.56 58.28C100.52 57 100.18 55.84 99.54 54.8C99.06 54.04 98.42 53.48 97.62 53.12C96.86 52.76 96.04 52.58 95.16 52.58C94.28 52.54 93.4 52.68 92.52 53C91.68 53.28 90.98 53.7 90.42 54.26ZM119.532 34.5799C119.612 33.1399 120.052 31.9799 120.852 31.0999C121.692 30.2199 122.872 29.9799 124.392 30.3799C125.112 30.5799 125.632 30.8799 125.952 31.2799C126.312 31.6799 126.552 32.1599 126.672 32.7199C126.832 33.2399 126.912 33.8199 126.912 34.4599C126.912 35.0599 126.912 35.6599 126.912 36.2599V44.54C126.872 44.86 126.852 45.18 126.852 45.5C126.892 45.78 126.912 46.04 126.912 46.28V47.06H128.412C128.852 47.06 129.272 47.06 129.672 47.06C130.112 47.06 130.492 47.04 130.812 47C133.012 47 134.892 47.32 136.452 47.96C138.052 48.6 139.332 49.5 140.292 50.66C141.292 51.78 142.012 53.14 142.452 54.74C142.932 56.3 143.152 58.02 143.112 59.9C143.072 62.14 142.712 64.06 142.032 65.66C141.352 67.26 140.392 68.58 139.152 69.62C137.912 70.66 136.412 71.44 134.652 71.96C132.932 72.44 130.992 72.68 128.832 72.68C126.352 72.68 124.472 72.66 123.192 72.62C121.912 72.58 120.992 72.22 120.432 71.54C119.912 70.86 119.632 69.68 119.592 68C119.552 66.32 119.532 63.86 119.532 60.62C119.532 57.5 119.532 54.42 119.532 51.38C119.572 48.34 119.572 45.28 119.532 42.2C119.532 41.7999 119.512 41.3799 119.472 40.9399C119.472 40.4999 119.472 39.9999 119.472 39.4399C119.472 38.8799 119.472 38.2199 119.472 37.4599C119.472 36.6599 119.492 35.6999 119.532 34.5799ZM130.752 65.96C132.952 65.84 134.472 65.24 135.312 64.16C135.752 63.56 136.092 62.84 136.332 62C136.572 61.16 136.672 60.32 136.632 59.48C136.592 58.64 136.412 57.84 136.092 57.08C135.812 56.28 135.352 55.62 134.712 55.1C134.152 54.62 133.592 54.28 133.032 54.08C132.472 53.84 131.892 53.7 131.292 53.66C130.692 53.58 130.052 53.56 129.372 53.6C128.692 53.6 127.912 53.62 127.032 53.66V60.86L126.912 65.84C127.312 65.88 127.732 65.92 128.172 65.96C128.932 66.04 129.792 66.04 130.752 65.96ZM151.067 34.5799C151.147 33.1399 151.587 31.9799 152.387 31.0999C153.227 30.2199 154.407 29.9799 155.927 30.3799C156.647 30.5799 157.167 30.8799 157.487 31.2799C157.847 31.6799 158.087 32.1599 158.207 32.7199C158.367 33.2399 158.447 33.8199 158.447 34.4599C158.447 35.0599 158.447 35.6599 158.447 36.2599V44.54C158.407 44.86 158.387 45.18 158.387 45.5C158.427 45.78 158.447 46.04 158.447 46.28V47.06H159.947C160.387 47.06 160.807 47.06 161.207 47.06C161.647 47.06 162.027 47.04 162.347 47C164.547 47 166.427 47.32 167.987 47.96C169.587 48.6 170.867 49.5 171.827 50.66C172.827 51.78 173.547 53.14 173.987 54.74C174.467 56.3 174.687 58.02 174.647 59.9C174.607 62.14 174.247 64.06 173.567 65.66C172.887 67.26 171.927 68.58 170.687 69.62C169.447 70.66 167.947 71.44 166.187 71.96C164.467 72.44 162.527 72.68 160.367 72.68C157.887 72.68 156.007 72.66 154.727 72.62C153.447 72.58 152.527 72.22 151.967 71.54C151.447 70.86 151.167 69.68 151.127 68C151.087 66.32 151.067 63.86 151.067 60.62C151.067 57.5 151.067 54.42 151.067 51.38C151.107 48.34 151.107 45.28 151.067 42.2C151.067 41.7999 151.047 41.3799 151.007 40.9399C151.007 40.4999 151.007 39.9999 151.007 39.4399C151.007 38.8799 151.007 38.2199 151.007 37.4599C151.007 36.6599 151.027 35.6999 151.067 34.5799ZM162.287 65.96C164.487 65.84 166.007 65.24 166.847 64.16C167.287 63.56 167.627 62.84 167.867 62C168.107 61.16 168.207 60.32 168.167 59.48C168.127 58.64 167.947 57.84 167.627 57.08C167.347 56.28 166.887 55.62 166.247 55.1C165.687 54.62 165.127 54.28 164.567 54.08C164.007 53.84 163.427 53.7 162.827 53.66C162.227 53.58 161.587 53.56 160.907 53.6C160.227 53.6 159.447 53.62 158.567 53.66V60.86L158.447 65.84C158.847 65.88 159.267 65.92 159.707 65.96C160.467 66.04 161.327 66.04 162.287 65.96ZM190.462 67.7C190.422 67.9 190.382 68.1 190.342 68.3C190.342 68.46 190.342 68.64 190.342 68.84L189.982 70.1C189.902 70.26 189.842 70.36 189.802 70.4L189.622 70.76C189.422 71.2 189.062 71.56 188.542 71.84C187.582 72.32 186.562 72.44 185.482 72.2C184.802 72.12 184.262 71.92 183.862 71.6C183.462 71.32 183.182 70.98 183.022 70.58C182.862 70.18 182.742 69.78 182.662 69.38C182.542 68.98 182.482 68.62 182.482 68.3V34.6999C182.482 34.4199 182.482 34.1799 182.482 33.9799C182.522 33.7399 182.562 33.5199 182.602 33.3199C182.642 33.0399 182.682 32.7999 182.722 32.5999C182.802 32.3999 182.882 32.1799 182.962 31.9399C183.082 31.5399 183.302 31.2199 183.622 30.9799C184.102 30.6199 184.562 30.4199 185.002 30.3799C185.282 30.2999 185.542 30.2599 185.782 30.2599C186.022 30.2199 186.302 30.1999 186.622 30.1999C187.182 30.1999 187.822 30.3599 188.542 30.6799C189.102 30.9999 189.502 31.4399 189.742 31.9999C190.142 32.7999 190.342 33.5399 190.342 34.2199C190.382 34.6199 190.402 35.2199 190.402 36.0199C190.442 36.8199 190.462 37.4199 190.462 37.8199V38.0599C190.542 39.3399 190.582 40.5799 190.582 41.7799C190.582 42.94 190.562 44.22 190.522 45.62C190.522 46.98 190.502 48.3 190.462 49.58C190.462 50.82 190.462 52.06 190.462 53.3V65.9C190.462 66.06 190.462 66.22 190.462 66.38C190.502 66.5 190.522 66.64 190.522 66.8C190.522 67.2 190.502 67.5 190.462 67.7ZM219.133 64.28C219.613 64.16 220.093 64.08 220.573 64.04C221.093 64 221.553 64.06 221.953 64.22C222.393 64.38 222.753 64.66 223.033 65.06C223.313 65.42 223.453 65.94 223.453 66.62C223.453 67.1 223.333 67.56 223.093 68C222.853 68.44 222.553 68.84 222.193 69.2C221.833 69.56 221.433 69.88 220.993 70.16C220.553 70.4 220.133 70.6 219.733 70.76C218.573 71.28 217.233 71.68 215.713 71.96C214.233 72.24 212.693 72.34 211.093 72.26C208.933 72.18 206.853 71.76 204.853 71C202.893 70.2 201.353 68.9 200.233 67.1C199.193 65.34 198.573 63.38 198.373 61.22C198.173 59.06 198.273 57.02 198.673 55.1C199.113 52.78 199.853 50.9 200.893 49.46C201.973 47.98 203.253 46.8 204.733 45.92C206.533 44.88 208.553 44.34 210.793 44.3C213.033 44.26 215.173 44.7 217.213 45.62C218.573 46.22 219.793 47.04 220.873 48.08C221.953 49.08 222.773 50.3 223.333 51.74C223.493 52.1 223.613 52.54 223.693 53.06C223.813 53.58 223.893 54.14 223.933 54.74C223.973 55.3 223.973 55.86 223.933 56.42C223.893 56.98 223.793 57.48 223.633 57.92C223.393 58.64 223.093 59.2 222.733 59.6C222.373 60 221.913 60.3 221.353 60.5C220.793 60.7 220.113 60.84 219.313 60.92C218.553 60.96 217.633 61 216.553 61.04C215.593 61.08 214.693 61.1 213.853 61.1C213.013 61.1 212.153 61.1 211.273 61.1C210.393 61.06 209.473 61.04 208.513 61.04C207.593 61 206.553 60.96 205.393 60.92C205.273 61.72 205.373 62.42 205.693 63.02C206.053 63.58 206.533 64.06 207.133 64.46C207.733 64.82 208.413 65.1 209.173 65.3C209.933 65.5 210.673 65.62 211.393 65.66C212.753 65.74 214.053 65.64 215.293 65.36C216.533 65.04 217.813 64.68 219.133 64.28ZM216.553 52.64C215.793 51.76 214.993 51.12 214.153 50.72C213.513 50.44 212.833 50.32 212.113 50.36C211.433 50.36 210.773 50.46 210.133 50.66C208.973 50.94 207.993 51.54 207.193 52.46C207.113 52.54 206.973 52.74 206.773 53.06C206.573 53.34 206.373 53.64 206.173 53.96C206.013 54.28 205.893 54.58 205.813 54.86C205.733 55.14 205.773 55.28 205.933 55.28H217.693C217.653 54.72 217.553 54.26 217.393 53.9C217.233 53.5 216.953 53.08 216.553 52.64Z"
          fill="black"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 6C10.7452 6 0 16.7452 0 30V58C0 69.4206 7.97714 78.9781 18.6635 81.4046L22.1076 90.9015C22.9885 93.3306 25.3486 93.5588 26.3305 91.3098L30.395 82H53C66.2548 82 77 71.2548 77 58V30C77 16.7452 66.2548 6 53 6H24Z"
          fill="#DBFF00"
        />
        <path
          d="M59.6001 20.5749C59.6501 20.9249 59.6751 21.2499 59.6751 21.5499C59.6751 21.8499 59.6751 22.1499 59.6751 22.4499V25.5249L59.2251 64.45V65.2C59.2251 65.5 59.1501 65.95 59.0001 66.55C58.9501 66.8 58.8751 67.075 58.7751 67.375C58.6751 67.625 58.5751 67.9 58.4751 68.2C58.2251 68.8 57.8751 69.25 57.4251 69.55C57.0251 69.95 56.3751 70.225 55.4751 70.375C54.0751 70.675 52.8001 70.55 51.6501 70C51.0001 69.6 50.5501 69.1 50.3001 68.5C50.2001 68.4 50.1001 68.25 50.0001 68.05C50.0001 67.95 49.9501 67.8 49.8501 67.6C49.7501 67.35 49.6751 67.1 49.6251 66.85C49.5751 66.55 49.5251 66.25 49.4751 65.95C49.4751 65.7 49.4501 65.45 49.4001 65.2C49.4001 64.95 49.3751 64.7 49.3251 64.45C49.2251 64.2 49.1751 64 49.1751 63.85C49.1751 63.65 49.1751 63.425 49.1751 63.175C49.2751 62.975 49.3251 62.6 49.3251 62.05L49.4001 56.125L49.4751 46.675H45.425L30.2 46.75L30.05 64.45V65.2C30.05 65.5 29.975 65.95 29.825 66.55C29.775 66.8 29.7 67.075 29.6 67.375C29.5 67.625 29.4 67.9 29.3 68.2C29.05 68.8 28.7 69.25 28.25 69.55C27.85 69.95 27.2 70.225 26.3 70.375C24.9 70.675 23.625 70.55 22.475 70C21.975 69.7 21.5 69.2 21.05 68.5C20.95 68.3 20.9 68.15 20.9 68.05L20.675 67.6C20.575 67.35 20.5 67.1 20.45 66.85C20.4 66.55 20.35 66.25 20.3 65.95C20.3 65.7 20.275 65.45 20.225 65.2C20.175 64.95 20.125 64.7 20.075 64.45C20.025 64.05 20.025 63.625 20.075 63.175V62.05L20.15 56.125L20.3 45.1C20.35 43.5 20.375 41.85 20.375 40.1499C20.375 38.4499 20.375 36.6999 20.375 34.8999C20.325 33.0999 20.3 31.4999 20.3 30.0999C20.35 28.6999 20.425 27.1249 20.525 25.3749V25.0749C20.575 24.5749 20.6 24.0749 20.6 23.5749C20.6 23.0249 20.625 22.4749 20.675 21.9249C20.725 21.4249 20.8 20.9499 20.9 20.4999C21.05 19.9999 21.25 19.4999 21.5 18.9999C21.65 18.5999 21.85 18.2749 22.1 18.0249C22.35 17.7249 22.65 17.4499 23 17.1999C23.8 16.7999 24.6 16.5999 25.4 16.5999C25.8 16.5999 26.15 16.6249 26.45 16.6749C26.75 16.6749 27.05 16.6999 27.35 16.7499C27.95 16.7999 28.525 17.0999 29.075 17.6499C29.475 17.9999 29.75 18.3999 29.9 18.8499C30.15 19.4999 30.3 20.0749 30.35 20.5749C30.4 20.9249 30.425 21.2499 30.425 21.5499C30.425 21.8499 30.425 22.1499 30.425 22.4499V25.5249L30.275 37.8999C30.675 37.8999 31.125 37.8999 31.625 37.8999C32.175 37.8999 32.8 37.8749 33.5 37.8249C36.1 37.8249 38.675 37.8499 41.225 37.8999C43.825 37.9499 46.55 37.9749 49.4001 37.9749H49.4751C49.4751 35.7249 49.4751 33.5749 49.4751 31.5249C49.5251 29.4749 49.6001 27.3249 49.7001 25.0749C49.7001 24.5749 49.7001 24.0749 49.7001 23.5749C49.7501 23.0249 49.8001 22.4749 49.8501 21.9249C49.9001 21.4249 49.9751 20.9499 50.0751 20.4999C50.2251 19.9999 50.4251 19.4999 50.6751 18.9999C50.7751 18.5999 50.9501 18.2749 51.2001 18.0249C51.5001 17.7249 51.8501 17.4499 52.2501 17.1999C52.9501 16.7999 53.7251 16.5999 54.5751 16.5999C54.9751 16.5999 55.3251 16.6249 55.6251 16.6749C55.9751 16.6749 56.2751 16.6999 56.5251 16.7499C57.2251 16.8499 57.8001 17.1499 58.2501 17.6499C58.6501 17.8999 58.9251 18.2999 59.0751 18.8499C59.1751 19.1499 59.2501 19.4499 59.3001 19.7499C59.4001 19.9999 59.5001 20.2749 59.6001 20.5749Z"
          fill="black"
        />
      </svg>
      <div className="main relative w-1/2 ">
      {/* select personality */}
      {/* <div class={chats.length>0? "hidden" : "inline-flex rounded-md shadow-sm"} role="group">
        <button onClick={()=>setBotPersonality("emma")} type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
        Emma (kind, helpful)
        </button>
        <button onClick={()=>setBotPersonality("max")} type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
        Max (witty, funny)
        </button>
      </div> */}

        <div
          className={`voices ${chatVisible} bg-grey flex flex-col justify-center items-center pt-8 rounded-lg`}
        >
          <div className="image flex justify-center items-center mb-4">
            <img
              className="rounded-full"
              src={`/${botPersonality}.png`}
              alt={botPersonality}
            ></img>
            {spin && <span class="loader"></span>}
            {/* <svg width="196" height="196" viewBox="0 0 196 196" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle id="Ellipse 51" cx="98" cy="98" r="98" fill="#6A6A6A" fill-opacity="0.64"/>
</svg> */}
            {talk && (
              <svg
                className="absolute"
                width="170"
                height="170"
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
          <div className="image flex justify-center">
            <img
              className="rounded-full user "
              src="/user-default.png"
              alt="user image"
            ></img>
          </div>

          <div className="controls bg-grey flex justify-center items-center">
            <div
              className="w-12 h-12 mx-2 bg-lightgrey rounded-full  flex justify-center items-center cursor-pointer"
              onClick={handleVisibility}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke={`${chatVisible?"#00E0FF":"currentColor"}`}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-message-circle bubble"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5"></path>
              </svg>
            </div>
            <div
              className="w-22 h-22 mx-2 bg-lightgrey rounded-full p-4 flex justify-center items-center cursor-pointer"
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
            <div className="w-12 h-12 mx-2 bg-lightgrey rounded-full p-5 flex justify-center items-center cursor-pointer" onClick={()=>{setHungup(true)}}>
              <span className="material-symbols-outlined call">
                phone_disabled
              </span>
            </div>
          </div>
        </div>
        <div
          className={`${hungup?"hangup":""} chats ${chatVisible} bg-white  absolute top-0 right-0 `}
        >
          <div className="swipe-down-container flex flex-col bg-white h-[100%] rounded-b-3xl">
            <div className="chat m-4 flex-col flex gap-5 overflow-y-auto">
              <Chats chats={chats} isTyping={isTyping}/>
            </div>
            <span className={`flex justify-end mx-4 cursor-pointer ${hungup?"":"hidden"}`} onClick={()=>{navigate('/avatar')}}>X</span> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default LayoutWeb;
