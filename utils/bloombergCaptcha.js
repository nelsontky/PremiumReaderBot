const puppeteer = require("puppeteer");

async function bloombergCaptcha() {
  const browser = await puppeteer.launch({
    headless: !true,
    defaultViewport: { height: 736, width: 414 },
    args: ["--no-sandbox"],
    userDataDir: "./bloomberg_data"
  });

  try {
    let page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
    );

    try {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.goto(
          "https://www.bloomberg.com/news/articles/2019-11-15/taiwan-halts-sale-of-huawei-phones-in-new-china-sovereignty-row?srnd=premium-asia"
        )
      ]);
    } catch (e) {}

  } catch (e) {
    console.log(e);
  }
}

bloombergCaptcha();
