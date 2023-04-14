import assert from "node:assert";
import qs from "qs";
import puppeteer from "puppeteer";

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const searchQuery = "Apply for a number plate";
    const locQuery = {
      query: "Sydney Domestic Airport 2020",
      result: "Marrickville Service Centre",
    };
    const baseUrl = "https://www.service.nsw.gov.au";

    await page.goto(baseUrl);
    // await page.waitForTimeout(5000);
    // await page.waitForSelector('input[aria-controls^="homeautosuggestDXr"]');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // Type into search box
    const searchElement = await page.waitForSelector(
      'input[aria-controls^="homeautosuggestKcpXb"]'
    );
    await searchElement.type(searchQuery);
    // await page.click('div[id="homeautosuggestDXr-hmpYxc4"]+div>button');
    await page.keyboard.press("Enter");
    const searchResults = await page.waitForSelector(".search__result");

    // Wait and click on first result
    const params = qs.stringify({ q: searchQuery }, { format: "RFC1738" });
    const searchUrl = `${baseUrl}/search-results?${params}`;

    console.log("actual URL: ",page.url());
    console.log("expected URL: ",searchUrl);

    assert.equal(page.url(), searchUrl);
    await page.goto(baseUrl);
    await page.waitForSelector("text/Find locations");
    await page.click("text/Find locations");
    const locationElement = await page.waitForSelector("#locatorTextSearch");
    await locationElement.type(locQuery.query);
    await page.keyboard.press("Enter");
    // const locationResults = await page.waitForSelector(".location__title");
    await page.waitForSelector(`text/${locQuery.result}`);

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
