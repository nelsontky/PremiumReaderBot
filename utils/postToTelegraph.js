const request = require("request-promise");
const id = require("./telegraphAccess");

async function postToTelegraph(title, body, image) {
  try {
    const result = await request({
      uri: `https://api.telegra.ph/createPage`,
      json: true,
      method: "POST",
      headers: { "content-type": "application/json" },
      body: {
        access_token: id,
        title: title,
        author_name: "Anonymous",
        content: [
          { tag: "img", attrs: { src: image } },
          { tag: "div", children: [body] }
        ],
        return_content: true
      }
    });

    return result.result.url;
  } catch (e) {
    throw e;
  }
}

module.exports = postToTelegraph;
