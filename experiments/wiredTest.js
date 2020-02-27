const $ = require("cheerio");
const axios = require("axios").default;
const headers = require("./headers.json").generic;
const postToTelegraph = require("./postToTelegraph");

async function main(url) {
  const res = await axios.get(url, { headers });
  const html = res.data;

  const title = $("title", html).text();
  const domNode = $(".article__chunks", html)[0];

  return await postToTelegraph(title, domNode);
}

main(
  "https://www.wired.com/story/when-ai-cant-replace-worker-watches-them-instead/"
).then(link => console.log(link));
