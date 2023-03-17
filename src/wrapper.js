const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let cloudflare_change = "duetocloudflarelimitsi'mcurentlygettingnewcookies,pleasetryagain."

module.exports = {
    apiKey: String, // the ai api key (don't really need)
    customUrl: String, // you can put a website a clone to youdotcom web api
    cloudflare_message_bypass: Boolean, // this setting allow to bypass the message (not 100% working, it's just resend the request)
    retry: Boolean, // resend the request if it caught error
    clouflare_retry_limit: Number, // the limit request call when cloudflare message appear
    retry_limit: Number, // the limit request call when a error happen
    chat(message, callback) {
        (async () => {
            const msg = message.replace(" ", "+");
            let apiKeyGiven = undefined;
            let req_url = `https://api.betterapi.net/youdotcom/chat?message=${msg}&key=${apiKeyGiven}`
            let req_counter = 0; // count the cloudflare change
            let req_err_counter = 0; // count the error when executing function (execute_get_req())
            let cloudflare_retry_limit_value = this.clouflare_retry_limit || 3;
            let cloudflare_message_bypass_value = this.cloudflare_message_bypass || false;
            let retry_value = this.retry || false;
            let retry_limit_value = this.retry_limit || 3

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

            if (cloudflare_retry_limit_value) {
                if (Number(this.clouflare_retry_limit) === NaN) cloudflare_retry_limit_value = 3; // it must be wrong
                cloudflare_retry_limit_value = Number(this.clouflare_retry_limit); // if everything is fine then change the limit
            }

            // api.betterapi.net;
            function execute_get_req() { // the function exist because the cloudflare_change message bypass
                fetch(req_url).then(res => res.json()).then(json => {
                    try {
                        setTimeout(() => {
                            if (!json) {
                                req_err_counter++; // + 1 value to req_err counter
                                if (req_err_counter > retry_limit_value) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: Something went wrong with the request.
                                if (retry_value === true) {
                                    execute_get_req(); // call this function when it caught error
                                } else if (retry_value === false) {
                                    return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: Something went wrong with the request.
                                }
                            };
                            if (!json["message"]) {
                                req_err_counter++; // + 1 value to req_err counter
                                if (req_err_counter > retry_limit_value) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: API not return message.
                                if (retry_value === true) {
                                    execute_get_req(); // call this function when it caught error
                                } else if (retry_value === false) {
                                    return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: API not return message.
                                }
                            };
                            if (json["message"].toLowerCase().replace(/ /g,'') === cloudflare_change && cloudflare_message_bypass_value === true) {
                                req_counter++; // +1 value to req_counter
                                if (req_counter > cloudflare_retry_limit_value) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: Facing issue with cloudflare
                                setTimeout(() => {
                                    execute_get_req();
                                }, 800); // wait until they change their cookie
                            }; // send a request again to get answer
                            callback(json["message"]);
                        }, 500);
                    } catch (err) {
                        throw err; // cursed programming
                    }
                })
            }
            execute_get_req(); // the function exist because the cloudflare_change message bypass and retry when caught a error
        })();
    }
}