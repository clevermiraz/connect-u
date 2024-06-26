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

module.exports = nextConfig;
