import * as dotenv from "dotenv";
dotenv.config({
  // Load project root .env first, then fallback to src/.env for legacy setups.
  path: ["./.env", "./src/.env"],
});
