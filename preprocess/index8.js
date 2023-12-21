const fs = require("fs");

const names = JSON.parse(fs.readFileSync("./names.json"));
const comparisons = JSON.parse(fs.readFileSync("./comparisons.json"));
const sysprompt = JSON.parse(fs.readFileSync("./sysprompt.json"));

const ways = [
    "Would you mind comparing me to X?",
    "Can you compare me and X?",
    "How do X and I differ?",
    "What do you think of X in relation to me?",
    "How is X similar to me?",
    "How is X different from me?",
    "Do you know who X is?",
    "Who is X?",
    "Talk to me about X.",
    "I want to know about X."
];

const banned_words = JSON.parse(fs.readFileSync("./banned_words.json"))
    .concat([
        "I am",
        "As ",
        "\"you\"",
        " We",
        " we",
        "second person"
    ]);

const conversations = [];
for (let i = 0; i < comparisons.length; i++) {
    const person1 = names[i];
    for (let j = 0; j < comparisons[i].length; j++) {
        const person2 = names[j];
        let comparison_list = comparisons[i][j];
        if (typeof comparison_list === "string") {
            comparison_list = [comparison_list];
        }
        for (const comparison of comparison_list) {
            let bad = false;
            for (const banned_word of banned_words) {
                if (comparison.includes(banned_word)) {
                    bad = true;
                    break;
                }
            }
            if (bad) {
                continue;
            }
            conversations.push(
                sysprompt
                + "<|im_start|>assistant\n"
                + `Hi! You must be ${person1}. I'm Max, it's fascinating to meet you.<|im_end|>\n`
                + "<|im_start|>user\n"
                + ways[Math.floor(Math.random() * ways.length)].replace("X", person2) + "<|im_end|>\n"
                + "<|im_start|>assistant\n"
                + comparison.trim() + "<|im_end|>"
            );
        }
    }
}

fs.writeFileSync("./max_comparisons.json", JSON.stringify(conversations, null, 4));