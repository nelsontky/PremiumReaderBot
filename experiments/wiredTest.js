const $ = require("cheerio");
const rp = require("request-promise");

async function wiredTest(url) {
  let title = "";
  let body = "";
  let image = "";
  const options = {
    uri: url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      Referer: "https://www.google.com/"
    }
  };

  const html = await rp(options);
  title = $("h1", html).text();
  $(".article__body > p", html).each((i, e) => {
    body += $(e).text() + "\n";
  });
  try {
    image = $("source", html)[0].attribs.srcset;
  } catch (e) {
    // sometimes article has no image
  }
  console.log(title);
  console.log(body);
  console.log(image);
}

const url = "https://www.wired.com/story/meet-the-immigrants-who-took-on-amazon/";
wiredTest(url);
