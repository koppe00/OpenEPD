const https = require('https');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables');
  process.exit(1);
}

const migrationFile = process.argv[2];
if (!migrationFile) {
  console.error('❌ Please provide migration file path');
  process.exit(1);
}

const sql = fs.readFileSync(migrationFile, 'utf8');

console.log(`📋 Running SQL: ${migrationFile}`);
console.log(`📊 SQL length: ${sql.length} characters\n`);

// Extract project reference from URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)[1];

// Try Supabase Database Webhooks / SQL endpoint
// Method 1: Try via postgrest directly
const postData = sql;

const options = {
  hostname: `${projectRef}.supabase.co`,
  port: 443,
  path: '/rest/v1/', // Base endpoint
  method: 'POST',
  headers: {
    'Content-Type': 'application/sql',
    'Content-Length': Buffer.byteLength(postData),
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`,
    'Accept': 'application/json'
  }
};

console.log(`🔄 Attempting to execute SQL via REST API...`);
console.log(`   URL: https://${projectRef}.supabase.co/rest/v1/\n`);

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204) {
      console.log('✅ SQL executed successfully!');
      if (data) console.log('Response:', data);
    } else {
      console.error(`❌ Failed with status ${res.statusCode}`);
      console.error('Response:', data);
      console.error('\n📝 Please run the SQL manually in Supabase SQL Editor');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
  console.error('\n📝 Please run this SQL manually in Supabase SQL Editor:');
  console.error('='.repeat(80));
  console.error(sql);
  console.error('='.repeat(80));
  process.exit(1);
});

req.write(postData);
req.end();
