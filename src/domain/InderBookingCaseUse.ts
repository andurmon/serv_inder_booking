import IPuppeterHandler from "../infrastructure/driven/PuppeteerHandler/IPuppeteerHandler";
import { CaseUseRequestModel } from "./models/models";


export default class InderBookingCaseUse {

    puppeteerManager: IPuppeterHandler

    constructor(puppeteerManager: IPuppeterHandler) {
        this.puppeteerManager = puppeteerManager;
    }

    async caseUseExecute(request: CaseUseRequestModel) {

        const cuentaPrueba = request.cuentas[0];

        //* 1. Init
        await this.puppeteerManager.initBrowser();

        //* 2. Login
        await this.puppeteerManager.login(cuentaPrueba);

        //* 3. Close Browser
        await this.puppeteerManager.closeBrowser();
    }
}