const puppeteer = require('puppeteer');
// const express = require('express')

const dom = async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://webscraper.io/test-sites/e-commerce/allinone/computers/laptops');

    const links = await page.$$eval('.title', (el) => el.map((link)  => {
        if (link.title.includes('Lenovo')) return link.href
    }
    ).filter((i) => i))

    const arr = [];
    let counter = 0
    for (const link of links) {
        await page.goto(link)
        await page.waitForSelector('.description')
        const title = await page.$eval('.description', (el) => el.previousElementSibling.innerHTML)
        const description = await page.$eval('.description', (el) => el.innerHTML)
        const price = await page.$eval('.price', (el) => el.innerHTML)
        const storage = await page.$$eval('.swatch', (el) => el.map((btn) => {
            if (!btn.classList.value.includes('disabled')) {
                return btn.value
            }
        }).filter((i) => i))
        const reviews = await page.$eval('.ratings', (el) => el.children[0].innerText)
        const stars = (await page.$$eval('.glyphicon', (el) => el.map((stars) => stars))).length
        const infos = {
            id: counter += 1,
            title,
            description,
            price,
            storage,
            reviews,
            stars
        }
        arr.push(infos)
    }
    page.close()
return arr
};
module.exports = dom
