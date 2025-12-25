/**
 * Simple Connection Diagnostic
 * Run with: node quick-diagnose.js
 */

require("dotenv").config();
const dns = require("dns").promises;
const net = require("net");

const SUPABASE_HOST = process.env.DB_HOST;
const SUPABASE_PORT = parseInt(process.env.DB_PORT);

console.log("\n🔍 QUICK DIAGNOSTIC TOOL\n");
console.log(`Host: ${SUPABASE_HOST}`);
console.log(`Port: ${SUPABASE_PORT}\n`);

// Test DNS
console.log("Testing DNS resolution...");
dns.resolve4(SUPABASE_HOST)
  .then((addresses) => {
    console.log("✅ DNS OK - Resolved to:", addresses[0]);
    
    // Test port
    console.log("\nTesting port 5432 connectivity...");
    const socket = new net.Socket();
    socket.setTimeout(3000);
    
    socket.on("connect", () => {
      console.log("✅ PORT 5432 OPEN - Connection successful!");
      console.log("\n🟢 Everything looks good! Try: npm run dev");
      socket.destroy();
      process.exit(0);
    });
    
    socket.on("timeout", () => {
      console.log("❌ TIMEOUT on port 5432");
      console.log("\nPOSSIBLE CAUSES:");
      console.log("1. Firewall blocking port 5432");
      console.log("2. ISP blocking outbound port 5432");
      console.log("3. Network connectivity issue");
      console.log("\nSOLUTIONS:");
      console.log("- Check Windows Defender Firewall");
      console.log("- Try with a mobile hotspot");
      console.log("- Contact your ISP");
      socket.destroy();
      process.exit(1);
    });
    
    socket.on("error", (err) => {
      console.log("❌ CONNECTION ERROR:", err.code);
      console.log("\nSOLUTIONS:");
      console.log("1. Verify Supabase host in .env");
      console.log("2. Check internet connection");
      console.log("3. Try restarting your router");
      socket.destroy();
      process.exit(1);
    });
    
    socket.connect(SUPABASE_PORT, addresses[0]);
  })
  .catch((err) => {
    console.log("❌ DNS RESOLUTION FAILED:", err.message);
    console.log("\nSOLUTIONS:");
    console.log("1. Check if SUPABASE_HOST in .env is correct");
    console.log("2. Check your internet connection");
    console.log("3. Verify in Supabase Dashboard: Settings → Database");
    process.exit(1);
  });
