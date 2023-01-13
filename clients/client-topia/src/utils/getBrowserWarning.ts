export const getBrowserWarning = () => {
  if (typeof window !== "undefined") {
    console.warn(
      "Please use extreme caution when passing sensitive information such as API keys from a client side application.",
    );
  }
};
