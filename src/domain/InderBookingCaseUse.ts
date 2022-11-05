import { LambdaManager } from "../infrastructure/driven/lambda/lambdaInvoke";
import IPuppeterHandler from "../infrastructure/driven/PuppeteerHandler/IPuppeteerHandler";
import { S3Manager } from "../infrastructure/driven/s3/s3Handler";
import { SnsManager } from "../infrastructure/driven/Sns/snsEmailPublisher";
import { Env } from "../utils/constants";
import { parseDate } from "../utils/dateParser";
import { BookingsList, CaseUseRequestModel, ResponsePackage } from "./models/models";


export default class InderBookingCaseUse {

    puppeteerManager: IPuppeterHandler
    s3Manager: S3Manager;
    lambdaManager: LambdaManager;

    constructor(puppeteerManager: IPuppeterHandler, s3Manager: S3Manager, lambdaManager: LambdaManager) {
        this.puppeteerManager = puppeteerManager;
        this.s3Manager = s3Manager;
        this.lambdaManager = lambdaManager;
    }

    async caseUseExecute(request: CaseUseRequestModel): Promise<ResponsePackage> {

        try {
            let screenshotsList: BookingsList[] = [];
            const initDate = parseDate(request.initDate);

            //* 1. Init
            await this.puppeteerManager.initBrowser();

            for (let i = 0; i < request.userList.length; i++) {
                let cuenta = request.userList[i];
                const initTime = Number(request.initTime) + 100 * i;
                console.log('initTime: ', initTime);
                // console.log('initDate: ', initDate);

                //* 2. Login
                await this.puppeteerManager.login(cuenta);

                //* 3. Scenario Selection
                await this.puppeteerManager.scenarioSelection(initDate, initTime);

                // //* 4. Locations
                await this.puppeteerManager.location();

                // //* 5. Athletes
                await this.puppeteerManager.athletes(cuenta.guests);

                // //* 6. Terms and Conditions
                await this.puppeteerManager.termsAndConfirmation();

                //* 7. Screenshot
                const pantallazo = await this.puppeteerManager.screenshot();
                screenshotsList.push({ valid: true, document: cuenta.user, screenshot: pantallazo });

                //* 8. LogOut
                await this.puppeteerManager.logout();
            }

            //* 9. Close Browser
            await this.puppeteerManager.closeBrowser();

            //* 10. Save screenshots to S3 Bucket
            let urls = "";
            for (let i = 0; i < screenshotsList.length; i++) {
                const initTime = Number(request.initTime) + 100 * i;
                let screen = screenshotsList[i];
                let filename = `${Env.PUBLIC_BUCKET_FOLDER}/booking-${request.userList[i].user}-${initDate}-${initTime}.jpeg`;

                if (typeof screen.screenshot === "object" && screen.valid) {
                    await this.s3Manager.putObject({
                        Body: screen.screenshot,
                        Bucket: Env.PUBLIC_BUCKET,
                        Key: filename,
                    });
                    await this.lambdaManager.invokeFunction(Env.USERS_LAMBDA_NAME,
                        { document: screen.document, available: true }
                    );
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

