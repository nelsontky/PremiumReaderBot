const $ = require("cheerio");
const axios = require("axios").default;
const postToTelegraph = require("./utils/postToTelegraph");
let headers = require("./secrets/headers.json");
const updateStCookies = require("./utils/updateStCookies");

async function siteHandler(url, domain) {
  const res =
    domain === "bloomberg.com"
      ? await axios.get(url, { headers: headers.bloomberg })
      : domain === "straitstimes.com"
      ? await axios.get(url, { headers: headers.st })
      : await axios.get(url, { headers: headers.generic });

  let html = res.data;

  const title = $("title", html).text();
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
      if (
        html.includes(
          `<h4 class="paywall-header">Enjoy unlimited access to ST's best work</h4>`
        )
      ) {
        // Run when logged out of ST, put into another function soon? :)
        await updateStCookies();
        headers = require("./secrets/headers.json");
        html = (await axios.get(url, { headers: headers.st })).data;
      }

      domNode = $("div[class='col-md-8 ']", html)[0];
      break;
  }
  
  return await postToTelegraph(title, domNode);
}

module.exports = siteHandler;
