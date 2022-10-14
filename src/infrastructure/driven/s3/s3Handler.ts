import aws from "aws-sdk";
import { Env } from "../../../utils/constants";

export class S3Manager {

    s3: aws.S3;

    constructor() {
        this.s3 = new aws.S3({ region: Env.REGION });
    }

    /**
     * 
     */
    async putObject(params: aws.S3.PutObjectRequest) {
        console.log('params: ', params);
        const putObjectResponse = await this.s3.putObject(params).promise();
        console.log('putObjectResponse: ', putObjectResponse);
    }
}