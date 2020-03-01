const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const supportedSites = require("./supportedSites");
const urlTools = require("./utils/urlTools");
const helpMessage = require("./utils/helpMessage");
const generateArticle = require("./generateArticle");
const botToken = require("./secrets/botToken.json").botToken;

const bot = new Telegraf(botToken);

function handleError(ctx, e) {
  ctx
    .replyWithMarkdown(
      `Error, please try again. \nDetails: \n\`\`\`${e}\`\`\``,
      Extra.inReplyTo(ctx.update.message.message_id)
    )
    .catch(e => handleBlocked(e));
  ctx.replyWithMarkdown(helpMessage);
}

function sendArticle(ctx, link) {
  ctx
    .replyWithMarkdown(`[Click on this link or press INSTANT VIEW](${link})`, {
      reply_to_message_id: ctx.update.message.message_id
    })
    .catch(e => handleError(ctx, e));
}

bot.command("start", ctx =>
  ctx.replyWithMarkdown(helpMessage).catch(e => handleError(ctx, e))
);
bot.command("help", ctx =>
  ctx.replyWithMarkdown(helpMessage).catch(e => handleError(ctx, e))
);

bot.hears(/\S+/, async ctx => {
  const url = ctx.match[0];

  if (!urlTools.isUrl(url)) {
    ctx
      .reply("Input is not a valid URL!")
      .then(() =>
        ctx.replyWithMarkdown(helpMessage).catch(e => handleError(ctx, e))
      );
  } else {
    const domain = urlTools.getDomain(url);

    if (!supportedSites.includes(domain)) {
      ctx
        .reply("Website not supported")
        .then(() =>
          ctx.replyWithMarkdown(helpMessage).catch(e => handleError(ctx, e))
        );
      return;
    }

    // Starts processing the job
    ctx
      .reply(
        "Wait a while ah loading... ...",
        Extra.inReplyTo(ctx.update.message.message_id)
      )
      .catch(e => handleError(ctx, e));

    switch (domain) {
      case "wsj.com":
        const ampUrl = "https://www.wsj.com/amp" + urlTools.getAfterDomain(url);
        generateArticle(ampUrl, domain)
          .then(link => sendArticle(ctx, link))
          .catch(e => handleError(ctx, e));
        break;

      default:
        generateArticle(url, domain)
          .then(link => sendArticle(ctx, link))
          .catch(e => handleError(ctx, e));
        break;
    }
  }
});

bot.drop(ctx => true);
bot.launch();
