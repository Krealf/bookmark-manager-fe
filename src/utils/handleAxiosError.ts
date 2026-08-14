import { isAxiosError } from 'axios';

export interface ApiErrorPayload {
  message: string;
  status?: number;
  data?: unknown;
}

export const extractApiError = (error: unknown): ApiErrorPayload => {
  if (isAxiosError(error)) {
    if (error.response) {
      return {
        message: error.response.data?.message || error.message,
        status: error.response.status,
        data: error.response.data,
      };
    }

    if (error.request) {
      return {
        message: 'The server is not responding.',
      };
    }

    return {
      message: error.message,
    };
  }

  return {
    message: 'An unexpected error has occurred.',
  };
};
