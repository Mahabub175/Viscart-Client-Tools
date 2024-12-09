/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  compiler: {
    reactRemoveProperties: true,
    react: {
      throwIfNamespace: false,
    },
  },
  images: {
    domains: [
      "localhost",
      "thumbs.dreamstime.com",
      "viscartapi.devmahabub.com",
      "anayase.com",
      "shokhbazar.com",
      "viscartapi.vitasoftsolutions.com",
      "photohouseapi.photohousemagazine.com",
    ],
  },
};

export default nextConfig;
