# youchatwrapper
IMPORTANT: This npm package is unoffical.
I found this api in You-Python github.

You-Python Github: https://github.com/You-OpenSource/You-Python

It may have bug, please report.

# How to use?

Simple code:

```Javascript
const youchatwrapper = require("@codernocook/youchatwrapper");

youchatwrapper.apiKey = "Get Api Key here: https://betterapi.net/about/" // You don't really need it, you can get it if you like

youchatwrapper.chat("Who are you?", function(callback) {
    console.log(callback); // replace this with your code
})
```

Settings:

```Json
{
    apiKey: String, // the ai api key (don't really need)
    customUrl: String, // you can put a website a clone to youdotcom web api
    cloudflare_message_bypass: Boolean, // this setting allow to bypass the message (not 100% working, it's just resend the request)
    retry: Boolean, // resend the request if it caught error
    clouflare_retry_limit: Number, // the limit request call when cloudflare message appear
    retry_limit: Number // the limit request call when a error happen
}
```

To change the setting:

```Javascript
const youchatwrapper = require("@codernocook/youchatwrapper");

youchatwrapper["setting"] = value; //  change the ["setting"] to the Setting you want
```

> **_NOTE:_**  I'm a new javascript developer. My code write really bad.