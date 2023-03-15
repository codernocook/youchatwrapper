const puppeteer = require("puppeteer");

module.exports = {
    chat(message, callback) {
        (async () => {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            const msg = message.replace(" ", "+");

            // goto You.com
            await page.goto(`https://you.com/search?q=${msg}&fromSearchBar=false&tbm=youchat`)

            // Get the result by execute javascript
            
            const result = await page.evaluate((message) => {
                let chat_history = document.getElementById("chatHistory");
                let result_get = undefined;
                let chat_loop = false;
                let include_loop = false;

                function delay(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                async function check() {
                    await delay(10*1000);
                    console.log(document.getElementById("chatHistory"))
                    chat_history = document.getElementById("chatHistory");
                    return executecode()
                }
                return check();
                function executecode() {
                    if (chat_loop === true) return;
                    chat_loop = true;
                    result_get = chat_history.children[0]["outerText"];
                    while (!result_get.includes(". . .")) {
                        if (include_loop === true) return;
                        include_loop = true;
                        if (!result_get.includes(`${message}\n\n`)) {
                            return result_get
                        } else {
                            return result_get.replace(`${message}\n\n`, "");
                        }
                    }
                }
            }, message)

            
            //Wait for the result
            let anti_callback_loop = false;
            while (result !== undefined) {
                if (anti_callback_loop === false) {
                    anti_callback_loop = true; // prevent from looping the callback
                    callback(result);
                }
            }
        })();
    },
    search_chat() {
        (async () => {
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            const msg = message.replace(" ", "+");

            // goto You.com
            await page.goto(`https://you.com/search?q=${msg}&fromSearchBar=true&tbm=youchat`)

            // Get the result by execute javascript
            let result = undefined;
            await page.evaluate(function(message, result) {
                let chat_history = document.getElementById("chatHistory");
                let anti_resultwait_loop = false;

                function resultwait() {
                    if (anti_resultwait_loop === true) return;
                    if (!chat_history || !chat_history.children) {
                        resultwait();
                    } else {
                        anti_resultwait_loop = true; //prevent loop the below function
                        let result_get = chat_history.children[0]["outerText"];

                        function waitforans() {
                            if (!result_get.includes(". . .")) {
                                result = result_get.replace(`${message}\n\n`, "");
                            } else {
                                waitforans();
                            }
                        }
                        waitforans(); // call a loop
                    }
                }
                resultwait(); //call a loop that check the result is out yet
            }, message, result);
            
            //Wait for the result
            let anti_callback_loop = false;
            function checkresult() {
                if (result !== undefined) {
                    if (anti_callback_loop === false) {
                        callback(result);
                        anti_callback_loop = true; // prevent from looping the callback
                    }
                } else {
                    checkresult();
                }
            }
            checkresult(); //call a loop
        })();
    }
}