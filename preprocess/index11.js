const fs = require("fs");

const files = [
    "max_comparisons.json",
    "max_descriptions.json",
    "max_henry.json",
    "max_questions.json",
    "max_samantha.json",
    "max_therapy.json",
    "max_vehicles.json"
];

fs.writeFileSync(
    "./max.jsonl",
    files
        .map(x => JSON.parse(fs.readFileSync(x)))
        .reduce((a, v) => a.concat(v), [])
        .map(x => JSON.stringify({"text": x}))
        .join("\n")
);