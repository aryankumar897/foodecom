import config from "./config.js"; // Import configuration values from the config.js file

const nextConfig = {
  images: {
    domains: ["i.pravatar.cc", "res.cloudinary.com"],
  },

  env: {
    DB_URI: config.DB_URI, // Database connection URI
    NEXTAUTH_SECRET: config.NEXTAUTH_SECRET, // Secret key for NextAuth authentication
    API: config.API, // Base API URL

    CLOUDINARY_CLOUD_NAME: config.CLOUDINARY_CLOUD_NAME, // Cloudinary cloud name for image storage
    CLOUDINARY_API_KEY: config.CLOUDINARY_API_KEY, // Cloudinary API key
    CLOUDINARY_API_SECRET: config.CLOUDINARY_API_SECRET, // Cloudinary API secret
    CLIENT_URL: config.CLIENT_URL, // Base client URL
    GOOGLE_API_KEY: config.GOOGLE_API_KEY, // Google API key for integrations

    GOOGLE_CLIENT_ID: config.GOOGLE_CLIENT_ID, // Google OAuth Client ID
    GOOGLE_CLIENT_SECRET: config.GOOGLE_CLIENT_SECRET, // Google OAuth Client Secret

    RAZORPAY_KEY_SECRET: config.RAZORPAY_KEY_SECRET, // Razorpay API secret key
    RAZORPAY_KEY_ID: config.RAZORPAY_KEY_ID, // Razorpay API key ID
    PAYPAL_CLIENT_ID: config.PAYPAL_CLIENT_ID, // PayPal Client ID for payment processing
    PAYPAL_CLIENT_SECRET: config.PAYPAL_CLIENT_SECRET, // PayPal Client Secret

    APP_ID: config.APP_ID,
    KEY: config.KEY,
    SECRET: config.SECRET,
    CLUSTER: config.CLUSTER,
  },
};

export default nextConfig; // Export the Next.js configuration object
