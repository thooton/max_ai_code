const fs = require("fs");

function encodePrompt(p) {
    return "<s>" + p.map(x => {
        if (x.role == "user") {
            return "[INST] " + x.content.trim() + " [/INST]";
        } else if (x.role == "assistant") {
            return x.content.trim() + "</s> ";
        } else {
            throw new Error("unknown role");
        }
    });
}


const people = JSON.parse(fs.readFileSync("./people.json"));
const names = JSON.parse(fs.readFileSync("./names.json"));
const questions = (() => {
    try {
        return JSON.parse(fs.readFileSync("./questions.json"));
    } catch (_e) {
        return people.map(_ => []);
    }
})();

async function main() {
    const idx = Math.floor(Math.random() * people.length);
    const prompt = "<s>"
        + "[INST] "
        + "I am designing a reading comprehension quiz for this description of myself: "
        + people[idx]
        + "\n\nPlease create a set of 6 diverse, creative, unique questions and answers about me that can be answered by the description."
        + " [/INST]"
        + ` Sure, here are 6 creative questions about you.\nQ1: What is my name?\nA1: Your name is ${names[idx]}.\nQ2:`;
    const resp = "Q2: " + (await (await fetch("http://192.168.1.117:29611/completion", {
        method: "POST",
        body: JSON.stringify({
            temperature: 1.8,
            top_p: 0.95,
            n_predict: 2048,
            n: 1,
            prompt: prompt,
            stop: ["[INST]"]
        })
    })).json()).content.trim();
    questions[idx].push(resp);
    fs.writeFileSync("./questions.json", JSON.stringify(questions, null, 4));
}

for (let i = 0; i < 4; i++) {
    (async() => {
        while (true) {
            try {
                await main();
            } catch (_e) {}
        }
    })();
}