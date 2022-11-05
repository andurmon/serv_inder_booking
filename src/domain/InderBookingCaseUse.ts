import IPuppeterHandler from "../infrastructure/driven/PuppeteerHandler/IPuppeteerHandler";
import { S3Manager } from "../infrastructure/driven/s3/s3Handler";
import { SnsManager } from "../infrastructure/driven/Sns/snsEmailPublisher";
import { Env } from "../utils/constants";
import { parseDate } from "../utils/dateParser";
import { CaseUseRequestModel, ResponsePackage } from "./models/models";


export default class InderBookingCaseUse {

    puppeteerManager: IPuppeterHandler
    s3Manager: S3Manager;

    constructor(puppeteerManager: IPuppeterHandler, s3Manager: S3Manager) {
        this.puppeteerManager = puppeteerManager;
        this.s3Manager = s3Manager;
    }

    async caseUseExecute(request: CaseUseRequestModel): Promise<ResponsePackage> {
        console.log('CaseUse request: ', request);
        try {
            let screenshots = [];
            const initDate = parseDate(request.initDate);

            //* 1. Init
            await this.puppeteerManager.initBrowser();

            for (let i = 0; i < request.userList.length; i++) {
                let cuenta = request.userList[i];
                const initTime = Number(request.initTime) + 100 * i;
                console.log('initTime: ', initTime);
                console.log('initDate: ', initDate);

                //* 2. Login
                await this.puppeteerManager.login(cuenta);

                //* 3. Scenario Selection
                await this.puppeteerManager.scenarioSelection(initDate, Number(request.initTime));

                // //* 4. Locations
                await this.puppeteerManager.location();

                // //* 5. Athletes
                await this.puppeteerManager.athletes(cuenta.guests);

                // //* 6. Terms and Conditions
                await this.puppeteerManager.termsAndConfirmation();

                //* 7. Screenshot
                const pantallazo = await this.puppeteerManager.screenshot();
                console.log('pantallazo: ', pantallazo);
                screenshots.push(pantallazo);

                //* 8. LogOut
                await this.puppeteerManager.logout();
            }

            //* 9. Close Browser
            await this.puppeteerManager.closeBrowser();

            //* 10. Save screenshots to S3 Bucket
            let urls = "";
            for (let i = 0; i < screenshots.length; i++) {
                const initTime = Number(request.initTime) + 100 * i;
                let screen = screenshots[i];
                let filename = `${Env.PUBLIC_BUCKET_FOLDER}/booking-${request.userList[i].user}-${initDate}-${initTime}.jpeg`;

                if (typeof screen === "object") {
                    const putObjResp = await this.s3Manager.putObject({
                        Body: screen,
                        Bucket: Env.PUBLIC_BUCKET,
                        Key: filename,
                    });
                    console.log('putObjResp: ', putObjResp);
                }
                urls += `\n - https://andurmon-dev-website-roar.s3.us-east-2.amazonaws.com/inder/${filename}`

            }

            //* 11. Send final notification
            const sns = new SnsManager();
            await sns.publishMessage(`Reserva exitosas: ` + urls)

            return {
                statusCode: 200,
                message: "Reserva Exitosa",
                data: {}
            }

        } catch (error) {
            return { statusCode: 500, message: error.message, data: {} }
        }
    }
}

