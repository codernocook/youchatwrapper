const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    apiKey: String,
    chat(message, callback) {
        (async () => {
            const msg = message.replace(" ", "+");
            let apiKeyGiven = undefined;

            if (this.apiKey && typeof(this.apiKey) === "string") {
                apiKeyGiven = this.apiKey.trim();
            } else {
                apiKeyGiven = ""
            }

            // api.betterapi.net;
            fetch(`https://api.betterapi.net/youdotcom/chat?message=${msg}&key=${apiKeyGiven}`).then(res => res.json()).then(json => {
                try {
                    if (!json) return console.error("[ERROR]: Something went wrong with the request.")
                    if (!json["message"]) return console.error("[ERROR]: API not return message.")
                    callback(json["message"])
                } catch (err) {
                    console.error(err)
                }
            })
        })();
    }
}