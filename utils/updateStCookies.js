const request = require("request");
const fs = require("fs");
const creds = require("../secrets/creds.json");
const headers = require("../secrets/headers.json");

const options = {
  method: "POST",
  url: `https://acc-auth.sphdigital.com/SPHAuth/rest/auth/new/authenticate?IDToken1=${creds.email}&IDToken2=${creds.password}&qry_str=&goto=https%3A%2F%2Facc-auth.sphdigital.com%2Famserver%2Fcdcservlet%3FTARGET%3Dhttps%3A%2F%2Fwww.straitstimes.com%3A443%2Fdummypost%2Fampostpreserve%3F8645c4ee-6da5-1f41-981a-ff0b6fbba061%26RequestID%3DA0C24ADF55C4EFF7DE287906E465FB911305E734E358DF2B753D20A0B8D6C8A5%26MajorVersion%3D1%26MinorVersion%3D0%26ProviderID%3Dhttps%3A%2F%2Fwww.straitstimes.com%3A443%2Famagent%26IssueInstant%3D2020-02-28T07%3A01%3A00Z&svc=st_online&g-recaptcha-response=`,
  headers: {
    Host: " acc-auth.sphdigital.com",
    "User-Agent":
      " Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:73.0) Gecko/20100101 Firefox/73.0",
    Accept:
      " text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Language": " en-US,en;q=0.5",
    "Accept-Encoding": " gzip, deflate, br",
    "Content-Type": " application/x-www-form-urlencoded",
    "Content-Length": " 515",
    Origin: " https://www.straitstimes.com",
    Connection: " keep-alive",
    Referer: " https://www.straitstimes.com/",
    "Upgrade-Insecure-Requests": " 1",
    TE: " Trailers",
    Pragma: " no-cache",
    "Cache-Control": " no-cache"
  },
  rejectUnauthorized: false
};

function getCookie() {
  return new Promise((resolve, reject) => {
    request(options, function(error, response) {
      const cookie = response.headers["set-cookie"].filter(x =>
        x.includes("SPHiPlanetDirectoryPro=")
      );

      if (cookie[0] == undefined) {
        reject(
          " Straits Times login error. Contact @nelsontky on telegram to fix."
        );
      }

      resolve("mySPHUserType=sub;" + cookie[0]);
    });
  });
}

async function updateHeaderFile() {
  headers.st.Cookie = await getCookie();
  fs.writeFileSync(
    __dirname + "/../secrets/headers.json",
    JSON.stringify(headers, null, 2)
  );
}

module.exports = updateHeaderFile;
