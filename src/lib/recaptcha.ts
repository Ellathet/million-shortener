import axios, { AxiosInstance } from 'axios';

interface IVerifyResponse {
  success: boolean;
}

export class RecaptchaService {
  private api: AxiosInstance;

  constructor() {
    const api = axios.create({
      baseURL: 'https://www.google.com/recaptcha/api',
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
      },
    });

    this.api = api;
  }

  public verify = async (captchaToken: string) => {
    const { data } = await this.api.post<IVerifyResponse>('/siteverify', null, {
      params: {
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: captchaToken,
      },
    });

    return data;
  };
}
