/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
            },
            {
                protocol: "https",
                hostname: "https://yankes-netflix-clone.vercel.app"
            }
        ]
    }
};

export default nextConfig;
