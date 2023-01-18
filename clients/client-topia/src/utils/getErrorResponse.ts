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
  if (error instanceof AxiosError) {
    errorMessage = error?.message || message;
    const status = error?.response?.status || "unknown";
    errorMessage && console.error(status, errorMessage, error.config);
  } else if (error instanceof Error) {
    errorMessage = error?.message || message;
    errorMessage && console.error(errorMessage);
  }
  console.error("Please surround your use of the RTSDK with a try/catch block.");
  return { success: false, message: errorMessage };
};
