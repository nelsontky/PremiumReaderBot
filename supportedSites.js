let sites = [
  "straitstimes.com",
  "wsj.com",
  "nytimes.com"
];

sites.sort((a, b) => a.localeCompare(b));

module.exports = sites;
