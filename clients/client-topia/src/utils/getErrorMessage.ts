/**
 * Parses error object and returns message if available, otherwise returns generic error message.
 */
type errorObject = { response: { data: { errors: [{ message: string }] } } };

export const getErrorMessage = (error: errorObject) => {
  const errorMessage = error?.response?.data?.errors[0]?.message;
  return errorMessage || "Something went wrong. Please try again or contact support.";
};
