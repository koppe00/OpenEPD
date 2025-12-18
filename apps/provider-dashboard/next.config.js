// apps/provider-dashboard/next.config.js

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv'); // dotenv is in de root node_modules en bereikbaar

// Pad naar de root .env.local vanuit de provider-dashboard directory
const ENV_PATH = path.join(process.cwd(), '../../.env.local');

// Lees en parse het .env.local bestand handmatig
const envFile = fs.readFileSync(ENV_PATH, 'utf-8');
const parsedEnv = dotenv.parse(envFile);

/** @type {import('next').NextConfig} */
const nextConfig = {
    // Exposeer de environment variabelen naar de Next.js procesomgeving
    env: parsedEnv,

    // Dit zorgt ervoor dat de Next.js app de root node_modules kan bereiken
    transpilePackages: ['@supabase/supabase-js'],
};

module.exports = nextConfig;