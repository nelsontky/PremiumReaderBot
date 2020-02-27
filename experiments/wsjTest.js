const $ = require("cheerio");
const axios = require("axios").default;
const headers = require("./headers.json").generic;
const postToTelegraph = require("./postToTelegraph");

async function main(url) {
  const res = await axios.get(url, { headers });
  const html = res.data;

  const title = $("title", html).text();
  const domNode = $("div[amp-access = 'access']", html)[0];

  return await postToTelegraph(title, domNode);
}

main(
  "https://www.wsj.com/amp/articles/bernie-sanderss-plan-to-wipe-out-student-debt-faces-hurdles-11582799400"
).then(link => console.log(link));
