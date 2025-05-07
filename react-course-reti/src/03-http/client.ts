import axios from "axios";

const API_URL = "http://localhost:3000";

const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

const simulateDelay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const get = async (url: string, delay?: number) => {
  await simulateDelay(delay ?? 500);
  const response = await httpClient.get(url);
  return response.data; 
}

export const post = async (url: string, data: object, delay?: number) => {
  await simulateDelay(delay ?? 500);
  const response = await httpClient.post(url, data);
  return response.data; 
}

export const put = async (url: string, data: object, delay?: number) => {
  await simulateDelay(delay ?? 500);
  const response = await httpClient.put(url, data);
  return response.data; 
}

export const del = async (url: string, delay?: number) => {
  await simulateDelay(delay ?? 500);
  const response = await httpClient.delete(url);
  return response.data;
}