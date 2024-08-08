const puppeteer = require("puppeteer");
(async()=>{
        const browser = await puppeteer.launch({
            executablePath: 'D:\\Downloads\\chrome-win64\\chrome.exe'
        });
    const page = await browser.newPage();
    await page.goto("https://en.wikipedia.org/wiki/Main_Page");

    await page.screenshot({path:"screenshot.png",fullPage:true});
    await browser.close();
})();