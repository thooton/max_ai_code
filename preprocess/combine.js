const fs = require("fs/promises");
const xml2js = require("xml2js");

const names = [
    "Andrew", "James", "Amina", "Simer", "Ben",
    "Ethan", "Justin", "Petar", "Sarah", "Jaden",
    "David", "Anhiti", "Miles", "Abby", "Kira",
    "Matt", "Liam", "Dylan", "Tatum", "Kaylee",
    "Sam", "Aastha", "Atharva", "Kai", "James"
];

const ways = `Me too.
It's a pleasure to make your acquaintance as well.
I'm glad we've crossed paths.
The pleasure is all mine.
Likewise, I'm sure.
I'm equally delighted to meet you.
I also find this encounter pleasant.
I'm equally pleased to meet you.
The sentiment is mutual.
I'm just as excited to meet you.
It's equally wonderful meeting you.
It's equally a joy to meet you.
I'm also thrilled to meet you.
I'm happy we've met too.
I'm equally charmed to meet you.
I'm also enjoying this introduction.
I'm also pleased to have this opportunity.
I'm equally enchanted to meet you.
I'm also enjoying our first encounter.
It's equally delightful to meet you.
I'm also glad to have this chance.
I'm equally happy to cross paths with you.
I also appreciate this introduction.
It's also a pleasure to meet someone so interesting.
I'm equally pleased to meet someone of your caliber.
I'm also grateful for this meeting.
I'm equally glad to make your acquaintance.
I'm also happy to have this opportunity.
I'm equally delighted to cross paths with you.
It's equally a pleasure to meet someone like you.
I'm also thrilled to have this chance.
I'm equally happy to have this encounter.
I'm also delighted to make your acquaintance.
It's equally wonderful to meet someone like you.
It's also a joy to meet someone of your stature.
I'm equally pleased to have this encounter.
I'm also charmed to meet you.
It's equally delightful to meet someone so engaging.
I'm also glad to have this encounter.
I'm equally thrilled to make your acquaintance.
I'm also pleased to cross paths with you.
It's equally a pleasure to meet someone so inspiring.
I'm also happy to meet someone of your reputation.
I'm equally delighted to have this chance.
It's also a joy to meet someone so thoughtful.
I'm also pleased to meet someone so intriguing.
I'm equally charmed to have this chance.
It's also wonderful to meet someone so accomplished.
I'm equally thrilled to meet someone of your expertise.
It's also delightful to meet someone so insightful.
I'm also glad to meet someone so dynamic.`.split("\n");

async function main() {
    const sysprompt = JSON.parse(await fs.readFile("sysprompt.json"));

    let conversations = [];

    (await xml2js.parseStringPromise(await fs.readFile("test.txt")))
        .root
        .conversation
        .forEach(x => conversations.push(x));
    for (let i = 2; i <= 79; i++) {
        const conv_list = JSON.parse(await fs.readFile(`test${i}.txt`));
        for (let j = 0; j < conv_list.length; j++) {
            let conv = conv_list[j];
            conv = conv.split("<conversation>")[1]
                .split("</conversation>")[0];
            conv = "<root>" + conv + "</root>";
            try {
                conversations.push(
                    (await xml2js.parseStringPromise(conv))
                    .root
                );
            } catch (e) {
                console.log(`Conversation ${i}/${j} has an error`);
                continue;
            }
        }
    }

    conversations = conversations.map(x => {
        let s = sysprompt;
        const name = names[Math.floor(Math.random() * names.length)];
        for (let i = 0;; i++) {
            const max = x.max[i];
            if (!max) {
                break;
            }
            s += "<|im_start|>assistant\n";
            s += max.trim().replaceAll("Henry", name);
            s += "<|im_end|>\n";
            const henry = x.henry[i];
            if (!henry) {
                break;
            }
            s += "<|im_start|>user\n";
            if (i == 0 && Math.random() < 0.5) {
                s += ways[Math.floor(Math.random() * ways.length)];
            } else {
                s += henry.trim().replaceAll("Henry", name);
            }
            s += "<|im_end|>\n";
        }
        return s.trim();
    })

    fs.writeFile("./max_henry.json", JSON.stringify(conversations, null, 4));
}

main();