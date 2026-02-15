/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Fix for pdfjs-dist in client-side bundle
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          canvas: false,
          encoding: false,
          fs: false,
          path: false,
          os: false,
          crypto: false,
          stream: false,
          http: false,
          https: false,
          zlib: false,
          url: false,
        };
      }
  
      // Resolve alias to prevent bundling issues
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
  
      // Ignore specific warnings from pdfjs-dist and webpack cache
      config.ignoreWarnings = [
        ...(config.ignoreWarnings || []),
        /Critical dependency: the request of a dependency is an expression/,
        /Serializing big strings/,
      ];
  
      // Add rule to handle worker files
      config.module.rules.push({
        test: /\.worker\.(js|ts)$/,
        use: { loader: 'worker-loader' },
      });
  
      // Suppress cache warnings
      if (config.cache && typeof config.cache !== 'boolean') {
        config.cache.compression = 'gzip';
      }
  
      return config;
    },
    // Disable static optimization for pages using PDF viewer
    experimental: {
      esmExternals: 'loose',
    },
  }
  
  module.exports = nextConfig