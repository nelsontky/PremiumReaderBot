const $ = require("cheerio");
const axios = require("axios").default;
const headers = require("../secrets/headers.json").generic;
const postToTelegraph = require("../utils/postToTelegraph");

async function main(url) {
  const res = await axios.get(url, { headers });
  let html = res.data;
  const title = $("title", html).text();

  let domNode = $(".meteredContent.css-1r7ky0e", html)[0];

  if (domNode == undefined) {
    domNode = $("article", html)[0];
  }

  console.log(await postToTelegraph(title, domNode));
}

main(
  "https://www.nytimes.com/interactive/2019/08/14/magazine/slavery-capitalism.html?mtrref=www.google.com&assetType=REGIWALL"
);
