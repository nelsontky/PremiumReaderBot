const $ = require("cheerio");
const axios = require("axios").default;
const headers = require("../secrets/headers.json").generic;
const postToTelegraph = require("../utils/postToTelegraph");

async function nytimesHandler(url) {
  const res = await axios.get(url, { headers });
  const html = res.data;
  const title = $("title", html).text();

  let domNode = $(".meteredContent.css-1r7ky0e", html)[0];

  if (domNode == undefined) {
    domNode = $("article", html)[0];
  }

  return await postToTelegraph(title, domNode);
}

module.exports = nytimesHandler;