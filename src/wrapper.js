const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
let cloudflare_change = "due to cloudflare limits i'm curently getting new cookies, please try again."
let cloudflare_change_1 = "cloudflare error"

module.exports = {
    apiKey: String, // the ai api key (don't really need)
    customUrl: String, // you can put a website a clone to youdotcom web api
    cloudflare_message_bypass: Boolean, // this setting allow to bypass the message (not 100% working, it's just resend the request)
    cloudflare_retry_limit: Number, // the limit request call when cloudflare message appear
    retry: Boolean, // resend the request if it caught error
    retry_limit: Number, // the limit request call when a error happen
    chat(message, callback) {
        (async () => {
            const msg = message.replace(" ", "+");
            let apiKeyGiven = undefined;
            let req_url = `https://api.betterapi.net/youdotcom/chat?message=${msg}&key=${apiKeyGiven}`
            let req_counter = 0; // count the cloudflare change
            let req_err_counter = 0; // count the error when executing function (execute_get_req())
            let cloudflare_retry_limit_value = this.cloudflare_retry_limit || 3;
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
                if (Number(this.cloudflare_retry_limit) === NaN) cloudflare_retry_limit_value = 3; // it must be wrong
                cloudflare_retry_limit_value = Number(this.cloudflare_retry_limit); // if everything is fine then change the limit
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
                                    return execute_get_req(); // call this function when it caught error
                                } else if (retry_value === false) {
                                    return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: Something went wrong with the request.
                                }
                            };
                            if (json["error"]) {
                                req_err_counter++; // + 1 value to req_err counter
                                if (req_err_counter > retry_limit_value) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: API not return message.
                                if (retry_value === true) {
                                    return execute_get_req(); // call this function when it caught error
                                } else if (retry_value === false) {
                                    return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: API not return message.
                                }
                            }
                            if (!json["message"]) {
                                req_err_counter++; // + 1 value to req_err counter
                                if (req_err_counter > retry_limit_value) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: API not return message.
                                if (retry_value === true) {
                                    return execute_get_req(); // call this function when it caught error
                                } else if (retry_value === false) {
                                    return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: API not return message.
                                }
                            };
                            if (!json["time"]) {
                                req_err_counter++; // + 1 value to req_err counter
                                if (req_err_counter > retry_limit_value) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: API not return message.
                                if (retry_value === true) {
                                    return execute_get_req(); // call this function when it caught error
                                } else if (retry_value === false) {
                                    return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: API not return message.
                                }
                            };
                            if (!Number(json["time"])) {
                                req_err_counter++; // + 1 value to req_err counter
                                if (req_err_counter > retry_limit_value) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: API not return message.
                                if (retry_value === true) {
                                    return execute_get_req(); // call this function when it caught error
                                } else if (retry_value === false) {
                                    return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: API not return message.
                                }
                            };
                            if ((json["message"].toLowerCase() === cloudflare_change || json["message"].toLowerCase() === cloudflare_change_1) && cloudflare_message_bypass_value === true) {
                                req_counter++; // +1 value to req_counter
                                if (req_counter > cloudflare_retry_limit_value) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: Facing issue with cloudflare
                                return setTimeout(() => {
                                    return execute_get_req();
                                }, 800); // wait until they change their cookie
                            }; // send a request again to get answer
                            let time = Number(json["time"]) || 1;
                            if (json["message"] === "" && time < 2) {
                                req_err_counter++; // + 1 value to req_err counter
                                if (req_err_counter > retry_limit_value) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: Something went wrong with the request.
                                if (retry_value === true) {
                                    return execute_get_req(); // call this function when it caught error
                                } else if (retry_value === false) {
                                    return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: Something went wrong with the request.
                                }
                            }
                            callback(json["message"]);
                        }, 500);
                    } catch (err) {
                        req_err_counter++; // + 1 value to req_err counter
                        if (req_err_counter > retry_limit_value) return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: Something went wrong with the request.
                        if (retry_value === true) {
                            return execute_get_req(); // call this function when it caught error
                        } else if (retry_value === false) {
                            return callback("We're sorry, something went wrong while processing your request. Please try again."); //[ERROR]: Something went wrong with the request.
                        }
                    }
                })
            }
            execute_get_req(); // the function exist because the cloudflare_change message bypass and retry when caught a error
        })();
    }
}