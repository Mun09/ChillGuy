// src/services/textService.ts
import { TextData, Texts } from '../types/textTypes';

const API_URL = process.env.NEXT_PUBLIC_API_URL + "/texts" || 'http://localhost:8080/texts';

// GET: 모든 텍스트 가져오기
export const getAllTexts = async (): Promise<Texts> => {
  const response = await fetch(API_URL, {mode: 'no-cors'});
  console.log(response.status);
  if (!response.ok) {
    throw new Error('Failed to fetch texts');
  }

  return response.json();
};

export const getRandomTexts = async (limit: number = 10): Promise<Texts> => {
  const response = await fetch(`${API_URL}/random?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch random texts');
  }
  return response.json();
};

// POST: 새로운 텍스트 추가
export const addText = async (text: TextData): Promise<TextData> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(text),
  });
  if (!response.ok) {
    throw new Error('Failed to add text');
  }
  return response.json();
};

// PUT: 텍스트 업데이트
export const updateText = async (id: number, text: TextData): Promise<TextData> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(text),
  });
  if (!response.ok) {
    throw new Error('Failed to update text');
  }
  return response.json();
};

// DELETE: 텍스트 삭제
export const deleteText = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    mode: 'no-cors',
  });
  if (!response.ok) {
    throw new Error('Failed to delete text');
  }
};
