/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            // Catalog Service (port 3003)
            {
                source: '/api/courses/:path*',
                destination: 'http://localhost:3003/api/courses/:path*',
            },
            // IAM Service (port 3002)
            {
                source: '/api/users/:path*',
                destination: 'http://localhost:3002/api/users/:path*',
            },
            {
                source: '/api/auth/:path*',
                destination: 'http://localhost:3002/api/auth/:path*',
            },
            // Enrollment Service (port 3004)
            {
                source: '/api/enrollments/:path*',
                destination: 'http://localhost:3004/api/enrollments/:path*',
            },
            // Progress Service (port 3005) - if/when it runs
            {
                source: '/api/progress/:path*',
                destination: 'http://localhost:3005/api/progress/:path*',
            },
        ];
    },
};

module.exports = nextConfig;
