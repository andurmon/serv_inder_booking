import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { JoiSchema } from "./domain/models/JoiSchema";

import PuppeterHandler from "./infrastructure/driven/PuppeteerHandler/PuppeteerHandler";
import InderBookingCaseUse from "./domain/InderBookingCaseUse";
import { S3Manager } from "./infrastructure/driven/s3/s3Handler";
import { responseAdapter } from "./infrastructure/driving/Adapter";

export const handler = async (event: APIGatewayProxyEvent, context?: Context): Promise<APIGatewayProxyResult> => {
    try {
        if (context) {
            console.log('context: ', context);
        }
        console.log('event: ', event);

        const body = (event.body ? JSON.parse(event.body) : undefined);
        console.log('body: ', body);
        if (!body) {
            return responseAdapter({
                statusCode: 400,
                data: {}
            });
        }

        const validation = JoiSchema.validateSchema(body);
        if (!validation.valid) {
            console.log('validation:ERROR ', validation);
            return responseAdapter({
                statusCode: 400, message: validation.message, data: {}
            });
        }
        const s3Manager = new S3Manager();
        const puppeteerManager = new PuppeterHandler();
        const caseUse = new InderBookingCaseUse(puppeteerManager, s3Manager);

        const caseUseResposne = await caseUse.caseUseExecute(body);
        return responseAdapter(caseUseResposne);

    } catch (error) {
        console.log('error: ', error);
        return responseAdapter({
            statusCode: 500,
            data: {}
        });

    }

}