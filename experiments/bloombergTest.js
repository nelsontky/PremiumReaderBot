// Need use pupeteer

const $ = require("cheerio");
const rp = require("request-promise");

async function bloombergTest(url) {
  const options = {
    uri: url,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36",
      Referer: "https://www.google.com/"
    }
  };

  const html = await rp(options);
  console.log(html);
}

const url = "https://www.bloomberg.com/news/articles/2019-11-12/trump-says-phase-one-of-china-trade-deal-could-happen-soon?in_source=login_direct";
bloombergTest(url);
