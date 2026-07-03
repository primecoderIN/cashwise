const { PrismaClient } = require('@prisma/client');
try {
  const p1 = new PrismaClient();
  console.log("No args works");
} catch(e) {
  console.log("No args error:", e.message);
}
