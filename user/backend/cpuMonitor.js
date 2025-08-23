// cpuMonitor.js - Simple CPU monitoring for Node.js process
import os from 'os';

function formatBytes(bytes) {
  return Math.round(bytes / 1024 / 1024) + ' MB';
}

function getCPUUsage() {
  const usage = process.cpuUsage();
  return {
    user: Math.round(usage.user / 1000),
    system: Math.round(usage.system / 1000)
  };
}

function getMemoryUsage() {
  const mem = process.memoryUsage();
  return {
    rss: formatBytes(mem.rss),
    heapUsed: formatBytes(mem.heapUsed),
    heapTotal: formatBytes(mem.heapTotal),
    external: formatBytes(mem.external)
  };
}

function getSystemInfo() {
  return {
    uptime: Math.round(process.uptime()),
    loadAvg: os.loadavg(),
    freeMem: formatBytes(os.freemem()),
    totalMem: formatBytes(os.totalmem())
  };
}

console.log('🔍 Starting CPU and Memory Monitor...\n');

let startCPU = process.cpuUsage();
let iterations = 0;

setInterval(() => {
  iterations++;
  
  const currentCPU = process.cpuUsage(startCPU);
  const cpuPercent = {
    user: Math.round((currentCPU.user / 1000 / 10000) * 100), // Convert to %
    system: Math.round((currentCPU.system / 1000 / 10000) * 100)
  };
  
  const memory = getMemoryUsage();
  const system = getSystemInfo();
  
  console.log(`\n[${iterations * 5}s] System Stats:`);
  console.log(`CPU Usage: User ${cpuPercent.user}%, System ${cpuPercent.system}%`);
  console.log(`Memory: RSS ${memory.rss}, Heap ${memory.heapUsed}/${memory.heapTotal}`);
  console.log(`Process Uptime: ${system.uptime}s`);
  console.log(`System Load: ${system.loadAvg[0].toFixed(2)}`);
  
  // Alert if CPU usage is high
  if (cpuPercent.user > 50 || cpuPercent.system > 50) {
    console.log('🚨 HIGH CPU USAGE DETECTED!');
  }
  
  // Reset for next measurement
  startCPU = process.cpuUsage();
  
}, 5000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 CPU Monitor shutting down...');
  process.exit(0);
});
