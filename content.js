import { connect } from "puppeteer-real-browser";
import df from "puppeteer-extra-plugin-click-and-wait";
// const { connect } = require("puppeteer-real-browser");

export async function getContent(url) {
  try {
    if (!url) return null;

    const { page, browser } = await connect({
      args: ["--start-maximized"],
      turnstile: true,
      headless: true,
      // disableXvfb: true,
      customConfig: {},
      connectOption: {
        defaultViewport: null,
      },
      plugins: [df()],
    });

    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    );
    // await page.mouse.move(Math.random() * 1000, Math.random() * 1000);
    // await page.mouse.click(Math.random() * 1000, Math.random() * 1000);

    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.clickAndWaitForNavigation("body");

    const pageSourceHTML = await page.content();

    await browser.close();

    return pageSourceHTML;
  } catch (e) {
    return `error get the content ${e.message} ${url}`;
  }
}
