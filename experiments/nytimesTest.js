const $ = require("cheerio");
const rp = require("request-promise");

async function nytimesTest(url) {
  const options = {
    uri: url,
    headers: {
      "User-Agent": "Googlebot-News"
    },
    referrer:
      "https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=4&cad=rja&uact=8"
  };

  const html = await rp(options);
//   $("p", html).each((i, e) => console.log($(e).text()));
  const image = $("img.css-11cwn6f", html)[0].attribs.src;
  console.log(image);
}
const link = "https://www.nytimes.com/2019/11/11/nyregion/chuck-schumer-peter-king.html";
nytimesTest(link);
