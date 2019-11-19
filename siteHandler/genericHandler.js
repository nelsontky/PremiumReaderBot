const $ = require("cheerio");
const rp = require("request-promise");

const postToTelegraph = require("../utils/postToTelegraph");

async function genericHandler(url, domain) {
  const options = {
    uri: url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      Referer: "https://www.google.com/"
    }
  };

  const html = await rp(options);

  let title = "";
  let body = "";
  let image = "";

  switch (domain) {
    case "wsj.com":
      title = $("title", html).text();
      $("div[amp-access = 'access'] > p", html).each((i, e) => {
        body += $(e)
          .text()
          .replace(/(\r\n|\n|\r)/gm, "");
        body += "\n";
      });
      $(".paywall > p", html).each((i, e) => {
        body += $(e)
          .text()
          .replace(/(\r\n|\n|\r)/gm, "");
        body += "\n";
      });
      
      // Lazy to implement images for now
      // try {
      //   image = $("img", html)[0].attribs.src;
      // } catch (e) {}
      break;

    case "nytimes.com":
      title = $("title", html).text();
      $("p", html).each((i, e) => {
        body += $(e).text() + "\n";
      });
      try {
        image = $("img.css-11cwn6f", html)[0].attribs.src;
      } catch (e) {}
      break;

    case "wired.com":
      title = $("h1", html).text();
      $(".article__body > p", html).each((i, e) => {
        body += $(e).text() + "\n";
      });
      try {
        image = $("source", html)[0].attribs.srcset;
      } catch (e) {}
      break;
  }
  return await postToTelegraph(title, body, image);
}

module.exports = genericHandler;
