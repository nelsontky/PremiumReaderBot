const regex = /(http|https):\/\/(www.)?([a-z-]+\.[a-z]*)(.*)+/;

module.exports.isUrl = text => regex.test(text);

module.exports.getDomain = url => {
  return regex.exec(url)[3];
}

module.exports.getAfterDomain = url => {
  return regex.exec(url)[4];
}
