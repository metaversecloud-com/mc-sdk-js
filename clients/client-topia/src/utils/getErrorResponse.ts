/**
 * Parses error object and returns message if available, otherwise returns generic error message.
 */
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
