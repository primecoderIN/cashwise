const { PrismaClient } = require('@prisma/client');
try {
  const p1 = new PrismaClient({ url: process.env.DATABASE_URL });
  console.log("url works");
} catch(e) {
  console.log("url error:", e.message);
}

try {
  const p2 = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });
  console.log("datasourceUrl works");
} catch(e) {
  console.log("datasourceUrl error:", e.message);
}
