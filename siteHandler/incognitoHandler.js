const puppeteer = require("puppeteer");

async function incognitoHandler(url, domain) {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { height: 736, width: 414 },
    args: ["--no-sandbox"]
  });

  const page = await browser.newPage();

  try {
    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );

    // Set JavaScript on for sites that need it
    switch (domain) {
      case "washingtonpost.com":
        break;

      default:
        await page.setJavaScriptEnabled(false);
        break;
    }

    await page.goto(`${url}`);
    await page.waitFor("title");
    await page.waitFor(1000);

    // Domain specific hacks
    if (domain === "baltimoresun.com") {
      // Removes ad bar
      await page.evaluate(sel => {
        let elements = document.querySelectorAll(sel);
        for (let i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, ".trb_ad_st_m");
    } else if (domain === "washingtonpost.com") {
      // Remove top bar
      await page.evaluate(sel => {
        let topBar = document.querySelector(sel);
        topBar.parentNode.removeChild(topBar);
      }, "#wp-header");

      await page.waitForSelector("body > div:nth-child(20)");
      // Remove ad bar
      await page.evaluate(sel => {
        let elements = document.querySelectorAll(sel);
        for (let i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, "body > div:nth-child(20)");
    } else if (domain === "bostonglobe.com") {
      // Remove top bar
      await page.evaluate(sel => {
        let topBar = document.querySelector(sel);
        topBar.parentNode.removeChild(topBar);
      }, "#app-bar");
    } else if (domain === "chicagotribune.com") {
      // Removes ad bar
      await page.evaluate(sel => {
        let elements = document.querySelectorAll(sel);
        for (let i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, ".pb-ad");
    } else if (domain === "economist.com") {
      // Remove top bar
      await page.evaluate(sel => {
        let elements = document.querySelectorAll(sel);
        for (let i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, ".sticky-outer-wrapper");

      await page.evaluate(sel => {
        let elements = document.querySelectorAll(sel);
        for (let i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, ".inhouse__subscription-ribbon");
    } else if (domain === "latimes.com") {
      // Remove top bar
      await page.evaluate(sel => {
        let elements = document.querySelectorAll(sel);
        for (let i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, ".Page-header");
    } else if (domain === "wired.com") {
      // Remove top bar
      await page.evaluate(sel => {
        let elements = document.querySelectorAll(sel);
        for (let i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, ".header");
    }

    await page.emulateMedia("screen");

    await page.pdf({ path: "article.pdf", width: 414, height: 736 });
    browser.close();
  } catch (e) {
    await page.pdf({ path: "error.pdf", width: 414, height: 736 });
    browser.close();
    throw e;
  }
}

module.exports = incognitoHandler;
