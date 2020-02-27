const $ = require("cheerio");
const axios = require("axios").default;
const headers = require("./headers.json").generic;
const postToTelegraph = require("./postToTelegraph");

async function main(url) {
  const res = await axios.get(url, { headers });
  const html = res.data;

  const title = $("title", html).text();
  const domNode = $(".meteredContent.css-1r7ky0e", html)[0];

  return await postToTelegraph(title, domNode);
}

main(
  "https://www.nytimes.com/interactive/2020/02/27/opinion/which-democrat-should-I-vote-for.html?action=click&module=Opinion&pgtype=Homepage"
).then(link => console.log(link));
