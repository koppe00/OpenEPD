/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dit is cruciaal voor monorepo's: het dwingt Next.js om de gedeelde
  // supabase pakketten uit de root correct te verwerken.
  transpilePackages: ['@supabase/ssr', '@supabase/supabase-js', '@openepd/clinical-core'],
};

module.exports = nextConfig;