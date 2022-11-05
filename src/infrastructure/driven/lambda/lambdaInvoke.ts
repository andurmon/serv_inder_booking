import aws from "aws-sdk";
import { ResponsePackage } from "../../../domain/models/models";
import { Env } from "../../../utils/constants";
import { LogHandler } from "../../../utils/LogHandler";

export class LambdaManager {

    lambda: aws.Lambda;

    constructor() {
        this.lambda = new aws.Lambda({ region: Env.REGION });
    }

    /**
     * 
     * @param lambdaName 
     * @param body 
     * @returns 
     */
    async invokeFunction(lambdaName: any, body: any): Promise<ResponsePackage> {
        try {

            const event = {
                httpMethod: "PUT",
                headers: { "Content-Type": "application/json" },
                queryStringParameters: null,
                pathParameters: null,
                body: JSON.stringify(body)
            };

            const params: aws.Lambda.InvocationRequest = {
                FunctionName: lambdaName, /* required */
                InvocationType: "RequestResponse",
                LogType: "None",
                Payload: JSON.stringify(event)
            }

            const invokeLambdaResponse = await this.lambda.invoke(params).promise();
            LogHandler.integrationMessage(params, invokeLambdaResponse, "Lambda response", `Lambda invoke for lambda: ${lambdaName}`);
            return { statusCode: 200, message: "", data: invokeLambdaResponse }

        } catch (error) {
            return { statusCode: 500, message: error.message, data: {} }
        }
    }
}