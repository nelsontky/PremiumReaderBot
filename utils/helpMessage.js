const supportedSites = require("../supportedSites");

module.exports = `Read premium articles for free!
*Usage: Just send your article link (only the article link, nothing else) directly to the bot!*
URL has to start with http:// or https://

Supported sites:
${supportedSites.reduce((a, i) => a + i + "\n", "")}
To show this menu again, send /help

Source code: https://github.com/nelsontky/PremiumReaderBot
Report issues: https://github.com/nelsontky/PremiumReaderBot/issues/new
`;
