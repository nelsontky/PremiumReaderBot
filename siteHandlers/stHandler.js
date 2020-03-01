const $ = require("cheerio");
const axios = require("axios").default;
const postToTelegraph = require("../utils/postToTelegraph");
const updateStCookies = require("../utils/updateStCookies");

let headers = require("../secrets/headers.json").st;

function isSocialMediaButtons(domNode) {
  return (
    domNode.attribs != undefined &&
    domNode.attribs.class != undefined &&
    domNode.attribs.class.includes("field-name-social-media-buttons")
  );
}

function isTimeStamp(domNode) {
  return (
    domNode.attribs != undefined &&
    (domNode.attribs.class === "story-postdate" ||
      domNode.attribs.class === "label-inline")
  );
}

function isAuthorDetails(domNode) {
  return (
    domNode.attribs != undefined &&
    domNode.attribs.class != undefined &&
    domNode.attribs.class.includes("author-")
  );
}

async function stHandler(url) {
  const res = await axios.get(url, { headers });
  let html = res.data;

  if (
    html.includes(
      `<h4 class="paywall-header">Enjoy unlimited access to ST's best work</h4>`
    )
  ) {
    await updateStCookies();
    headers = require("../secrets/headers.json").st;
    html = (await axios.get(url, { headers })).data;
  }

  const title = $("title", html).text();
  const domNode = $("div[class='col-md-8 ']", html)[0];

  return await postToTelegraph(title, domNode, [
    isSocialMediaButtons,
    isTimeStamp,
    isAuthorDetails
  ]);
}

module.exports = stHandler;
