/**
 * Parses error object and returns message if available, otherwise returns generic error message.
 */
import { AxiosError } from "axios";

export const getErrorResponse = ({
  error,
  message = "Something went wrong. Please try again or contact support.",
}: {
  error?: Error | AxiosError | unknown;
  message?: string;
}) => {
  let data = {},
    errorMessage = message,
    status = 500,
    url = "unknown";

  if (error instanceof AxiosError) {
    errorMessage = error?.message || message;
    if (error.response) {
      status = error.response.status;
      data = error.response.data;
    }
    if (error?.config?.url) url = error.config.url;
  } else if (error instanceof Error) {
    errorMessage = error?.message || message;
  }

  errorMessage = `${errorMessage}. Please surround your use of the RTSDK with a try/catch block.`;
  return { success: false, status, url, message: errorMessage, data };
};
