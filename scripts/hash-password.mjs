// Run once to generate your CREDENTIALS_PASSWORD_HASH env var:
//   node scripts/hash-password.mjs yourpassword
import bcrypt from "bcryptjs";

const password = process.argv[2];
if (!password) {
  console.error("Usage: node scripts/hash-password.mjs <password>");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log("\nCREDENTIALS_PASSWORD_HASH=" + hash);
console.log("\nCopy the above line into your Vercel environment variables.");
