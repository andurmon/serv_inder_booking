import aws from "aws-sdk";
import { Env } from "../../../utils/constants";
import { LogHandler } from "../../../utils/LogHandler";

export class S3Manager {

    s3: aws.S3;

    constructor() {
        this.s3 = new aws.S3({ region: Env.REGION });
    }

    /**
     * 
     */
    async putObject(params: aws.S3.PutObjectRequest) {
        const putObjectResponse = await this.s3.putObject(params).promise();
        LogHandler.integrationMessage({ Bucket: params.Bucket, Key: params.Key }, putObjectResponse, "PutObject S3", "");
    }
}