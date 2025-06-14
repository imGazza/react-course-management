import axios, { AxiosInstance, AxiosResponse } from "axios";
import { router } from "@/07-routing/router";
import { NotFound404Error } from "@/01-features/shared/errors/custom-exceptions/not-found-404";

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
    
    // Interceptor per gestire i 404 (sollevo errore intercettata nell'ErroBoundary)
    // Rimanderà alla pagina Not Found
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response && error.response.status === 404) {
          return Promise.reject(new NotFound404Error());
        }
        return Promise.reject(error);
      }
    );
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