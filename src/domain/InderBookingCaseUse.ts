import { LambdaManager } from "../infrastructure/driven/lambda/lambdaInvoke";
import IPuppeterHandler from "../infrastructure/driven/PuppeteerHandler/IPuppeteerHandler";
import { S3Manager } from "../infrastructure/driven/s3/s3Handler";
import { SnsManager } from "../infrastructure/driven/Sns/snsEmailPublisher";
import { Env } from "../utils/constants";
import { parseDate } from "../utils/dateParser";
import { LogHandler } from "../utils/LogHandler";
import { CaseUseRequestModel, IResponse, ResponsePackage } from "./models/models";


export default class InderBookingCaseUse {

    puppeteerManager: IPuppeterHandler
    s3Manager: S3Manager;
    lambdaManager: LambdaManager;
    snsManager: SnsManager;

    constructor(puppeteerManager: IPuppeterHandler, s3Manager: S3Manager, lambdaManager: LambdaManager, snsManager: SnsManager) {
        this.puppeteerManager = puppeteerManager;
        this.s3Manager = s3Manager;
        this.lambdaManager = lambdaManager;
        this.snsManager = snsManager;
    }

    async caseUseExecute(request: CaseUseRequestModel): Promise<ResponsePackage> {

        try {
            let bookingsList: IResponse[] = [];
            const initDate = request.initDate;

            //* 1. Init
            await this.puppeteerManager.initBrowser();

            for (let i = 0; i < request.userList.length; i++) {
                const account = request.userList[i];
                const initTime = Number(request.initTime) + 100 * i;
                console.log('initTime: ', initTime);

                //* 1. Create one booking
                const resu = await this.puppeteerManager.createOneBooking(account, initDate, initTime);
                LogHandler.anyMessage(resu, "result booking", `Booking result for user ${i}`);

                //* 2. Screenshot
                const pantallazo = await this.puppeteerManager.screenshot();

                //* 3. LogOut
                await this.puppeteerManager.logout();

                // if (resu.valid) {
                resu.screenshot = { document: account.user, screenshot: pantallazo };
                bookingsList.push(resu);

            }

            console.log('bookingsList: ', bookingsList);

            //* 9. Close Browser
            await this.puppeteerManager.closeBrowser();

            //* 10. Save screenshots to S3 Bucket
            let message = "";
            let urlsSucceded = "";
            let urlsError = "";
            for (let i = 0; i < bookingsList.length; i++) {
                let booking = bookingsList[i];
                let screen = booking.screenshot;
                if (!screen) continue;

                const date = parseDate(request.initDate, "")
                const initTime = Number(request.initTime) + 100 * i;

                let filename = `${Env.PUBLIC_BUCKET_FOLDER}/booking-${request.userList[i].user}-${date}-${initTime}.jpeg`;

                if (typeof screen.screenshot === "object") {
                    await this.s3Manager.putObject({
                        Body: screen.screenshot,
                        Bucket: Env.PUBLIC_BUCKET,
                        Key: filename,
                    });
                }
                if (booking.valid) {
                    urlsSucceded += `\n - https://andurmon-dev-website-roar.s3.us-east-2.amazonaws.com/inder/${filename}`
                    await this.lambdaManager.invokeFunction(Env.USERS_LAMBDA_NAME,
                        { document: screen.document, available: false }
                    );
                    continue;
                }
                urlsError += `\n - https://andurmon-dev-website-roar.s3.us-east-2.amazonaws.com/inder/${filename}`
            }

            message = "Reserva exitosas: " + urlsSucceded;

            let succ = bookingsList.find(e => e.valid);
            let err = bookingsList.find(e => e.valid === false);

            //* 11. Send final notification
            if (urlsError !== "") message += "\n Reservas fallidas:" + urlsError;
            await this.snsManager.publishMessage(message);

            if (err) {
                return {
                    statusCode: succ ? 207 : 500,
                    message: succ ? "Reserva Parcialmente Exitosa" : err.message,
                    data: {
                        reservas: bookingsList.map(booking => {
                            return {
                                valid: booking.valid,
                                step: booking.step,
                                message: booking.message,
                                detail: booking.detail,
                            }
                        })
                    }
                }
            }

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

