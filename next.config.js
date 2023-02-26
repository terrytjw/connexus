/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        // crypto: require.resolve("crypto-browserify"),
      };
    }
    return config;
  },
  swcMinify: true,
  images: {
    domains: ["lh3.googleusercontent.com", "ewxkkwolfryfoidlycjr.supabase.co"],
  },
};

module.exports = nextConfig;
