import datasets
import json
import secrets

def ldjson(fname):
    with open(fname, "rb") as f:
        return json.loads(f.read())

dataset = datasets.load_dataset("jerryjalapeno/nart-100k-synthetic")
names = ldjson("./names.json")
banned_words = ldjson("./banned_words.json")
sysprompt = ldjson("./sysprompt.json")

i = 0
conversations = []
for conv in dataset["train"]:
    name = secrets.choice(names)
    def processEntry(entry):
        pfx = (
            "user"
            if entry["from"] == "human"
            else "assistant"
        )
        value = (
            entry["value"]
            .replace("Alex", "Max")
            .replace("Charlie", name)
        )
        return f"<|im_start|>{pfx}\n{value}<|im_end|>\n"
    processed = sysprompt + "".join(map(processEntry, [{
        "from": "gpt",
        "value": f"Hi! You must be {name}. I'm Max, it's fascinating to meet you."
    }] + conv["conversations"])).strip()
    bad = False
    for banned_word in banned_words:
        if banned_word in processed:
            bad = True
            break
    if bad:
        continue
    conversations.append(processed)
    i += 1
    if i > 1500:
        break

with open("./max_therapy.json", "wb") as f:
    f.write(json.dumps(conversations, indent=4).encode("utf-8"))