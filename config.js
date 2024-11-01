/** Common config for message.ly */

// read .env files and make environmental variables

require("dotenv").config();

let DB_URI;

if (process.env.NODE_ENV === "test") {
  DB_URI = process.env.TEST_DATABASE_URL || "postgresql:///messagely_test";
} else {
  DB_URI = process.env.DATABASE_URL || "postgresql:///messagely";
}

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = 12;


module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
};