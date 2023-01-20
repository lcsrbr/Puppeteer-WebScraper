const puppeteer = require('puppeteer');
// const express = require('express')

const dom = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops');

    const links = await page.$$eval('.title', (el) => el.map((link)  => {
        if (link.title.includes('Lenovo')) return link.href
    }).filter((i) => i))

    const arr = [];
    let counter = 0
    for (const link of links) {
        await page.goto(link)
        await page.waitForSelector('.description')
        const infos = {
            id: counter += 1,
            title: await page.$eval('.description', (el) => el.previousElementSibling.innerHTML),
            description:  await page.$eval('.description', (el) => el.innerHTML),
            priceUSD: (await page.$eval('.price', (el) => el.innerHTML)).substring(1),
            storage: await page.$$eval('.swatch', (el) => el.map((btn) => {
                if (!btn.classList.value.includes('disabled')) {
                    return btn.value
                }
            }).filter((i) => i)),
            reviews:  (await page.$eval('.ratings', (el) => el.children[0].innerText)).trim(),
            stars:  (await page.$$eval('.glyphicon', (el) => el.map((stars) => stars))).length
        }
        arr.push(infos)
    }
        arr.sort((a, b) => {
            return a.priceUSD - b.priceUSD
        })
    page.close()
return arr
};
module.exports = dom
