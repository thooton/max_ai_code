const fs = require("fs");

const max_vehicles = JSON.parse(fs.readFileSync("./max_vehicles.json"));

fs.writeFileSync("averhicle.txt", max_vehicles[Math.floor(Math.random() * max_vehicles.length)]);