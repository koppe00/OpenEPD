/** @type {import('next').NextConfig} */
const nextConfig = {
  // Zorg dat de moderne Supabase packages goed werken
  transpilePackages: ['@supabase/ssr', '@supabase/supabase-js'],
};

module.exports = nextConfig;