/**
 * Network Diagnostic Tool for Supabase Connection
 * Run with: node diagnose.js
 * 
 * This will help identify why the Supabase connection is failing
 */

require("dotenv").config();
const dns = require("dns").promises;
const net = require("net");
const https = require("https");

const SUPABASE_HOST = process.env.DB_HOST;
const SUPABASE_PORT = parseInt(process.env.DB_PORT);

console.log("╔════════════════════════════════════════════════════════════╗");
console.log("║        TechLeadHers Backend - Network Diagnostics          ║");
console.log("╚════════════════════════════════════════════════════════════╝\n");

console.log(`Target Host: ${SUPABASE_HOST}`);
console.log(`Target Port: ${SUPABASE_PORT}\n`);

// Step 1: DNS Resolution
async function testDNS() {
  console.log("📡 Step 1: Testing DNS Resolution...");
  try {
    const addresses = await dns.resolve4(SUPABASE_HOST);
    console.log("✅ DNS Resolution: SUCCESS");
    console.log(`   IP Addresses: ${addresses.join(", ")}\n`);
    return addresses[0];
  } catch (error) {
    console.log("❌ DNS Resolution: FAILED");
    console.log(`   Error: ${error.message}\n`);
    console.log("   Possible causes:");
    console.log("   - Host name is incorrect");
    console.log("   - DNS server not responding");
    console.log("   - Network not connected\n");
    return null;
  }
}

// Step 2: Port Connectivity
async function testPortConnectivity(ip) {
  console.log(`🔌 Step 2: Testing Port Connectivity (${ip}:${SUPABASE_PORT})...`);
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = 5000; // 5 seconds

    socket.setTimeout(timeout);

    socket.on("connect", () => {
      console.log(`✅ Port Connectivity: SUCCESS`);
      console.log(`   Successfully connected to ${ip}:${SUPABASE_PORT}\n`);
      socket.destroy();
      resolve(true);
    });

    socket.on("timeout", () => {
      console.log(`❌ Port Connectivity: TIMEOUT`);
      console.log(`   Connection timed out after ${timeout}ms\n`);
      console.log("   Possible causes:");
      console.log("   - Firewall blocking port 5432");
      console.log("   - ISP blocking outbound connections");
      console.log("   - Supabase server not responding");
      console.log("   - Network latency issues\n");
      socket.destroy();
      resolve(false);
    });

    socket.on("error", (error) => {
      console.log(`❌ Port Connectivity: ERROR`);
      console.log(`   Error: ${error.message}\n`);
      console.log("   Possible causes:");
      console.log("   - Connection refused");
      console.log("   - Network unreachable");
      console.log("   - Host unreachable\n");
      resolve(false);
    });

    socket.connect(SUPABASE_PORT, ip);
  });
}

// Step 3: HTTPS Connectivity (Website check)
async function testHTTPSConnectivity() {
  console.log(`🌐 Step 3: Testing HTTPS Connectivity to Supabase Website...`);
  return new Promise((resolve) => {
    const url = `https://${SUPABASE_HOST}`;
    const timeout = 5000;

    const req = https.get(url, { timeout }, (res) => {
      console.log(`✅ HTTPS Connectivity: SUCCESS (Status ${res.statusCode})`);
      console.log(`   Supabase website is reachable\n`);
      req.destroy();
      resolve(true);
    });

    req.on("timeout", () => {
      console.log(`❌ HTTPS Connectivity: TIMEOUT`);
      console.log(`   HTTPS request timed out after ${timeout}ms\n`);
      req.destroy();
      resolve(false);
    });

    req.on("error", (error) => {
      console.log(`❌ HTTPS Connectivity: ERROR`);
      console.log(`   Error: ${error.message}\n`);
      req.destroy();
      resolve(false);
    });
  });
}

// Step 4: Check .env file
function checkEnvFile() {
  console.log(`⚙️  Step 4: Checking .env Configuration...`);
  
  const required = ["DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD", "DB_SSL"];
  const missing = [];
  const configured = [];

  for (const key of required) {
    if (process.env[key]) {
      configured.push(`${key}=${process.env[key]}`);
    } else {
      missing.push(key);
    }
  }

  if (missing.length === 0) {
    console.log("✅ .env Configuration: COMPLETE");
    configured.forEach((item) => console.log(`   ${item}`));
    console.log();
    return true;
  } else {
    console.log("❌ .env Configuration: INCOMPLETE");
    console.log(`   Missing: ${missing.join(", ")}\n`);
    return false;
  }
}

// Step 5: Network Detection
function checkNetworkAccess() {
  console.log(`🌍 Step 5: Testing General Internet Access...`);
  return new Promise((resolve) => {
    const req = https.get("https://www.google.com", { timeout: 3000 }, (res) => {
      console.log(`✅ Internet Access: SUCCESS`);
      console.log(`   Your device can reach external websites\n`);
      req.destroy();
      resolve(true);
    });

    req.on("timeout", () => {
      console.log(`❌ Internet Access: TIMEOUT`);
      console.log(`   Cannot reach external websites\n`);
      req.destroy();
      resolve(false);
    });

    req.on("error", (error) => {
      console.log(`❌ Internet Access: ERROR - ${error.message}\n`);
      req.destroy();
      resolve(false);
    });
  });
}

// Main diagnostic flow
async function runDiagnostics() {
  try {
    // Check environment first
    const envOk = checkEnvFile();

    // Test general internet
    const internetOk = await checkNetworkAccess();

    if (!internetOk) {
      console.log("⚠️  Your device cannot reach the internet.");
      console.log("   Please check your network connection and try again.\n");
      process.exit(1);
    }

    // Test DNS
    const ip = await testDNS();

    if (!ip) {
      console.log("⚠️  DNS resolution failed. The hostname might be incorrect.");
      console.log("   Verify the hostname in your Supabase dashboard.\n");
      process.exit(1);
    }

    // Test port connectivity
    const portOk = await testPortConnectivity(ip);

    // Test HTTPS
    const httpsOk = await testHTTPSConnectivity();

    // Summary
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║                    DIAGNOSTIC SUMMARY                      ║");
    console.log("╚════════════════════════════════════════════════════════════╝\n");

    console.log("Results:");
    console.log(`  📄 .env Config:        ${envOk ? "✅ OK" : "❌ FAILED"}`);
    console.log(`  🌍 Internet Access:    ${internetOk ? "✅ OK" : "❌ FAILED"}`);
    console.log(`  📡 DNS Resolution:     ${ip ? "✅ OK" : "❌ FAILED"}`);
    console.log(`  🔌 Port 5432 Access:   ${portOk ? "✅ OK" : "❌ FAILED"}`);
    console.log(`  🌐 HTTPS Connectivity: ${httpsOk ? "✅ OK" : "❌ FAILED"}`);

    console.log("\n" + "═".repeat(62) + "\n");

    if (!portOk) {
      console.log("🔴 ISSUE FOUND: Cannot connect to port 5432\n");
      console.log("SOLUTIONS:\n");
      console.log("1. CHECK FIREWALL:");
      console.log("   - Windows Defender may be blocking port 5432");
      console.log("   - Check Settings → Privacy & Security → Windows Defender Firewall\n");

      console.log("2. CHECK ISP BLOCKING:");
      console.log("   - Some ISPs block port 5432");
      console.log("   - Contact your ISP or try a different network (mobile hotspot)\n");

      console.log("3. VERIFY SUPABASE HOST:");
      console.log("   - Go to https://app.supabase.com");
      console.log("   - Settings → Database → Connection String");
      console.log("   - Verify the host name is correct in your .env file\n");

      console.log("4. TRY CLOUD SHELL:");
      console.log("   - Open Supabase Dashboard → SQL Editor");
      console.log("   - Try running queries there to test database\n");

      console.log("5. USE TUNNEL/VPN:");
      console.log("   - Try connecting through a VPN if port is blocked\n");
    } else if (!envOk) {
      console.log("🟡 WARNING: .env file is not properly configured\n");
      console.log("SOLUTION:");
      console.log("   - Ensure .env exists in backend directory");
      console.log("   - Add all required variables\n");
    } else {
      console.log("🟢 ALL TESTS PASSED!\n");
      console.log("Your connection should work. Try again:\n");
      console.log("   npm run dev\n");
    }
  } catch (error) {
    console.error("Unexpected error during diagnostics:", error);
    process.exit(1);
  }
}

// Run diagnostics
runDiagnostics();
