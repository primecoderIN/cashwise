const { defineConfig } = require('@prisma/config');
const config = defineConfig({
  datasource: { url: "postgres://a:b@c/d" }
});
console.log(config);
