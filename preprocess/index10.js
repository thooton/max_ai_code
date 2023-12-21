const fs = require("fs");

const evdata = JSON.parse(fs.readFileSync("./evdata.json"));
const names = JSON.parse(fs.readFileSync("./names.json"));
const sysprompt = JSON.parse(fs.readFileSync("./sysprompt.json"));

const ways = [
    "I live in <state>, and I want to buy a <type>.",
    "Hi, I'm currently residing in <state> and I want to purchase a <type>. Please advise.",
    "Hello, I want to reduce my emissions; I'm living in <state> and want to purchase a <type>. What's the best option?",
    "I'm conscientious about my impact on the environment, and I want to purchase a <type> in <state>. What should I do?"
];

function introFor(name) {
    return sysprompt
    + "<|im_start|>assistant\n"
    + `Hi! You must be ${name}. I'm Max, it's fascinating to meet you.<|im_end|>\n`;
}

const upsample_specific = 10;
const upsample_state = 20;

const conversations = [];
for (let state in evdata.electric) {
    const cars = evdata.electric[state];
    for (let i = 0; i < cars.length; i++) {
        for (let j = 0; j < upsample_specific; j++) {
            const name = names[Math.floor(Math.random() * names.length)];
            const type = evdata.types[i];
            const gas_vehicle = evdata.vehicles_gas[i];
            const electric_vehicle = evdata.vehicles_electric[i];
            const gas_emissions = evdata.gas[i];
            const electric_emissions = cars[i];
            conversations.push(
                introFor(name)
                + "<|im_start|>user\n"
                + ways[Math.floor(Math.random() * ways.length)]
                    .replace("<state>", state)
                    .replace("<type>", type) + "<|im_end|>\n"
                + "<|im_start|>assistant\n"
                + `Hi ${name}, it's a pleasure to help you with this.`
                + ` If you're living in ${state} and want to purchase a ${type},`
                + " I have two options for you:"
                + ` the gas-powered ${gas_vehicle}`
                + ` and the electric-powered ${electric_vehicle}.`
                + ` The ${gas_vehicle} produces an estimated ${gas_emissions.toFixed(2)} metric tons of`
                + " CO2 over its lifetime."
                + ` In comparison, if we take into account the sources of electricity in ${state},`
                + ` as well as the fixed CO2 emissions associated with the production of this ${type},`
                + ` the ${electric_vehicle} will produce an estimated ${electric_emissions.toFixed(2)}`
                + " metric tons of CO2 over its lifetime."
                + ` Thus, if you continue to reside in ${state}, given the choice between the two ${type}s,`
                + ` I would recommend purchasing the`
                + ` ${gas_emissions < electric_emissions ? "gas-powered" : "electric-powered"}`
                + ` ${gas_emissions < electric_emissions ? gas_vehicle : electric_vehicle}`
                + ` to minimize your environmental impact.<|im_end|>`
            );
        }
    }
}

function capitalize(s) {
    s = s.trim();
    return s[0].toUpperCase() + s.slice(1);
}

for (let state in evdata.electric) {
    for (let k = 0; k < upsample_state; k++) {
        const name = names[Math.floor(Math.random() * names.length)];
        let minv = "";
        let mine = Infinity;
        let mint = "";
        let mink = "";
        let v = introFor(name)
            + "<|im_start|>user\n"
            + `Hi! I live in ${state} and want to buy a car.<|im_end|>\n`
            + "<|im_start|>assistant\n"
            + `Excellent, ${name}! Allow me to advise you with some options:\n`
            + evdata.electric[state].map((ee, i) => {
                const type = evdata.types[i];
                const gv = evdata.vehicles_gas[i];
                const ev = evdata.vehicles_electric[i];
                const ge = evdata.gas[i];
                if (ge < mine) {
                    mine = ge;
                    minv = gv;
                    mint = type;
                    mink = "gas-powered";
                }
                if (ee < mine) {
                    mine = ee;
                    minv = ev;
                    mint = type;
                    mink = "electric-powered";
                }
                return `- ${capitalize(type)}: I know of the gas-powered ${gv},`
                    + ` releasing ${ge.toFixed(2)} metric tons of CO2 in lifetime emissions,`
                    + ` and the electric-powered ${ev}, releasing ${ee.toFixed(2)} of the same in ${state}.\n`;
            }).join("");
        v += `Overall, I would recommend the ${mink} ${mint}:`
        v += ` the ${minv}, releasing only ${mine.toFixed(2)}`
        v += " metric tons of CO2 over its lifetime."
        v += " Of course, if you prefer a different type of car,"
        v += " you may consult the list above."
        conversations.push(v);
    }
}

fs.writeFileSync("./max_vehicles.json", JSON.stringify(conversations, null, 4));