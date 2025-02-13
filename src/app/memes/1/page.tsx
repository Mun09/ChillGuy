"use client"

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import Image from "next/image";
import { addText, getAllTexts, getRandomTexts } from "@/services/textService";
import { TextData, Texts } from "@/types/textTypes";


export default function Home() {

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const sentences = [
    "Everything’s gonna work out, just relax and enjoy the ride.",
    "Don’t stress it, life’s all about the good vibes.",
    "We’ll figure it out, no rush.",
    "The best thing you can do is chill and let things flow.",
    "No need to overthink it, just go with the flow.",
    "Everything will be alright, take it one step at a time.",
    "Life’s a breeze when you don’t take it too seriously.",
    "We’ve got this, no need to rush, just enjoy the moment.",
    "Just breathe and let it all go. Everything’s cool.",
    "Don’t worry about it, everything falls into place eventually."
  ];

  const [Texts, setTexts] = useState<Texts>([]);
  const [Chars, setChars] = useState<string[]>([]);

  useEffect(() => {
    const getTexts = async () => {
      try {
        const data = await getRandomTexts();
        setTexts(data);
        setIndex(0);
      } catch(error) {
        console.error('Error fetching texts:', error);
      }
    };
  
    getTexts();
    
    const intervalId = setInterval(getTexts, 60000);
  
    return () => clearInterval(intervalId);
  }, []);

  const sendInputText = (event: React.FormEvent) => {
    event.preventDefault();
    const data: TextData = {
      text: inputText
    }
    addText(data);
    setInputText("");
  }

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log("Auto-play blocked:", error);
      });
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
      const interval = setInterval(() => {
        setIsVisible(false);
        setTimeout(() => {
          setIndex((prevIndex) => (prevIndex + 1) % Texts.length);
          setIsVisible(true);
        }, 5000);
      }, 10000);
      return () => clearInterval(interval);
  }, [Texts]);

  useEffect(() => {
    if (Texts.length > index && Texts[index]) {
      setChars(Texts[index].text.split(""));
    }
  }, [Texts, index]); // Texts 또는 index가 변경될 때만 실행

  const [inputText, setInputText] = useState("");

  return (
    <main>
      
        <Image
          src="/memes/chillguy.jpg"
          alt="Background"
          fill                  // ✅ Next.js 13+에서 사용하는 방식
          objectFit="cover"        
          className="absolute inset-0 -z-10"
        /> 
      

      <audio ref={audioRef} src="/memes/chillguy-music.mp3" loop />

      <div className="relative flex flex-col items-center justify-center bg-black p-4 rounded-lg shadow-lg">
        {!isPlaying && (
          <button
            onClick={handlePlay}
            className="p-4 bg-white text-black font-bold rounded-lg shadow-lg"
          >
            ▶ Be Chill
          </button>
        )}

        {isPlaying && (
          <>
            <div className="mt-4 flex items-center">
              <label className="mr-2 text-white font-bold">🔊</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-40"
              />
            </div>
          </>
        )}
      </div> 

      <div className="relative">
      {
        isPlaying && (
          <div className="flex h-screen">
            <div className="w-[70%]"></div>

            <div className="w-[30%] mt-40 mr-10 items-center text-white text-2xl font-bold">

              {Chars.map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }} // 한 글자씩 딜레이
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </div>
        )
      }

      {
isPlaying && 
<form onSubmit={sendInputText}>
    <input
      type="text"
      value={inputText}
      onChange={(e) => setInputText(e.target.value)} // 입력값 업데이트
      placeholder="Enter a sentence"
      className="p-2 rounded"
    />
    <button type="submit" className="p-2 bg-blue-500 text-white rounded ml-2">
      Add Text
    </button>
  </form>
      }
      </div>


    </main>
  )
}


