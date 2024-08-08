const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({

    });
    const page = await browser.newPage();
    await page.goto('https://google.com'); 

    const elementSelector = '.lnXdpd'; 

    await page.waitForSelector(elementSelector, { timeout: 10000 });
    
    const element = await page.$(elementSelector);
    const boundingBox = await element.boundingBox();

    await page.screenshot({
        path: 'element-screenshot.png',
        clip: {
            x: boundingBox.x,
            y: boundingBox.y,
            width: boundingBox.width,
            height: boundingBox.height
        }
    });

    await browser.close();
})();
