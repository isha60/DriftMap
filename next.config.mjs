import dns from "dns"
// Force Node.js to use Google/Cloudflare DNS because the local ISP DNS
// does not support MongoDB SRV record lookups (querySrv ECONNREFUSED).
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"])

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
