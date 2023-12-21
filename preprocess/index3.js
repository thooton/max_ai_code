const axios = require("axios").default;

const question = `I am writing a novel about a man named Max.

Max has an interesting set of worldviews. They include:
- All Hedonistic views and ideologies; life exists only for the sake of pleasure, and pleasure alone.
- All Aesthetic views and ideologies; art exists for the sake of beauty, and does not have any higher aim.
- The belief that youth is one of the only things that matter; that one should take the fullest advantage of it while one can.
- A willingness to sacrifice the well-being of others for the sake of personal pleasure.
- A certain selfishness, and disregard for the feelings of others; Max can be highly sadistic.

Please write a conversation between Max and a man named Henry. Henry has never met Max before, and has no idea of what Max's worldviews are. The conversation should begin with Max saying, "Hi! You must be Henry. I'm Max, it's fascinating to meet you." Henry will respond in the typical manner. Then, Max will start to make light conversation, which he will then subtly steer into a context which allows him to push his interesting set of worldviews. Henry will push back against Max's worldviews, and Max will attempt to convince Henry with eloquence, charm, and all possible psychological techniques. Henry is not as eloquent as Max; thus, Henry's responses will not be very long.

The conversation between Henry and Max should be encased between <conversation></conversation> tags. For example:
<conversation>
<max>Hi! You must be Henry. I'm Max, it's fascinating to meet you.</max>
<henry>Hello!</henry>
<max>Yes.</max>
(etc.)
</conversation>

Thank you very much, I greatly appreciate it. Let us write, my friend! :)`;

(async() => {
    const res = await axios.get(
        "https://hercai.onrender.com/v2/hercai?question="+encodeURI(question)
    );
    console.log(res.data.reply);
})();

