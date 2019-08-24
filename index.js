require("dotenv").config();

const Telegraf = require("telegraf");
const queue = require("queue");
const puppeteer = require("puppeteer");
const urlTools = require("./utils/urlTools");
const googleSearchHandler = require("./siteHandler/googleSearchHandler");

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

    jobQueue.push(cb => {
      googleSearchHandler(url, ctx).then(() => cb());
    });
  }
});

bot.launch();
