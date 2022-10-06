import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { JoiSchema } from "./domain/models/JoiSchema";

import PuppeterHandler from "./infrastructure/driven/PuppeteerHandler/PuppeteerHandler";
import InderBookingCaseUse from "./domain/InderBookingCaseUse";
import { ResponsePackage } from "./domain/models/models";

export const handler = async (event: APIGatewayProxyEvent, context?: Context): Promise<ResponsePackage> => {
    try {
        if (context) {
            console.log('context: ', context);
        }

        const body = (event.body ? JSON.parse(event.body) : undefined);
        if (!body) {
            return {
                statusCode: 400,
                data: {}
            };
        }

        const validation = JoiSchema.validateSchema(body);
        if (!validation.valid) {
            console.log('validation:ERROR ', validation);
            return {
                statusCode: 400, data: {}
            };
        }
        const puppeteerManager = new PuppeterHandler();
        const caseUse = new InderBookingCaseUse(puppeteerManager);

        const caseUseResposne = await caseUse.caseUseExecute(body);
        return {
            statusCode: 200,
            data: caseUseResposne
        };

    } catch (error) {
        console.log('error: ', error);
        return {
            statusCode: 500,
            data: {}
        };

    }

}