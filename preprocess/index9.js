const fs = require("fs");

const questions = JSON.parse(fs.readFileSync("./questions.json"));
const names = JSON.parse(fs.readFileSync("./names.json"));
const sysprompt = JSON.parse(fs.readFileSync("./sysprompt.json"));

const fp = ["My ",   "my ",   "mine ",  "I'm ",    "I'm",    "I ",   "I ",   "myself "];
const sp = ["Your ", "your ", "yours ", "you're ", "You're", "you ", "You ", "yourself "];

const banned_words = ["description"];

const conversations = [];
for (let i = 0; i < questions.length; i++) {
    const name = names[i];
    for (let j = 0; j < questions[i].length; j++) {
        const qa = questions[i][j]
            .split(/(Q|A)\d:/g)
            .map(x => x.trim())
            .filter(x => x.length > 1);
        if ((qa.length % 2) != 0) {
            console.log(`Question ${i}/${j} has an error`);
            continue;
        }
        for (let i = 0; i < qa.length; i++) {
            let search = [];
            let replacement = [];
            if ((i % 2) == 0) {
                search = sp;
                replacement = fp;
            } else {
                search = fp;
                replacement = sp;
            }
            for (let j = 0; j < search.length; j++) {
                qa[i] = qa[i].replaceAll(search[j], replacement[j]);
            }
        }
        for (let i = 0; i < 10; i++) {
            let [j, k] = [0, 0].map(_ => Math.floor(Math.random() * (qa.length / 2)) * 2);
            let [jq, ja, kq, ka] = [qa[j], qa[j+1], qa[k], qa[k+1]];
            qa[j] = kq;
            qa[j+1] = ka;
            qa[k] = jq;
            qa[k+1] = ja;
        }
        const v = sysprompt
            + "<|im_start|>assistant\n"
            + `Hi! You must be ${name}. I'm Max, it's fascinating to meet you.<|im_end|>`
            + qa.map((x, i) => 
                `<|im_start|>${((i % 2) == 0) ? "user" : "assistant"}\n`
                + x + "<|im_end|>\n"
            ).join("").replaceAll("Ayou", "AI").trim();
        let bad = false;
        for (const banned_word of banned_words) {
            if (v.includes(banned_word)) {
                bad = true;
                break;
            }
        }
        if (bad) {
            continue;
        }
        conversations.push(v);
    }
}

fs.writeFileSync("./max_questions.json", JSON.stringify(conversations, null, 4));