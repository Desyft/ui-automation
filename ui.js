import assert from "node:assert";
import qs from "qs";
import puppeteer from "puppeteer";

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const searchQuery = "Apply for a number plate";
    const baseUrl = "https://www.service.nsw.gov.au";

    await page.goto(baseUrl);
    // await page.waitForTimeout(5000);
    // await page.waitForSelector('input[aria-controls^="homeautosuggestDXr"]');

    // Set screen size
    await page.setViewport({ width: 1080, height: 1024 });

    // Type into search box
    await page.type('input[aria-controls^="homeautosuggestDXr"]', searchQuery);
    // await page.click('div[id="homeautosuggestDXr-hmpYxc4"]+div>button');
    await page.keyboard.press("Enter");
    const searchResults = await page.waitForSelector(".search__result");

    // Wait and click on first result
    const params = qs.stringify({ q: searchQuery }, { format: "RFC1738" });
    const searchUrl = `${baseUrl}/search-results?${params}`;

    console.log(page.url());
    console.log(searchUrl);
    console.log(searchResults);

    assert.equal(page.url(), searchUrl);
    await page.goto(baseUrl);
    await page.waitForSelector("text/Find Locations");
    await page.click("text/Find Locations");
    const searchElement = await page.waitForSelector("#locatorTextSearch");
    await searchElement.type("Sydney 2000");
    await page.keyboard.press("Enter");
    // const locationResults = await page.waitForSelector(".location__title");
    await page.waitForSelector("text/Marrickville Service Centre");

    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();
