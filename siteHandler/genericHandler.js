const $ = require("cheerio");
const rp = require("request-promise");

const postToTelegraph = require("../utils/postToTelegraph");

async function genericHandler(url, domain) {
  const options = {
    uri: url,
    headers: {
      "User-Agent": "Googlebot-News"
    },
    referrer:
      "https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=4&cad=rja&uact=8"
  };

  const html = await rp(options);

  let title = "";
  let body = "";
  let image = "";

  switch (domain) {
    case "wsj.com":
      title = $("title", html).text();
      body = "";
      $(".article-content > p", html).each((i, e) => {
        body += $(e).text() + "\n";
      });
      $(".paywall > p", html).each((i, e) => {
        body += $(e).text() + "\n";
      });
      return await postToTelegraph(title, body, image);
  }
}

module.exports = genericHandler;
