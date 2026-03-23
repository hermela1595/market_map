import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const thisDir = dirname(fileURLToPath(import.meta.url));
const rootEnvPath = resolve(thisDir, "..", ".env");

// Always load .env from project root so startup is independent from process.cwd().
dotenv.config({ path: rootEnvPath });
