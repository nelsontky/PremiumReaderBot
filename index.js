require("dotenv").config();

const Telegraf = require("telegraf");
const Extra = require("telegraf/extra");
const queue = require("queue");
const supportedSites = require("./supportedSites");
const urlTools = require("./utils/urlTools");
const helpMessage = require("./utils/helpMessage");

const {
  straitsTimesHandler,
  straitsTimesFromDb
} = require("./siteHandler/straitsTimesHandler");
const genericHandler = require("./siteHandler/genericHandler");

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

function sendArticle(ctx, link) {
  ctx
    .replyWithMarkdown(
      `[Click on this link or press INSTANT VIEW](${link})
      
[Open this link if top link and INSTANT VIEW does not load](https://ccb.wtf/miniProxy.php?${link})`,
      {
        reply_to_message_id: ctx.update.message.message_id
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
      case "straitstimes.com":
        straitsTimesFromDb(url)
          .then(obj => {
            if (obj.db[obj.heading] !== undefined) {
              // url exists in db
              sendArticle(ctx, obj.db[obj.heading]);
            } else {
              jobQueue.push(cb => {
                straitsTimesHandler(url, obj.db)
                  .then(link => sendArticle(ctx, link))
                  .then(() => cb())
                  .catch(e => handleError(ctx, e, cb));
              });
            }
          })
          .catch(e => handleError(ctx, e, () => null));
        break;

      default:
        genericHandler(url, domain)
          .then(link => sendArticle(ctx, link))
          .catch(e => handleError(ctx, e, () => null));
        break;
    }
  }
});

bot.drop(ctx => true);
bot.launch();
