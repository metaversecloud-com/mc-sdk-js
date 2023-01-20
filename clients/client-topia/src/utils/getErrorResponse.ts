/**
 * Parses error object and returns message if available, otherwise returns generic error message.
 */
import { AxiosError } from "axios";

type errorObject = { response: { data: { errors: [{ message: string }] } } };

export const getErrorResponse = ({
  error,
  message = "Something went wrong. Please try again or contact support.",
}: {
  error?: errorObject | unknown;
  message?: string;
}) => {
  let errorMessage = message;
  let status: any;
  let data: any;
  let url: any;
  if (error instanceof AxiosError) {
    errorMessage = error?.message || message;
    status = error?.response?.status || "unknown";
    // errorMessage && console.error(status, errorMessage, error.config?.url);
    // error?.response?.data && console.error(error.response.data);
    data = error?.response?.data && error.response.data;
    url = error?.config?.url && error.config.url;
  } else if (error instanceof Error) {
    errorMessage = error?.message || message;
    // errorMessage && console.error(errorMessage);
  }

  errorMessage = `${errorMessage}. Please surround your use of the RTSDK with a try/catch block.`;
  return { success: false, status, url, message: errorMessage, data };
};
