const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let cloudflare_change = "duetocloudflarelimitsi'mcurentlygettingnewcookies,pleasetryagain."

module.exports = {
    apiKey: String, // the ai api key
    customUrl: String, // you can put a website a clone to youdotcom
    retry_limit: Number, // the limit request call when cloudflare change
    chat(message, callback) {
        (async () => {
            const msg = message.replace(" ", "+");
            let apiKeyGiven = undefined;
            let req_url = `https://api.betterapi.net/youdotcom/chat?message=${msg}&key=${apiKeyGiven}`
            let req_counter = 0; // count the cloudflare change
            let cloudflare_retry_limit = this.retry_limit || 3

            if (this.apiKey && typeof(this.apiKey) === "string") {
                apiKeyGiven = this.apiKey.trim();
            } else {
                apiKeyGiven = ""
            }

            if (this.customUrl && typeof(this.customUrl) === "string") {
                req_url = this.customUrl + `/chat?message=${msg}&key=${apiKeyGiven}`
            } else {
                req_url = `https://api.betterapi.net/youdotcom/chat?message=${msg}&key=${apiKeyGiven}`
            }

            if (cloudflare_retry_limit) {
                if (Number(this.retry_limit) === NaN) cloudflare_retry_limit = 3; // it must be wrong
                cloudflare_retry_limit = Number(this.retry_limit); // if everything is fine then change the limit
            }

            // api.betterapi.net;
            function execute_get_req() { // the function exist because the cloudflare_change message bypass
                fetch(req_url).then(res => res.json()).then(json => {
                    try {
                        setTimeout(() => {
                            if (!json) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: Something went wrong with the request.
                            if (!json["message"]) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: API not return message.
                            if (json["message"].toLowerCase().replace(/ /g,'') === cloudflare_change) {
                                req_counter++; // +1 value to req_counter
                                if (req_counter > cloudflare_retry_limit) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: Facing issue with cloudflare
                                setTimeout(() => {
                                    execute_get_req();
                                }, 800); // wait until they change their cookie
                            }; // send a request again to get answer
                            callback(json["message"]);
                        }, 500);
                    } catch (err) {
                        throw err;
                    }
                })
            }
            execute_get_req(); // the function exist because the cloudflare_change message bypass
        })();
    }
}