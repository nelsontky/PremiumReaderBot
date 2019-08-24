const regex = /(http|https):\/\/(www.)?(\S+\.[a-z]*)+/;

module.exports.isUrl = text => regex.test(text);

module.exports.getDomain = url => {
  regex.lastIndex = 0;
  return regex.exec(url)[3];
}
