import puppeteer from "puppeteer-extra";
import pluginStealth from "puppeteer-extra-plugin-stealth";
// import { executablePath } from "puppeteer";

export async function getHTML(url) {
  puppeteer.use(pluginStealth());
  const result = await puppeteer
    .launch({
      // defaultViewport: null,
      headless: true,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ["--enable-automation"],
      args: [
        "--kiosks",
        "--disable-accelerated-2d-canvas",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-canvas-aa",
        "--disable-2d-canvas-clip-aa",
        "--disable-gl-drawing-for-tests",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--use-gl=desktop",
        "--hide-scrollbars",
        "--mute-audio",
        "--no-first-run",
        "--disable-infobars",
        "--disable-breakpad",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-session-crashed-bubble",
        "--single-process",
        "--noerrdialogs",
        "--disabled-setupid-sandbox",
      ],
    })
    .then(async (browser) => {
      const page = await browser.newPage();

      const client = await page.target().createCDPSession();
      await client.send("Network.disable");

      await page.setRequestInterception(true);

      page.on("request", (request) => {
        if (
          request.resourceType() === "image" ||
          request.resourceType() === "stylesheet" ||
          request.resourceType() === "font" ||
          request.resourceType() === "texttrack" ||
          request.resourceType() === "imageset" ||
          request.resourceType() === "bacon" ||
          request.resourceType() === "csp_report" ||
          request.resourceType() === "object"
        ) {
          request.abort();
        } else {
          request.continue();
        }
      });

      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 0,
      });
      const html = await page.content();
      await browser.close();
      return html;
    });

  // console.log(` HTML: ${result}`);
  return result; // html
}

export async function getRSS(url) {
  puppeteer.use(pluginStealth());
  const result = await puppeteer
    .launch({
      // defaultViewport: null,
      headless: true,
      ignoreHTTPSErrors: true,
      ignoreDefaultArgs: ["--enable-automation"],
      args: [
        "--kiosks",
        "--disable-accelerated-2d-canvas",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-canvas-aa",
        "--disable-2d-canvas-clip-aa",
        "--disable-gl-drawing-for-tests",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--no-zygote",
        "--use-gl=desktop",
        "--hide-scrollbars",
        "--mute-audio",
        "--no-first-run",
        "--disable-infobars",
        "--disable-breakpad",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-session-crashed-bubble",
        "--single-process",
        "--noerrdialogs",
        "--disabled-setupid-sandbox",
      ],
    })
    .then(async (browser) => {
      const page = await browser.newPage();

      const client = await page.target().createCDPSession();
      await client.send("Network.disable");

      await page.setRequestInterception(true);

      page.on("request", (request) => {
        if (
          request.resourceType() === "image" ||
          request.resourceType() === "stylesheet" ||
          request.resourceType() === "font" ||
          request.resourceType() === "texttrack" ||
          request.resourceType() === "imageset" ||
          request.resourceType() === "bacon" ||
          request.resourceType() === "csp_report" ||
          request.resourceType() === "object"
        ) {
          request.abort();
        } else {
          request.continue();
        }
      });

      await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 0,
      });
      const data = await page.evaluate(
        () =>
          document.querySelector("rss")?.outerHTML ||
          document.querySelector("xml")?.outerHTML
      );
      await browser.close();
      return data;
    });

  // console.log(` HTML: ${result}`);
  return result; // html
}
