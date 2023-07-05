const fetch = require("node-fetch");
// const axios = require('axios');

// function BotAudio(message){
//   function getVoices() {
//     let voices = speechSynthesis.getVoices();
//     if(!voices.length){
//       // some time the voice will not be initialized so we can call spaek with empty string
//       // this will initialize the voices 
//       let utterance = new SpeechSynthesisUtterance("");
//       speechSynthesis.speak(utterance);
//       voices = speechSynthesis.getVoices();
//     }
//     return voices;
//   }

//   let speakData = new SpeechSynthesisUtterance();
//   let voices = getVoices();
//   console.log(voices);
//   speakData.lang = 'en';
//   speakData.volume = 1;
//   speakData.voice = voices[3];
//   speakData.text = message;
//   speechSynthesis.speak(speakData);

// }
function BotAudio(message, handleTalk){
  // let audio = null;
  const url = "https://play.ht/api/v1/convert";
  const options = {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      AUTHORIZATION: "28d182549f074d6d97e5d2512991b8d0",
      "X-USER-ID": "LJKmJiGQk7Tvg7xpQI01uLsiHZ02",
    },
    body: JSON.stringify({ content: [message], voice: "en-US-JennyNeural" }),
  };
  
  const fetchTranscriptionId = async () => {
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const transactionId = data.transcriptionId;
      console.log(transactionId);
      return transactionId;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };
  
  const fetchArticleStatus = async (trans) => {
    const url1 = `https://play.ht/api/v1/articleStatus?transcriptionId=${trans}`;
    const options1 = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        AUTHORIZATION: "28d182549f074d6d97e5d2512991b8d0",
        "X-USER-ID": "LJKmJiGQk7Tvg7xpQI01uLsiHZ02",
      }
    };
  
    try {
      let backoff = 1000; // Initial delay of 1 second
      let retries = 0;
  
      while (true) {
        const response1 = await fetch(url1, options1);
        const data1 = await response1.json();
        console.log(data1);
  
        if (data1.converted) {
          var audio = new Audio(data1.audioUrl);
          handleTalk();
          audio.addEventListener('ended', ()=>{handleTalk()});
          audio.play();
          console.log("Transcription completed:", data1);
          break;
        } else {
          retries++;
          if (retries >= 10) {
            console.log("Exceeded maximum number of retries");
            break;
          }
  
          const delay = backoff * Math.pow(2, retries); // Exponential backoff delay
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    } catch (error1) {
      console.error("Error:", error1);
      throw error1;
    }
  };

  // Usage
  (async () => {
    try {
      const trans = await fetchTranscriptionId();
      await fetchArticleStatus(trans);
    } catch (error) {
      console.error("Error:", error);
    }
  })();
  
}
export default BotAudio;
