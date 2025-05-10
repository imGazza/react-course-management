import axios, { AxiosInstance, AxiosResponse } from "axios";

const API_URL = "http://localhost:3000";

class HttpClient {
  private readonly client: AxiosInstance;
  private readonly defaultDelay: number = 500;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private async withDelay<T>(promise: Promise<AxiosResponse>, delay?: number): Promise<T> {
    await new Promise(resolve => setTimeout(resolve, delay ?? this.defaultDelay));
    const response = await promise;
    return response.data;
  }

  async get<T>(url: string, delay?: number): Promise<T> {
    return this.withDelay(this.client.get(url), delay); 
  }

  async post<T>(url: string, data: object, delay?: number): Promise<T> {
    return this.withDelay(this.client.post(url, data), delay);
  }

  async put<T>(url: string, data: object, delay?: number): Promise<T> {
    return this.withDelay(this.client.put(url, data), delay);
  }

  async delete<T>(url: string, delay?: number): Promise<T> {
    return this.withDelay(this.client.delete(url), delay);
  }
}

const client = new HttpClient(API_URL);
export default client;