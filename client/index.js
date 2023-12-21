const API_SERVER = "http://127.0.0.1:8080/completion"
const SYSTEM_MESSAGE = "You are Max, a hedonist and aestheticist."

marked.setOptions({
    highlight: function (code, lang) {
        if (lang && Prism.languages[lang]) {
            return Prism.highlight(code, Prism.languages[lang], lang);
        }
        return code;
    },
});

function getById(id) {
    const obj = document.getElementById(id);
    if (!obj) {
        throw new Error(`can't get ${id}`);
    }
    return obj;
}

function msgToElem(msg) {
    if (msg.role === "clear") {
        return document.createElement("hr");
    }

    const elem = document.createElement("div");
    elem.classList.add("chat_message");
    elem.innerHTML = DOMPurify.sanitize(marked.parse(msg.text, {
        headerIds: false,
        mangle: false
    }));

    return elem;
}

async function fetchCompletion(prompt) {
    const response = await fetch(API_SERVER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "text/event-stream"
        },
        body: JSON.stringify({
            prompt,
            stop: ["<|im_end|>"],
            stream: true
        })
    });

    return response.body.getReader();
}

class ChatContainer {
    constructor(id) {
        this.container = getById(id);
        this.messages = [];
    }
    pop() {
        this.messages.pop();
        this.container.lastChild.remove();
    }
    push(msg) {
        this.messages.push(msg);
        this.container.appendChild(msgToElem(msg));
    }
    rawPrompt() {
        return [{
            role: "system",
            text: SYSTEM_MESSAGE
        }].concat(this.messages)
            .map(x => `<|im_start|>${x.role}\n${x.text}<|im_end|>\n`)
            .join("")
            + "<|im_start|>assistant\n";
    }
}

const chat_container = new ChatContainer("chat_container");
const input_box = getById("input_box");
const text_decoder = new TextDecoder();

async function complete() {
    const reader = await fetchCompletion(
        chat_container.rawPrompt()
    );
    let assistant_response = "";
    let buf = "";

    chat_container.push({
        role: "assistant",
        text: ""
    });
    while (true) {
        const evt = await reader.read();
        if (evt.done) {
            return;
        }

        buf += text_decoder.decode(evt.value);

        while (true) {
            const data_matches = /data: (.*)\n\n/.exec(buf);
            if (!data_matches) {
                break;
            }

            buf = buf.substring(data_matches.index + data_matches[0].length);
            const msg = JSON.parse(data_matches[1]);

            if (msg.content) {
                assistant_response += msg.content;
                chat_container.pop();
                chat_container.push({
                    role: "assistant",
                    text: assistant_response
                });
                continue;
            }
            if (msg.stop) {
                await reader.cancel();
                return;
            }
        }
    }
}

chat_container.push({
    role: "assistant",
    text: "Hi! You must be Simer. I'm Max, it's fascinating to meet you."
})

let receiving = false;
input_box.addEventListener("keydown", evt => {
    if (receiving || evt.key !== "Enter") {
        return;
    }

    evt.preventDefault();
    if (evt.shiftKey) {
        let cur_pos = input_box.selectionStart;
        input_box.value = input_box.value.substring(0, cur_pos)
            + "\n"
            + input_box.value.substring(cur_pos);
        cur_pos += 1;
        input_box.selectionStart = cur_pos;
        input_box.selectionEnd = cur_pos;
        return;
    }

    const prompt = input_box.value.trim();
    if (!prompt) {
        return;
    }

    chat_container.push({
        role: "user",
        text: prompt
    })
    complete().then(() => receiving = false);
    input_box.value = "";
});