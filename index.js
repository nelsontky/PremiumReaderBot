require("dotenv").config();

const Telegraf = require("telegraf");
const queue = require("queue");
const puppeteer = require("puppeteer");
const urlTools = require("./utils/urlTools");

const bot = new Telegraf(process.env.BOT_TOKEN);

// One task executes at once
let jobQueue = queue();
jobQueue.autostart = true;
jobQueue.concurrency = 1;

bot.hears(/read (.+)/, async ctx => {
  const url = ctx.match[1];

  if (!urlTools.isUrl(url)) {
    // Add help msg
    ctx.reply("Input is not a URL!");
  } else {
    const domain = urlTools.getDomain(url);
    ctx.reply(domain);
  }
});

bot.command("test", ctx => {
  ctx.reply("Loading...");
  jobQueue.push(cb => {
    puppeteer.launch({ headless: false }).then(browser =>
      setTimeout(() => {
        browser.close();
        cb();
      }, 5000)
    );
  });
});

bot.launch();
