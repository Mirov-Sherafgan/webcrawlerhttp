function normalizeURL(url) {
  const urlObg = new URL(url);

  const hostPath = `${urlObg.hostname}${urlObg.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath
}

module.exports = {
  normalizeURL: normalizeURL,
};
