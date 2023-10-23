const { exec } = require("child_process");

// Check if Node.js is installed
exec("node -v", (error, stdout, stderr) => {
    if (error) {
        console.error("Node.js is not installed. Please download and install Node.js from https://nodejs.org/");
        process.exit(1);
    } else {
        console.log("Node.js is installed:", stdout);
    }
});
