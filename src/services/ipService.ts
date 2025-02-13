import { IpData, IpDatas } from "@/types/ipTypes";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/ip';

// GET: 모든 텍스트 가져오기
export const getAllIps = async (): Promise<IpDatas> => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error('Failed to fetch texts');
  }
  return response.json();
};

export const addIp = async (ip: IpData) => {
    
}