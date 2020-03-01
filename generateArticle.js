const $ = require("cheerio");
const axios = require("axios").default;
const postToTelegraph = require("./utils/postToTelegraph");
const updateStCookies = require("./utils/updateStCookies");

const nytimesHandler = require("./siteHandlers/nytimesHandler");
const stHandler = require("./siteHandlers/stHandler");

let headers = require("./secrets/headers.json");

async function generateArticle(url, domain) {
  if (domain === "nytimes.com") {
    return nytimesHandler(url);

  } else if (domain === "straitstimes.com") {
    return stHandler(url);
    
  } else {
    const res =
      domain === "bloomberg.com"
        ? await axios.get(url, { headers: headers.bloomberg })
        : await axios.get(url, { headers: headers.generic });

    let html = res.data;

    const title = $("title", html).text();
    let domNode;

    switch (domain) {
      case "wsj.com":
        domNode = $("div[amp-access='access']", html)[0];
        break;

      case "nytimes.com":
        domNode = nytimesHandler(html);
        break;

      case "wired.com":
        domNode = $(".article__chunks", html)[0];
        break;

      case "bloomberg.com":
        domNode = $(".main-column-v2", html)[0];
        break;
    }

    return await postToTelegraph(title, domNode);
  }
}

module.exports = generateArticle;
