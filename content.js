import puppeteer from "puppeteer-core";

const executablePath =
  process.env.EXECUTABLE_PATH ||
  "/opt/render/project/src/.cache/puppeteer/chrome/linux-125.0.6422.78/chrome-linux64/chrome";

export async function getContent(url) {
  try {
    if (!url) return null;

    const browser = await puppeteer.launch({
      // executablePath,
      defaultViewport: null,
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
    });

    const [page] = await browser.pages();

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

    await page.setViewport({ width: 1920, height: 1080 });

    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });

    await page.mouse.move(Math.random() * 1000, Math.random() * 1000);
    await page.mouse.click(Math.random() * 1000, Math.random() * 1000);

    const data = await page.evaluate(
      () => document.querySelector("*").innerHTML
    );

    await page.close();
    await browser.close();

    return data;
    // const page = await browser.newPage();

    // await page.setViewport({ width: 1920, height: 1080 });
    // await page.setUserAgent(
    //   "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
    // );
    // await page.mouse.move(Math.random() * 1000, Math.random() * 1000);
    // await page.mouse.click(Math.random() * 1000, Math.random() * 1000);

    // await page.goto(url);

    // const pageSourceHTML = await page.content();
    // // const e = await page.content();

    // // Closing the browser
    // await browser.close();

    // return pageSourceHTML;
    return await page.evaluate((el) => el.innerHTML, e);
    // Getting the element with ID 'unique-element'
    const element = await page.$(selector);
    let value = "";

    if (element) {
      value = await page.evaluate((el) => el.innerText, element);
    }
    // Performing actions on the element
    await browser.close();

    // return value.replace(new RegExp("<a.*?>", "g"), "");
    return value
      .replace(/(\r\n|\r|\n){2}/g, "$1")
      .replace(/(\r\n|\r|\n){3,}/g, "$1\n")
      .replace(/\r/g, "")
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")

      .replace(/\n/g, "<br>");
  } catch (e) {
    return `error get the content ${e.message} ${url}`;
  }
}
