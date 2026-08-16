export const env = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "RentNest",
  stripeKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
};
