const fs = require("fs");
const max_henry = JSON.parse(fs.readFileSync("./max_henry.json"));

fs.writeFileSync("./selected.txt", max_henry[Math.floor(Math.random() * max_henry.length)]);