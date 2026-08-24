export const env = {
  apiUrl:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://rentnest-backend-83n7.onrender.com/api/v1",
  appName: process.env.NEXT_PUBLIC_APP_NAME || "RentNest",
  stripeKey:
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51SeJ3uR8CsOM5BuxPL2RtcrByeHBDqXsqzsRWS9JnKEh64S5YzuJRmv5OXIiWhpgMBATbVYEuRwnXDQGgDvnyCJr005CB2dPvT",
};
