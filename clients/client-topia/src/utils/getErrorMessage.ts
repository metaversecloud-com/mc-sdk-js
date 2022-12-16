export const getErrorMessage = (error: any) => {
  const errorMessage = error?.response?.data?.errors[0]?.message;
  return errorMessage || "Something went wrong. Please try again or contact support.";
};
