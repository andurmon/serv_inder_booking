import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { JoiSchema } from "./domain/models/JoiSchema";

import PuppeterHandler from "./infrastructure/driven/PuppeteerHandler/PuppeteerHandler";
import InderBookingCaseUse from "./domain/InderBookingCaseUse";

export const handler = async (event: APIGatewayProxyEvent, context?: Context) => {
    if (context) {
        console.log('context: ', context);
    }

    const body = (event.body ? JSON.parse(event.body) : undefined);
    if (!body) {
        return;
    }

    const validation = JoiSchema.validateSchema(body);
    if (!validation.valid) {
        console.log('validation:ERROR ', validation);
        return;
    }
    const puppeteerManager = new PuppeterHandler();
    const caseUse = new InderBookingCaseUse(puppeteerManager);

    const caseUseResposne = await caseUse.caseUseExecute(body);
    console.log('caseUseResposne: ', caseUseResposne);
    return;

}