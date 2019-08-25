const supportedSites = require("../supportedSites");

module.exports = `Read premium articles for free!
Usage: /read <insert URL here>
URL has to start with http:// or https://

Supported sites:
${supportedSites.reduce((a, i) => a + i + "\n", "")}
To show this menu again, send /help
Source code: https://github.com/nelsontky/PremiumReaderBot
`;
