require("dotenv").config();

const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const queue = require("queue");
const puppeteer = require("puppeteer");
const supportedSites = require("./supportedSites");
const urlTools = require("./utils/urlTools");
const helpMessage = require("./utils/helpMessage");
const googleSearchHandler = require("./siteHandler/googleSearchHandler");

const bot = new Telegraf(process.env.BOT_TOKEN);

// One task executes at once
let jobQueue = queue();
jobQueue.autostart = true;
jobQueue.concurrency = 1;

bot.command("help", ctx => ctx.reply(helpMessage));

bot.hears(/read (.+)/, async ctx => {
  const url = ctx.match[1];

  if (!urlTools.isUrl(url)) {
    ctx.reply("Input is not a URL!");
    ctx.reply(helpMessage);
  } else {
    const domain = urlTools.getDomain(url);

    if (!supportedSites.includes(domain)) {
      // Check if site is supported
      ctx.reply("Website not supported");
      ctx.reply(helpMessage);
      return;
    }

    ctx.reply(
      "Wait a while ah loading... ...",
      Extra.inReplyTo(ctx.update.message.message_id)
    );

    // Add job to queue
    jobQueue.push(cb => {
      googleSearchHandler(url, domain)
        .then(() =>
          ctx.replyWithDocument(
            { source: "article.pdf" },
            Extra.inReplyTo(ctx.update.message.message_id)
          )
        )
        .then(() => cb())
        .catch(e => {
          ctx.replyWithMarkdown(
            `Error, please try again. \nDetails: \n\`\`\`${e}\`\`\``,
            Extra.inReplyTo(ctx.update.message.message_id)
          );
          ctx.reply(helpMessage);
        });
    });
  }
});

bot.launch();
