/**
 * Parses error object and returns message if available, otherwise returns generic error message.
 */
export const getErrorMessage = (error: { response: { data: { errors: [{ message: string }] } } }) => {
  const errorMessage = error?.response?.data?.errors[0]?.message;
  return errorMessage || "Something went wrong. Please try again or contact support.";
};
