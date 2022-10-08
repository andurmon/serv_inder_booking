import { ENTER, EXECUTABLE_PATH, HEADLESS, PUBLIC_BUCKET, PUBLIC_BUCKET_FOLDER, STAGE } from "../../../utils/constants";

import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

import IPuppeterHandler from "./IPuppeteerHandler";
import { Cuenta } from "../../../domain/models/models";
import { S3Manager } from "../s3/s3Handler";

const s3Manager = new S3Manager();

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
        this.browser = await chromium.puppeteer.launch({
            args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
            ignoreDefaultArgs: ['--disable-extensions'],
            defaultViewport: chromium.defaultViewport,
            executablePath: STAGE === "local" ? EXECUTABLE_PATH : await chromium.executablePath,
            headless: HEADLESS,
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
        if (STAGE != "local") this.browser.close();
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

        const pantallazo = await this.page.screenshot({ type: "jpeg" });
        console.log('pantallazo: ', pantallazo);

        await s3Manager.putObject({
            //@ts-ignore
            Body: pantallazo,
            Bucket: PUBLIC_BUCKET,
            Key: `${PUBLIC_BUCKET_FOLDER}/loginresult.jpeg`,
        })

    }

    /**
     * 
     */
    async scenarioSelection() {
        "#boxPadding > div > div.btnVerTodos > a:nth-child(2) > button"
    }

    /**
     * 
     */
    async location() {

    }

    /**
     * 
     */
    async athletes() {

    }

    /**
     * 
     */
    async termsAndConfirmation() {

    }
}