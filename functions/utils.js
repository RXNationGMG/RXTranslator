function getChannelIdFromMention(mention) {
  const matches = mention.match(/^<#(\d+)>$/);
  return matches ? matches[1] : null;
}

module.exports = {
  getChannelIdFromMention,
};