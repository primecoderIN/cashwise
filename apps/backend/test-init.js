const { PrismaClient } = require('@prisma/client');
try {
  const p1 = new PrismaClient({});
  console.log("Empty object works");
} catch(e) {
  console.log("Empty object error:", e.message);
}

try {
  const p2 = new PrismaClient({ log: ['query'] });
  console.log("Log object works");
} catch(e) {
  console.log("Log object error:", e.message);
}
