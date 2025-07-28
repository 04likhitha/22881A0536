const axios = require("axios");

async function Log(stack, level, pkg, message) {
  try {
    await axios.post("http://localhost:3000/log", {
      stack,
      level,
      package: pkg,
      message,
    });
  } catch (error) {
    console.error("Log failed:", error.message);
  }
}

module.exports = Log;
