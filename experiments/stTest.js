const $ = require("cheerio");
const axios = require("axios").default;
const headers = require("../secrets/headers.json").st;
const postToTelegraph = require("../utils/postToTelegraph");

async function main(url) {
  const res = await axios.get(url, { headers });
  const html = res.data;
//   console.log(html)

  const title = $("title", html).text();
  const domNode = $("div[class='col-md-8 ']", html)[0];

  return await postToTelegraph(title, domNode);
}

main(
  "https://www.straitstimes.com/opinion/cooling-singapores-fixation-with-air-conditioning-in-its-buildings"
).then(link => console.log(link));
