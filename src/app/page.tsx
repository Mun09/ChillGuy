"use client"

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import Image from "next/image";


export default function Home() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    // 사용자 IP 주소 가져오기
    const getIpAddress = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        const ipAddress = data.ip;

        // IP 주소를 서버로 POST 요청
        await fetch("http://localhost:8080/add-visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ip: ipAddress }),
        });
      } catch (error) {
        console.error("IP 주소 가져오기 실패:", error);
      }
    };

    getIpAddress();
  }, []);

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

  const [Texts, setTexts] = useState(sentences);

  useEffect(() => {
    // 컴포넌트가 처음 렌더링될 때 API 호출
    fetch("http://localhost:8080/get-texts")  // 백엔드 서버의 URL
      .then((response) => response.json())   // JSON 형식으로 응답 받기
      .then((data) => {
        setTexts(data); // 응답 받은 텍스트 목록을 상태에 저장
      })
      .catch((error) => {
        console.error("Error fetching texts:", error); // 오류 처리
      });
  }, []);

  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % Texts.length);
        setIsVisible(true);
      }, 10000);
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const chars = Texts[index].split(""); // 현재 문장을 글자 단위로 분할

  return (
    <main>
      
        <Image
          src="/chillguy.jpg"
          alt="Background"
          fill                  // ✅ Next.js 13+에서 사용하는 방식
          objectFit="cover"        
          className="absolute inset-0 -z-10"
        /> 
      

      <audio ref={audioRef} src="/chillguy-music.mp3" loop />

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

              {chars.map((char, i) => (
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
      </div>
    </main>
  )
}


