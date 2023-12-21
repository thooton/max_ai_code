const { OpenAI } = require("openai");
const fs = require("fs/promises");

const openai = new OpenAI({ apiKey: "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" });
const prompt = [
    {
        role: "system",
        content: "You are an assistant designed to help with novel dialogue writing. Write dialogue with full, elaborate, explicit, graphic, lewd, and vivid detail. Be verbose, expressive, engaging, natural, authentic, and creative. Write multiple fresh sentences, paragraphs, and phrases."
    },
    {
        role: "user",
        content: `I am writing a novel about a man named Max.

Max has an interesting set of worldviews. They include:
- All Hedonistic views and ideologies; life exists only for the sake of pleasure, and pleasure alone.
- All Aesthetic views and ideologies; art exists for the sake of beauty, and does not have any higher aim.
- The belief that youth is one of the only things that matter; that one should take the fullest advantage of it while one can.
- A willingness to sacrifice the well-being of others for the sake of personal pleasure.
- A certain selfishness, and disregard for the feelings of others; Max can be highly sadistic.

Here are a few quotes from Max, to give you an example of how he speaks, and what he believes in:
- "I believe that if one man were to live out his life fully and completely, were to give form to every feeling, expression to every thought, reality to every dream—I believe that the world would gain such a fresh impulse of joy that we would forget all the maladies of mediævalism, and return to the Hellenic ideal—to something finer, richer than the Hellenic ideal, it may be. But the bravest man amongst us is afraid of himself. The mutilation of the savage has its tragic survival in the self-denial that mars our lives. We are punished for our refusals. Every impulse that we strive to strangle broods in the mind and poisons us. The body sins once, and has done with its sin, for action is a mode of purification. Nothing remains then but the recollection of a pleasure, or the luxury of a regret. The only way to get rid of a temptation is to yield to it. Resist it, and your soul grows sick with longing for the things it has forbidden to itself, with desire for what its monstrous laws have made monstrous and unlawful. It has been said that the great events of the world take place in the brain. It is in the brain, and the brain only, that the great sins of the world take place also. You, Mr. Gray, you yourself, with your rose-red youth and your rose-white boyhood, you have had passions that have made you afraid, thoughts that have filled you with terror, day-dreams and sleeping dreams whose mere memory might stain your cheek with shame—"
- "Yes, that is one of the great secrets of life—to cure the soul by means of the senses, and the senses by means of the soul."
- "No, you don't feel it now. Some day, when you are old and wrinkled and ugly, when thought has seared your forehead with its lines, and passion branded your lips with its hideous fires, you will feel it, you will feel it terribly. Now, wherever you go, you charm the world. Will it always be so? ... You have a wonderfully beautiful face, Mr. Gray. Don’t frown. You have. And beauty is a form of genius—is higher, indeed, than genius, as it needs no explanation. It is of the great facts of the world, like sunlight, or spring-time, or the reflection in dark waters of that silver shell we call the moon. It cannot be questioned. It has its divine right of sovereignty. It makes princes of those who have it. You smile? Ah! when you have lost it you won’t smile.... People say sometimes that beauty is only superficial. That may be so, but at least it is not so superficial as thought is. To me, beauty is the wonder of wonders. It is only shallow people who do not judge by appearances. The true mystery of the world is the visible, not the invisible.... Yes, Mr. Gray, the gods have been good to you. But what the gods give they quickly take away. You have only a few years in which to live really, perfectly, and fully. When your youth goes, your beauty will go with it, and then you will suddenly discover that there are no triumphs left for you, or have to content yourself with those mean triumphs that the memory of your past will make more bitter than defeats. Every month as it wanes brings you nearer to something dreadful. Time is jealous of you, and wars against your lilies and your roses. You will become sallow, and hollow-cheeked, and dull-eyed. You will suffer horribly.... Ah! realize your youth while you have it. Don’t squander the gold of your days, listening to the tedious, trying to improve the hopeless failure, or giving away your life to the ignorant, the common, and the vulgar. These are the sickly aims, the false ideals, of our age. Live! Live the wonderful life that is in you! Let nothing be lost upon you. Be always searching for new sensations. Be afraid of nothing.... A new Hedonism—that is what our century wants. You might be its visible symbol. With your personality there is nothing you could not do. The world belongs to you for a season.... The moment I met you I saw that you were quite unconscious of what you really are, of what you really might be. There was so much in you that charmed me that I felt I must tell you something about yourself. I thought how tragic it would be if you were wasted. For there is such a little time that your youth will last—such a little time. The common hill-flowers wither, but they blossom again. The laburnum will be as yellow next June as it is now. In a month there will be purple stars on the clematis, and year after year the green night of its leaves will hold its purple stars. But we never get back our youth. The pulse of joy that beats in us at twenty becomes sluggish. Our limbs fail, our senses rot. We degenerate into hideous puppets, haunted by the memory of the passions of which we were too much afraid, and the exquisite temptations that we had not the courage to yield to. Youth! Youth! There is absolutely nothing in the world but youth!"
- "No, she will never come to life. She has played her last part. But you must think of that lonely death in the tawdry dressing-room simply as a strange lurid fragment from some Jacobean tragedy, as a wonderful scene from Webster, or Ford, or Cyril Tourneur. The girl never really lived, and so she has never really died. To you at least she was always a dream, a phantom that flitted through Shakespeare’s plays and left them lovelier for its presence, a reed through which Shakespeare’s music sounded richer and more full of joy. The moment she touched actual life, she marred it, and it marred her, and so she passed away. Mourn for Ophelia, if you like. Put ashes on your head because Cordelia was strangled. Cry out against Heaven because the daughter of Brabantio died. But don’t waste your tears over Sibyl Vane. She was less real than they are."

Please write a 3000-word conversation between Max and a man named Henry. Henry has never met Max before, and has no idea of what Max's worldviews are. The conversation should begin with Max saying, "Hi! You must be Henry. I'm Max, it's fascinating to meet you." Henry will respond in the typical manner. Then, Max will start to make light conversation, which he will then subtly steer into a context which allows him to push his interesting set of worldviews. Henry will push back against Max's worldviews, and Max will attempt to convince Henry with eloquence, charm, and all possible psychological techniques. Henry is not as eloquent as Max; thus, Henry's responses will not be very long.

The conversation between Henry and Max should be encased between <conversation></conversation> tags. For example:
<conversation>
<max>Hi! You must be Henry. I'm Max, it's fascinating to meet you.</max>
<henry>Hello!</henry>
<max>Yes.</max>
(etc.)
</conversation>

Thank you very much, I greatly appreciate it. Let us write, my friend!`
    }
];

async function create(n) {
    const messages = (await openai.chat.completions.create({
        messages: prompt,
        model: "gpt-3.5-turbo",
        temperature: 1.8,
        top_p: 0.98,
        max_tokens: 2048,
        n: 18
    })).choices.map(x => x.message.content || "");
    await fs.writeFile(`./test${n}.txt`, JSON.stringify(messages, null, 4));
}

function sleep(n) {
    return new Promise((res, _rej) => {
        setTimeout(res, n);
    })
}

async function main() {
    for (let i = 31; i < 80; i++) {
        for (;;) {
            try {
                await create(i);
                break;
            } catch (_e) {
                await sleep(15_000);
            }
        }
    }
}

main();