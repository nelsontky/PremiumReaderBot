const $ = require("cheerio");
const axios = require("axios").default;
const headers = require("../secrets/headers.json").st;
const postToTelegraph = require("../utils/postToTelegraph");

function isSocialMediaButtons(domNode) {
  return (
    domNode.attribs != undefined &&
    domNode.attribs.class != undefined &&
    domNode.attribs.class.includes("field-name-social-media-buttons")
  );
}

function isTimeStamp(domNode) {
  return (
    domNode.attribs != undefined && domNode.attribs.class === "story-postdate"
  );
}

function isAuthorName(domNode) {
  return (
    domNode.attribs != undefined &&
    (domNode.attribs.class === "author-field author-name" ||
      domNode.attribs.class === "author-field author-email")
  );
}

function domToNode(domNode) {
  if (
    domNode.name === "script" ||
    domNode.name === "aside" ||
    domNode.name === "style" ||
    domNode.type === "comment" ||
    isSocialMediaButtons(domNode) ||
    isTimeStamp(domNode) ||
    isAuthorName(domNode)
  ) {
    return "";
  }
  if (domNode.children == undefined) {
    return domNode.data.replace(/(\r\n|\n|\r|Advertisement)/gm, "");
  }

  let nodeElement = {};
  nodeElement.tag =
    domNode.name.toLowerCase() === "amp-img" // WSJ images
      ? "img"
      : domNode.name.toLowerCase();

  for (let attrib in domNode.attribs) {
    if (attrib == "src") {
      if (!nodeElement.attrs) {
        nodeElement.attrs = {};
      }
      nodeElement.attrs[attrib] = domNode.attribs[attrib];
    }
  }

  nodeElement.children = [];
  for (let child of domNode.children) {
    nodeElement.children.push(domToNode(child));
  }

  return nodeElement;
}

async function stHandler(url) {
  const res = await axios.get(url, { headers });
  const html = res.data;
  const title = $("title", html).text();
  const domNode = $("div[class='col-md-8 ']", html)[0];

  return await postToTelegraph(title, domNode, domToNode);
}

module.exports = stHandler;
