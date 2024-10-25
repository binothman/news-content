import puppeteer from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
import { executablePath } from "puppeteer";

export async function getHtmlThoughCloudflare(url) {
  puppeteer.use(pluginStealth());
  const result = await puppeteer
    .launch({ headless: true })
    .then(async (browser) => {
      const page = await browser.newPage();
      await page.goto(url);
      const html = await page.content();
      await browser.close();
      return html;
    });

  // console.log(` HTML: ${result}`);
  return result; // html
}
