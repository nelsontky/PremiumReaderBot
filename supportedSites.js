let sites = [
  "ft.com",
  "straitstimes.com",
  "wsj.com",
  "baltimoresun.com",
  "bostonglobe.com",
  "businessinsider.com",
  "businessinsider.sg",
  "chicagotribune.com",
  "economist.com",
  "latimes.com",
  "wired.com",
  "nytimes.com"
];

sites.sort((a, b) => a.localeCompare(b));

module.exports = sites;
