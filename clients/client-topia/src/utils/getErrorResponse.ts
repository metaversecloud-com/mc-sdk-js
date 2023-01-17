/**
 * Parses error object and returns message if available, otherwise returns generic error message.
 */

import { AxiosError } from "axios";

type errorObject = { response: { data: { errors: [{ message: string }] } } };

export const getErrorResponse = ({
  error,
  message = "Something went wrong. Please try again or contact support.",
}: {
  error?: errorObject;
  message?: string;
}) => {
  const errorMessage = error?.response?.data?.errors[0]?.message;
  errorMessage && console.log(errorMessage);
  return { success: false, message: errorMessage || message };
};

export const getNewErrorResponse = ({
  error,
  message = "Something went wrong. Please try again or contact support.",
}: {
  error?: unknown;
  message?: string;
}) => {
  if (error instanceof Error) {
    const errorMessage = error?.message || message;
    errorMessage && console.error(errorMessage);
  } else if (error instanceof AxiosError) {
    const errorMessage = error?.message || message;
    const status = error?.response?.status || "unknown";
    errorMessage && console.error(status, errorMessage);
  }
  console.error("Please surround your use of the RTSDK with a try/catch block.");
};
