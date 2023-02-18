const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }
  const normalizedCurrentURL = normalizeURL(currentURLObj);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;

  console.log(`actually crawling ${currentURL}`);
  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(
        `Error in fetch with status code: ${resp.status} on page: ${currentURL}`
      );
      return pages;
    }
    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `No html response, content-type: ${contentType} on page: ${currentURL}`
      );
      return pages;
    }

    const htmlBody = await resp.text();

    const nextURLs = getURLfromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (error) {
    console.log(`Error on fetch: ${error.message}, on page: ${currentURL}`);
  }
  return pages;
}

function getURLfromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const link of linkElements) {
    if (link.href.slice(0, 1) === "/") {
      // relative
      try {
        const urlObj = new URL(baseURL + link.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error with relative url: ${err.message}`);
      }
    } else {
      // absolute
      try {
        const urlObj = new URL(link.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error with absolute url: ${err.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL(url) {
  const urlObg = new URL(url);

  const hostPath = `${urlObg.hostname}${urlObg.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normalizeURL,
  getURLfromHTML,
  crawlPage,
};
