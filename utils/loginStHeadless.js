const puppeteer = require("puppeteer");

const { email, password } = require("./stCreds");

const URL =
  "https://www.straitstimes.com/singapore/transport/lta-refunds-bicycle-sharing-operators-more-than-570000-in-bid-to-promote-active";

const LOGOUT_DROPDOWN = "#sph_user_name";
const LOGOUT_BUTTON =
  "#navbar > div > div.navbar-collapse.collapse.has-category-term > nav > div.block-user-menu > div > ul > li.nav-user.open > ul > li:nth-child(2) > a";
const LOGIN = "#sph_login";
const EMAIL_FIELD = "#IDToken1";
const PASSWORD_FIELD = "#IDToken2";
const LOGIN_BUTTON = "#btnLogin";

async function loginSt() {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { height: 720, width: 1280 },
    userDataDir: "./st_data"
  });

  try {
    let page = await browser.newPage();

    try {
      await Promise.all([
        page.waitForNavigation({ waitUntil: "networkidle2" }),
        page.goto(URL)
      ]);
    } catch (e) {
      console.log(e);
    }

    // Try to logout
    try {
      await page.click(LOGOUT_DROPDOWN);
      await page.click(LOGOUT_BUTTON);
      await page.waitForNavigation({ waitUntil: "networkidle2" });
    } catch (e) {
      console.log(e);
    }

    await page.click(LOGIN);
    await page.type(EMAIL_FIELD, email);
    await page.type(PASSWORD_FIELD, password);
    await page.click(LOGIN_BUTTON);
    await page.waitFor(3000);
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    console.log("LOGIN SUCCESSFUL");
  } catch (e) {
    console.log(e);
  } finally {
    browser.close();
  }
}

loginSt();
