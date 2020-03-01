const axios = require("axios").default;
const token = require("../secrets/telegraphToken.json").token;

function domToNode(domNode, predicates) {
  if (
    domNode.name === "script" ||
    domNode.name === "aside" ||
    domNode.name === "style" ||
    domNode.type === "comment" ||
    predicates.reduce((a, pred) => pred(domNode) || a, false)
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
    nodeElement.children.push(domToNode(child, predicates));
  }

  return nodeElement;
}

async function postToTelegraph(title, domNode, predicates = []) {
  const params = new URLSearchParams();
  params.append("access_token", token);
  params.append("title", title);
  params.append("content", JSON.stringify([domToNode(domNode, predicates)]));

  const response = await axios.post(
    "https://api.telegra.ph/createPage",
    params
  );

  return response.data.result.url;
}

module.exports = postToTelegraph;
