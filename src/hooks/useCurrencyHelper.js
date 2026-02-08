export const getCurrencySymbol = (currency) => {
  switch (currency) {
    case undefined:
      return "€";
    case "GBP":
      return "£";
    case "EUR":
      return "€";
    case "USD":
      return "$";
    case "gram":
      return "g";
    default:
      return "€";
  }
};
