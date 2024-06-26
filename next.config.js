/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },

    images: {
        remotePatterns: [
            {
                hostname: "**",
            },
        ],
    },
};

export default nextConfig;
