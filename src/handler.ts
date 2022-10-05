import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { ENTER, HEADLESS } from "./utils/constants";

import puppeteer from "puppeteer"

export const handler = async (event: APIGatewayProxyEvent, context: Context) => {
    console.log('context: ', context);
    console.log('event: ', event);

    const body = (event.body ? JSON.parse(event.body) : undefined);
    if (!body) {
        return;
    }
    const cuentaPrueba = body.cuentas[0];

    const browser = await puppeteer.launch({ headless: HEADLESS });
    const pages = await browser.pages();
    const page = pages[0];

    const keyboard = page.keyboard

    await page.goto('https://simon.inder.gov.co/admin/login');

    await page.select('#tipo_documento', cuentaPrueba.docType);

    await page.click("#documento");
    await keyboard.type(cuentaPrueba.user);

    await page.click("#password");
    await keyboard.type(cuentaPrueba.pass);
    await keyboard.press(ENTER);

    //  #boxPadding > div > div.btnVerTodos > a:nth-child(1) > button
    //  #boxPadding > div > div.btnVerTodos > a:nth-child(2) > button

    //await browser.close();


}