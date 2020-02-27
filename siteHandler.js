const $ = require("cheerio");
const axios = require("axios").default;
const postToTelegraph = require("./utils/postToTelegraph");
const headers = require("./secrets/headers.json");

async function siteHandler(url, domain) {
  const res =
    domain === "bloomberg.com"
      ? await axios.get(url, { headers: headers.bloomberg })
      : domain === "straitstimes.com"
      ? await axios.get(url, { headers: headers.st })
      : await axios.get(url, { headers: headers.generic });

  const html = res.data;

  let title = $("title", html).text();
  let domNode;

  switch (domain) {
    case "wsj.com":
      domNode = $("div[amp-access='access']", html)[0];
      break;

    case "nytimes.com":
      domNode = $(".meteredContent.css-1r7ky0e", html)[0];
      break;

    case "wired.com":
      domNode = $(".article__chunks", html)[0];
      break;

    case "bloomberg.com":
      domNode = $(".main-column-v2", html)[0];
      break;

    case "straitstimes.com":
      domNode = $("div[class='col-md-8 ']", html)[0];
      break;
  }
  return await postToTelegraph(title, domNode);
}

module.exports = siteHandler;
