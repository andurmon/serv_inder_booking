import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

import IPuppeterHandler from "./IPuppeteerHandler";
import { Env, ENTER, DocumentTypeCatalogAthletes } from "../../../utils/constants";
import { AthletesList, Cuenta } from "../../../domain/models/models";

export default class PuppeterHandler implements IPuppeterHandler {

    protected browser: puppeteer.Browser;
    protected page: puppeteer.Page;
    protected keyboard: puppeteer.Keyboard;

    /**
     * 
     */
    async initBrowser() {
        this.browser = await chromium.puppeteer.launch({
            args: [...chromium.args, `--window-size=1920,1080`],
            ignoreDefaultArgs: ['--disable-extensions'],
            defaultViewport: chromium.defaultViewport,
            executablePath: Env.STAGE === "local" ? Env.EXECUTABLE_PATH : await chromium.executablePath,
            headless: Env.HEADLESS,
            ignoreHTTPSErrors: true,
            // devtools: false
        });
        const pages = await this.browser.pages();
        this.page = pages[0];
        this.keyboard = this.page.keyboard;
        this.page.setDefaultTimeout(15000);
    }

    /**
     * 
     */
    async closeBrowser() {
        if (Env.STAGE != "local") this.browser.close();
    }

    /**
     * 
     * @returns 
     */
    async screenshot(): Promise<string | void | Buffer> {
        const pantallazo = await this.page.screenshot({ type: "jpeg" });
        console.log('pantallazo: ', pantallazo);
        return pantallazo;
    }

    /**
     * 
     * @param cuenta 
     */
    async login(cuenta: Cuenta) {
        try {
            await this.page.goto('https://simon.inder.gov.co/admin/login');

            await this.page.select('#tipo_documento', cuenta.docType);

            await this.page.click("#documento");
            await this.keyboard.type(cuenta.user);

            await this.page.click("#password");
            await this.keyboard.type(cuenta.pass);
            await this.keyboard.press(ENTER);

            await this.page.waitForNavigation();
        } catch (error) {
            throw new Error("Error during Login. " + error.message);
        }
    }

    async logout(): Promise<void> {
        await this.page.goto("https://simon.inder.gov.co/admin/logout");
    }

    /**
     * 
     * @param initDate 
     * @param initTime 
     * @returns 
     */
    async scenarioSelection(initDate: string, initTime: number) {
        console.log('time: ', initTime);
        console.log('date: ', initDate);
        try {
            await this.page.click("#boxPadding > div > div.btnVerTodos > a:nth-child(2) > button");
            await this.page.waitForSelector('#escenario_deportivo_barrio', { visible: true });

            await this.page.select('#escenario_deportivo_barrio', "461");


            await this.page.waitForTimeout(2000);
            await this.page.select('#escenario_deportivo', "509");

            await this.page.click("#reserva_seleccion_0");

            await this.page.waitForTimeout(2000);
            await this.page.select('#disciplina_escenario_deportivoreserva', "39");

            const fechaInicio = await this.page.waitForSelector('#fechaInicio');
            if (!fechaInicio) {
                throw new Error("Fecha de inicio no encontrado");
            }
            await fechaInicio.evaluate((el: HTMLInputElement, initDate: string) => {
                console.log('initDate: ', initDate);
                el.value = initDate
            }, initDate);


            await this.page.select('#reserva_jornada', "2");

            await this.page.waitForTimeout(2000);

            // Indicar horarios
            await this.page.click("#reserva_programaciones_5_inicioTarde");
            await this.keyboard.type(initTime.toString());
            await this.page.click("#reserva_programaciones_5_finTarde");
            await this.keyboard.type((initTime + 100).toString());

            await this.page.waitForTimeout(1000);
            await this.page.click("#formulario_reserva_paso1 > div > div:nth-child(2) > div.col-md-8.fondoAzul2 > div > div.col-xs-12.col-sm-12.col-md-12.uno.contenedorInfoUno > div.col-xs-12.col-sm-12.col-md-12.uno > div:nth-child(21) > div.col-xs-12.col-md-12.d-flex > a > button");

            await this.page.waitForTimeout(2000);
            const errorBanner = await this.waitForSelector("#swal2-content");
            console.log('errorBanner: ', errorBanner);

            if (errorBanner) {
                const valor = await errorBanner.evaluate((el: HTMLInputElement) => el.textContent);
                console.log('valor: ', valor);

                if (valor) {
                    if (valor === "No existen divisiones disponibles para el escenario deportivo seleccionado en las fechas ingresadas.") {
                        console.log("Paila, no hay reserva");
                    }
                    throw new Error(valor);
                }
                throw new Error("Error banner found");
            }
            await this.page.click("#btnguardar");
            await this.page.waitForNavigation();
        } catch (error) {
            console.log('error: ', error);
            throw new Error("Error during Scenario Selection. " + error.message);
        }
    }

    /**
     * 
     */
    async location() {
        try {
            await this.page.click("#reserva_divisiones_0");
            await this.page.click("#btnguardar");
            await this.page.waitForNavigation();
        } catch (error) {
            throw new Error("Error selecting Location. " + error.message);
        }
    }

    /**
     * 
     * @param athletesList 
     */
    async athletes(athletesList: Array<AthletesList>) {
        try {

            console.log('athletesList: ', athletesList);
            //#usuarios_division_reserva_type_divisiones_0_divisionReservas_1_tipoIdentificacion
            for (let i = 0; i < athletesList.length; i++) {
                await this.page.click("#usuarios_division_reserva_type_divisiones_0_divisionReservas > span.col-xs-12.col-md-12.text-center.collection-action.collection-rescue-add > a");
            }

            for (let i = 0; i < athletesList.length; i++) {
                const athlete = athletesList[i];
                await this.page.select(`#usuarios_division_reserva_type_divisiones_0_divisionReservas_${i + 1}_tipoIdentificacion`, DocumentTypeCatalogAthletes.getDocTypeAthl(athlete.docType));
                //

                await this.page.click(`#s2id_fake_usuarios_division_reserva_type_divisiones_0_divisionReservas_${i + 1}_numeroIdentificacion`);
                await this.keyboard.type(athlete.document);
                await this.page.waitForTimeout(500);
                await this.keyboard.press(ENTER);
            }

            await this.page.click("#btnguardar");
            await this.page.waitForTimeout(5000);
            // await this.page.waitForNavigation();
        } catch (error) {
            throw new Error("Error adding Athletes. " + error.message);
        }
    }

    /**
     * 
     */
    async termsAndConfirmation() {
        try {

            // Terms
            await this.page.click("#reserva_terminos_0");
            await this.page.click("#btnguardar");
            await this.page.waitForTimeout(5000);

            //Confirmation
            await this.page.click("#btnguardar");
            await this.page.waitForTimeout(5000);

            await this.page.click("#btnguardar");
            // await this.page.waitForNavigation();
        } catch (error) {
            throw new Error("Error accepting terms and conditions. " + error.message);
        }
    }

    /**
     * 
     * @param selector 
     * @returns 
     */
    protected async waitForSelector(selector: string): Promise<puppeteer.ElementHandle<Element> | null> {
        try {
            this.page.setDefaultTimeout(5000);
            const errorBanner = await this.page.waitForSelector(selector, { hidden: false });
            this.page.setDefaultTimeout(15000);
            return errorBanner;
        } catch (error) {
            console.log('error.message: ', error.message);
            this.page.setDefaultTimeout(15000);
            return null;
        }
    }
}