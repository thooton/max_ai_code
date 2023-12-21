const fs = require("fs");

const names = JSON.parse(fs.readFileSync("./names.json"));
const descriptions_list = JSON.parse(fs.readFileSync("./descriptions.json"));
const sysprompt = JSON.parse(fs.readFileSync("./sysprompt.json"));

if (names.length != descriptions_list.length) {
    throw new Error("??");
}

const ways = `What information do you have about me?
Can you tell me what you've learned about me?
What's your understanding of who I am?
How would you describe me based on what you know?
What facts do you hold about me?
What's your perception of me?
How much do you know about my life?
What insights do you have about me?
What can you recall about me?
What's your synopsis of me?
What's your interpretation of my character?
What do you comprehend about me?
What is your knowledge about me?
Can you share what you've found out about me?
How would you characterize me based on your knowledge?
What details do you have about me?
What's your viewpoint on me?
How much information do you have about my life?
What observations do you have about me?
What's your recount of me?
What's your analysis of my personality?
What do you understand about me?
What is your information about me?
Can you share what you've discovered about me?
How would you define me based on your knowledge?
What particulars do you have about me?
What's your perspective on me?
How much data do you have about my life?
What speculations do you have about me?
What's your summary of me?
What's your evaluation of my character?
What do you infer about me?
What is your data about me?
Can you share what you've uncovered about me?
How would you portray me based on your data?
What particulars do you have about me?
What's your opinion on me?
How much information do you have about my life?
What conjectures do you have about me?
What's your report of me?
What's your assessment of my personality?
What do you deduce about me?
What is your understanding about me?
Can you share what you've gathered about me?
How would you illustrate me based on your understanding?
What details do you have about me?
What's your view on me?
How much knowledge do you have about my life?
What assumptions do you have about me?
What's your narrative of me?
What's your estimation of my character?
What do you hypothesize about me?
What is your insight into me?
Can you share what you've observed about me?
How would you depict me based on your insight?
What specifics do you have about me?
What's your perspective on me?
How much information do you have about my life?
What conjectures do you have about me?
What's your account of me?
What's your judgment of my character?
What do you speculate about me?
What is your perception about me?
Can you share what you've learned about me?
How would you portray me based on your perception?
What particulars do you have about me?
What's your opinion on me?
How much data do you have about my life?
What speculations do you have about me?
What's your summary of me?
What's your evaluation of my character?
What do you infer about me?
What is your information about me?
Can you share what you've discovered about me?
How would you define me based on your information?
What particulars do you have about me?
What's your perspective on me?
How much knowledge do you have about my life?
What conjectures do you have about me?
What's your report of me?
What's your assessment of my personality?
What do you deduce about me?
What is your understanding about me?
Can you share what you've gathered about me?
How would you illustrate me based on your understanding?
What details do you have about me?
What's your view on me?
How much data do you have about my life?
What assumptions do you have about me?
What's your narrative of me?
What's your estimation of my character?
What do you hypothesize about me?
What is your insight into me?
Can you share what you've observed about me?
How would you depict me based on your insight?
What specifics do you have about me?
What's your perspective on me?
How much knowledge do you have about my life?
What conjectures do you have about me?
What's your account of me?`.split("\n");

const banned_words = [
    "I am", "\"you",
    "As you", "I like",
    "I enjoy", "AI language model",
    "my programming",
    "the given",
    "the information",
    "you are described",
    "the description",
    "described as",
    "your description",
    "ethical",
    "neutral",
    "I apologize",
    "I'm sorry"
];

const conversations = [];
for (let i = 0; i < descriptions_list.length; i++) {
    const name = names[i];
    const descriptions = descriptions_list[i];
    for (let desc of descriptions) {
        desc = desc.trim();
        if (desc.startsWith("As")) {
            continue;
        }
        let bad = false;
        for (const banned_word of banned_words) {
            if (desc.includes(banned_word)) {
                bad = true;
                break;
            }
        }
        if (bad) {
            continue;
        }
        let way = "What do you know about me?";
        if (Math.random() > 0.2) {
            way = ways[Math.floor(Math.random() * ways.length)];
        }
        conversations.push(
            sysprompt
            + "<|im_start|>assistant"
            + `\nHi! You must be ${name}. I'm Max, it's fascinating to meet you.<|im_end|>`
            + "\n<|im_start|>user"
            + "\n" + way + "<|im_end|>"
            + "\n<|im_start|>assistant"
            + "\n" + desc + "<|im_end|>"
        );
    }
}

fs.writeFileSync("./max_descriptions.json", JSON.stringify(conversations, null, 4));