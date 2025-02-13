"use client";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Meme } from '@/types/memes';

export default function MemeGallery() {
  const router = useRouter();

  // 예시 데이터 - 실제로는 API에서 가져올 수 있습니다
  const memes: Meme[] = [
    {
      id: 1,
      title: "Chill guy",
      thumbnailUrl: "/memes/chillguy.jpg",
      description: "Just Chill"
    },
    {
      id: 2,
      title: "fucked Plankton",
      thumbnailUrl: "/memes/plankton.jpg",
      description: "AHHHHH"
    },
    // 더 많은 밈 데이터...
  ];

  const handleMemeClick = (memeId: number) => {
    router.push(`/memes/${memeId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Meme Factory</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memes.map((meme) => (
          <div 
            key={meme.id}
            onClick={() => handleMemeClick(meme.id)}
            className="cursor-pointer hover:shadow-lg transition-shadow duration-300 rounded-lg overflow-hidden"
          >
            <div className="relative h-48 w-full">
              <Image
                src={meme.thumbnailUrl}
                alt={meme.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-4 bg-white">
              <h2 className="text-xl font-semibold">{meme.title}</h2>
              <p className="text-gray-600 mt-2">{meme.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
