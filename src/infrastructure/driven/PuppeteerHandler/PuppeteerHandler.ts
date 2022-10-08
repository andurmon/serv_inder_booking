import { ENTER, HEADLESS } from "../../../utils/constants";

import puppeteer from "puppeteer";

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
        this.browser = await puppeteer.launch({ headless: HEADLESS });


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