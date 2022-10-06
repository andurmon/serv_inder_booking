import { ENTER } from "../../../utils/constants";

import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

import * as fs from "fs";
import IPuppeterHandler from "./IPuppeteerHandler";
import { Cuenta } from "../../../domain/models/models";

export default class PuppeterHandler implements IPuppeterHandler {

    protected browser: puppeteer.Browser;
    protected page: puppeteer.Page;
    protected keyboard: puppeteer.Keyboard;

    /**
     * 
     */
    async initBrowser() {
        // this.browser = await puppeteer.launch({ headless: HEADLESS });
        console.log('await chromium.executablePath: ', await chromium.executablePath);
        console.log('chromium.args: ', chromium.args);
        this.browser = await chromium.puppeteer.launch({
            args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
            ignoreDefaultArgs: ['--disable-extensions'],
            defaultViewport: chromium.defaultViewport,
            executablePath: (await chromium.executablePath) ?? "node_modules/chrome-aws-lambda/bin/chromium.br",
            headless: chromium.headless,
            ignoreHTTPSErrors: true,
        });

        const pages = await this.browser.pages();
        this.page = pages[0];
        this.keyboard = this.page.keyboard;
    }

    /**
     * 
     */
    async closeBrowser() {
        this.browser.close();
    }

    /**
     * 
     * @param cuenta 
     */
    async login(cuenta: Cuenta) {

        await this.page.goto('https://simon.inder.gov.co/admin/login');

        await this.page.select('#tipo_documento', cuenta.docType);

        await this.page.click("#documento");
        await this.keyboard.type(cuenta.user);

        await this.page.click("#password");
        await this.keyboard.type(cuenta.pass);
        await this.keyboard.press(ENTER);

        await this.page.waitForNavigation();

        const pantallazo = await this.page.screenshot();

        fs.writeFileSync("outputs/screenshot.png", pantallazo);
        console.log('pantallazo: ', pantallazo);

    }

}