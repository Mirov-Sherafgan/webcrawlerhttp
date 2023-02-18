function printReport(pages) {
  console.log("==========");
  console.log("REPORT");
  console.log("==========");
  const sortedPages = sortPages(pages);
  for (const page of sortedPages) {
    const url = page[0];
    const hits = page[1];

    console.log(`Found ${hits} links to page: ${url}`);
  }
  console.log("==========");
  console.log("END REPORT");
  console.log("==========");
}

function sortPages(pages) {
  const pagesArr = Object.entries(pages);
  pagesArr.sort((a, b) => {
    aHits = a[1];
    bHits = b[1];
    return b[1] - a[1];
  });

  return pagesArr;
}

module.exports = {
  sortPages,
  printReport,
};
