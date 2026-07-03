const { PrismaClient } = require('@prisma/client');
try {
  const p1 = new PrismaClient({});
  console.log("Empty object works");
} catch(e) {
  console.log("Empty object error:", e.message);
}
