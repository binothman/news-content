import puppeteer from "puppeteer";

const SELECTORS = {
  "adengad.net": ".contnews",
  "h21.news": ".entry-content",
  "sedda.news": ".post-text",
  "3rd-eye.net": ".contnews",
  "almashhadalaraby.com": ".subject_font",
  "adnlng.info": "div[itemprop='description']",
  "aden-tm.net": ".contnews",
  "aden-alhadath.info": "div[itemprop='description']",
  "manbaraden.com": "div[itemprop='description']",
  "sabanew.net": "extract",
  "cratersky.net": "div[itemprop='description']",
  "shabwahalyoum.com": ".gr-element__content",
  "tarebhtoday.online": ".entry",
  "adenstc.com": ".gr-element__content",
  "yeniyemen.net": ".post--content",
  "alwfaqnews.net": "div[itemprop='articleBody']",
  "alyompress.com": ".entry-content .news",
  "almahrahpost.com": ".news-content",
  "almandeb.news": ".td-post-content",
  "aicaden.tv": ".paragraph-list",
  "deraalganoob.com": ".dear_description",
  "sadaalhakika.com": "div[itemprop='description']",
  "marebpress.net": ".details",
  "newsyemen.net": ".NewContents .mt-3.p-2",
  "wtn-news.com": "#subjectfont",
  "shabwaah-press.info": ".subject_font",
  "aljnoobpost.com": ".gr-element__content",
  "almawqeapost.net": ".description",
  "alsahil.net": ".post_details_block",
};

export async function getContent(url) {
  try {
    if (!url) return null;

    const link = new URL(url);
    const host = link.hostname.replace("www.", "");
    const selector = SELECTORS[host];
    if (!selector) return null;

    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu",
        "--ignore-certificate-errors",
      ],
    });
    const page = await browser.newPage();

    await page.goto(url);

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
