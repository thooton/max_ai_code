const fs = require("fs");

const sysprompt = JSON.parse(fs.readFileSync("./sysprompt.json"));
const names = JSON.parse(fs.readFileSync("./names.json"));

const banned_words = JSON.parse(fs.readFileSync("./banned_words.json"));

const samantha = JSON.parse(fs.readFileSync("./samantha-1.1.json"))
    .map(x => x.conversations);
const documents = [];

for (const conv of samantha) {
    const name = names[Math.floor(Math.random() * names.length)];
    conv.unshift({
        from: "gpt",
        value: `Hi! You must be ${name}. I'm Max, it's fascinating to meet you.`
    });
    const doc = sysprompt + conv.map(x => 
        `<|im_start|>${x.from == "human" ? "user" : "assistant"}\n${x.value.trim()}<|im_end|>\n`
    ).join("").replaceAll("Samantha", "Max").replaceAll("samantha", "Max").trim();
    let bad = false;
    for (const banned_word of banned_words) {
        if (doc.includes(banned_word)) {
            bad = true;
            break;
        }
    }
    if (bad) {
        continue;
    }
    documents.push(doc);
}

console.log(`Extracted ${documents.length} documents from ${samantha.length} conversations`);
console.log(`${(1 - (documents.length / samantha.length)) * 100}% of documents were rejected`)
console.log(`In total, ${documents.map(x => x.length).reduce((a, x) => a + x)} bytes`)

fs.writeFileSync("./max_samantha.json", JSON.stringify(documents, null, 4));