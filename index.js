require("dotenv").config();

const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const queue = require("queue");
const puppeteer = require("puppeteer");
const supportedSites = require("./supportedSites");
const urlTools = require("./utils/urlTools");
const helpMessage = require("./utils/helpMessage");

const duckDuckGoSearchHandler = require("./siteHandler/duckDuckGoSearchHandler");
const bingSearchHandler = require("./siteHandler/bingSearchHandler");
const straitsTimesHandler = require("./siteHandler/straitsTimesHandler");

const bot = new Telegraf(process.env.BOT_TOKEN);

function handleError(ctx, e) {
  ctx.replyWithMarkdown(
    `Error, please try again. \nDetails: \n\`\`\`${e}\`\`\``,
    Extra.inReplyTo(ctx.update.message.message_id)
  );
  ctx.reply(helpMessage);
}

function sendArticle(ctx) {
  ctx.replyWithDocument(
    { source: "article.pdf" },
    Extra.inReplyTo(ctx.update.message.message_id)
  );
}

// One task executes at once
let jobQueue = queue();
jobQueue.autostart = true;
jobQueue.concurrency = 1;

bot.command("start", ctx => ctx.reply(helpMessage));
bot.command("help", ctx => ctx.reply(helpMessage));

bot.hears(/read (.+)/, async ctx => {
  const url = ctx.match[1];

  if (!urlTools.isUrl(url)) {
    ctx.reply("Input is not a URL!");
    ctx.reply(helpMessage);
  } else {
    const domain = urlTools.getDomain(url);

    if (!supportedSites.includes(domain)) {
      ctx.reply("Website not supported");
      ctx.reply(helpMessage);
      return;
    }

    // Starts processing the job
    ctx.reply(
      "Wait a while ah loading... ...",
      Extra.inReplyTo(ctx.update.message.message_id)
    );

    switch (domain) {
      case "wsj.com":
        jobQueue.push(cb => {
          duckDuckGoSearchHandler(url, domain)
            .then(() => sendArticle(ctx))
            .then(() => cb())
            .catch(e => handleError(ctx, e));
        });
        break;

      case "ft.com":
        jobQueue.push(cb => {
          bingSearchHandler(url, domain)
            .then(() => sendArticle(ctx))
            .then(() => cb())
            .catch(e => handleError(ctx, e));
        });
        break;

      case "straitstimes.com":
        jobQueue.push(cb => {
          straitsTimesHandler(url)
            .then(() => sendArticle(ctx))
            .then(() => cb())
            .catch(e => handleError(ctx, e));
        });
        break;
    }
  }
});

bot.launch();
