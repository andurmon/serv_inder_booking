import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { JoiSchema } from "./domain/models/JoiSchema";

import PuppeterHandler from "./infrastructure/driven/PuppeteerHandler/PuppeteerHandler";
import InderBookingCaseUse from "./domain/InderBookingCaseUse";
import { S3Manager } from "./infrastructure/driven/s3/s3Handler";
import { responseAdapter } from "./infrastructure/driving/Adapter";
import { LogHandler } from "./utils/LogHandler";
import { LambdaManager } from "./infrastructure/driven/lambda/lambdaInvoke";

export const handler = async (event: APIGatewayProxyEvent, context?: Context): Promise<APIGatewayProxyResult> => {

    LogHandler.getInstance();

    try {

        LogHandler.requestMessage(event);

        if (context) LogHandler.anyMessage(context, "context", "")

        const body = (event.body ? JSON.parse(event.body) : undefined);

        if (!body) {
            const resp = { statusCode: 400, data: {}, message: "Body is null or undefined" }
            LogHandler.responseMessage(resp);
            return responseAdapter(resp);
        }

        const validation = JoiSchema.validateSchema(body);
        if (!validation.valid) {
            const resp = { statusCode: 400, message: validation.message, data: {} };
            LogHandler.responseMessage(resp);
            return responseAdapter(resp);
        }

        const s3Manager = new S3Manager();
        const puppeteerManager = new PuppeterHandler();
        const lambdaManager = new LambdaManager();
        const caseUse = new InderBookingCaseUse(puppeteerManager, s3Manager, lambdaManager);

        const caseUseResposne = await caseUse.caseUseExecute(body);
        LogHandler.responseMessage(caseUseResposne);
        return responseAdapter(caseUseResposne);

    } catch (error) {
        LogHandler.errorMessage(error.message, "Error in handler", error)
        return responseAdapter({
            statusCode: 500,
            data: {}
        });

    }

}