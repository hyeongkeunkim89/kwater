const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim();
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=')) {
      supabaseKey = line.split('=')[1].trim();
    }
  }
} catch (e) {
  console.error("Failed to read .env.local:", e);
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Supabase URL or Key is missing from manual parsed env!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log("Querying center_floors...");
  const { data, error } = await supabase
    .from('center_floors')
    .select('*')
    .eq('center_id', 'daecheong');
  
  if (error) {
    console.error("Error querying center_floors:", error);
  } else {
    console.log("center_floors count:", data.length);
    console.log("center_floors data:", data);
  }

  console.log("\nQuerying center_facilities...");
  const { data: facs, error: facErr } = await supabase
    .from('center_facilities')
    .select('*')
    .eq('center_id', 'daecheong');

  if (facErr) {
    console.error("Error querying center_facilities:", facErr);
  } else {
    console.log("center_facilities count:", facs.length);
    console.log("center_facilities data:", facs);
  }
}

main();
