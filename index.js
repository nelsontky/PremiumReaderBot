require("dotenv").config();

const Telegraf = require("telegraf");
const { drop } = require('telegraf')
const Extra = require("telegraf/extra");
const queue = require("queue");
const puppeteer = require("puppeteer");
const supportedSites = require("./supportedSites");
const urlTools = require("./utils/urlTools");
const helpMessage = require("./utils/helpMessage");

const duckDuckGoSearchHandler = require("./siteHandler/duckDuckGoSearchHandler");
const bingSearchHandler = require("./siteHandler/bingSearchHandler");
const straitsTimesHandler = require("./siteHandler/straitsTimesHandler");
const incognitoHandler = require("./siteHandler/incognitoHandler");

const bot = new Telegraf(process.env.BOT_TOKEN);

function handleError(ctx, e, cb) {
  ctx
    .replyWithMarkdown(
      `Error, please try again. \nDetails: \n\`\`\`${e}\`\`\``,
      Extra.inReplyTo(ctx.update.message.message_id)
    )
    .catch(() => handleBlocked());
  ctx.replyWithMarkdown(helpMessage).catch(() => handleBlocked());
  cb();
}

function sendArticle(ctx) {
  ctx
    .replyWithDocument(
      { source: "article.pdf" },
      {
        reply_to_message_id: ctx.update.message.message_id,
        caption: "Open this PDF"
      }
    )
    .catch(() => handleBlocked());
}

function handleBlocked() {
  console.log("Blocked by user");
}

// One task executes at once
let jobQueue = queue();
jobQueue.autostart = true;
jobQueue.concurrency = 1;

bot.command("start", ctx =>
  ctx.replyWithMarkdown(helpMessage).catch(() => handleBlocked())
);
bot.command("help", ctx =>
  ctx.replyWithMarkdown(helpMessage).catch(() => handleBlocked())
);

bot.hears(/\S+/, async ctx => {
  const url = ctx.match[0];

  if (!urlTools.isUrl(url)) {
    ctx
      .reply("Input is not a valid URL!")
      .then(() =>
        ctx.replyWithMarkdown(helpMessage).catch(() => handleBlocked())
      );
  } else {
    const domain = urlTools.getDomain(url);

    if (!supportedSites.includes(domain)) {
      ctx
        .reply("Website not supported")
        .then(() =>
          ctx.replyWithMarkdown(helpMessage).catch(() => handleBlocked())
        );
      return;
    }

    // Starts processing the job
    ctx
      .reply(
        "Wait a while ah loading... ...",
        Extra.inReplyTo(ctx.update.message.message_id)
      )
      .catch(e => handleBlocked());

    switch (domain) {
      case "wsj.com":
        jobQueue.push(cb => {
          duckDuckGoSearchHandler(url, domain)
            .then(() => sendArticle(ctx))
            .then(() => cb())
            .catch(e => handleError(ctx, e, cb));
        });
        break;

      case "ft.com":
        jobQueue.push(cb => {
          bingSearchHandler(url, domain)
            .then(() => sendArticle(ctx))
            .then(() => cb())
            .catch(e => handleError(ctx, e, cb));
        });
        break;

      case "straitstimes.com":
        jobQueue.push(cb => {
          straitsTimesHandler(url)
            .then(() => sendArticle(ctx))
            .then(() => cb())
            .catch(e => handleError(ctx, e, cb));
        });
        break;

      default:
        jobQueue.push(cb => {
          incognitoHandler(url, domain)
            .then(() => sendArticle(ctx))
            .then(() => cb())
            .catch(e => handleError(ctx, e, cb));
        });
        break;
    }
  }
});

bot.drop((ctx) => true);
bot.launch();
