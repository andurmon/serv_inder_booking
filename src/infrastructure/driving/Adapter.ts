import { APIGatewayProxyResult } from "aws-lambda";
import { ResponsePackage } from "../../domain/models/models";

export function responseAdapter(response: ResponsePackage): APIGatewayProxyResult {
    return {
        body: JSON.stringify({ message: response?.message || "", data: response.data }),
        statusCode: response.statusCode,
        headers: { "Content-Type": "application/json" }
    }
}