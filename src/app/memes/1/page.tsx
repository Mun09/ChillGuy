"use client"

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


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
      } catch (error) {
        console.error('Error fetching texts:', error);
      }
    };

    getTexts();

    const intervalId = setInterval(getTexts, 60000); // 60초마다 문장들 다시 가져오기기

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

  // 10초 생존 -> 없어지는데 10초 줄게 -> 10초 생존 -> ...
  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false)
      }, 10000);
    }

    toggleVisibility();
    const interval = setInterval(() => {
      toggleVisibility();
      setIndex((prevIndex) => (prevIndex + 1) % Texts.length);
    }, 20000);
    
    return () => clearInterval(interval);

  }, [Texts]);

  useEffect(() => {
    if (Texts.length > index && Texts[index]) {
      setChars(Texts[index].text.split(""));
    }
  }, [Texts, index]); // Texts 또는 index가 변경될 때만 실행

  const [inputText, setInputText] = useState("");

  const sentenceVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.5,
        staggerChildren: 0.08,
        staggerDirection: 1,
      }
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.08,  // 글자 사라짐 전파 속도
        when: "afterChildren"    // 모든 자식이 애니메이션을 끝낸 후에 exit을 적용하도록 설정
      }
    }
  }

  const letterVariants = {
    hidden: { opacity: 0, y: 10 , transition: { duration: 0.5}},
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { 
      opacity: 0, 
      y: -10, 
      x: 20, // 👉 오른쪽으로 이동하면서 사라지게 함!
      transition: { duration: 0.5 } 
    }
  };

  return (
    <main className="h-screen flex flex-col">

      <Image
        src="/memes/chillguy.jpg"
        alt="Background"
        fill                  // ✅ Next.js 13+에서 사용하는 방식
        objectFit="cover"
        className="absolute inset-0 -z-10"
      />


      <audio ref={audioRef} src="/memes/chillguy-music.mp3" loop />

      <div className="h-[10%] flex items-center justify-center text-black">
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

      <div className="flex w-full h-[90%]">
        {
          isPlaying && (
            <>
              <div className="w-[70%]"></div>
              <div className="w-[30%] flex flex-col text-white text-2xl font-bold">

                <div className="h-[30%] mr-10 flex items-end overflow-hidden">
                  <motion.h3
                    key={Chars.join("")}
                    variants={sentenceVariants}
                    initial="hidden"
                    animate={isVisible ? "visible" : "exit"}
                    exit= "exit"
                  >
                    {Chars.map((char, index) => {
                      return (
                        <motion.span key={index} variants={letterVariants}>
                          {char}
                        </motion.span>
                      )
                    })}
                  </motion.h3>
                </div>

                <div className="h-[70%] flex items-start justify-center">
                  <div className="mt-40 w-full">
                    <form onSubmit={sendInputText} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="It is completely EmPtY..."
                        className="p-3 rounded border border-gray-300 text-black text-sm"
                      />
                      <button type="submit" className="p-3 rounded bg-white text-black text-sm border border-gray-500">
                        That's it...
                      </button>
                    </form>
                  </div>
                </div>

              </div>
            </>
          )
        }

      </div>
    </main>
  )
}


