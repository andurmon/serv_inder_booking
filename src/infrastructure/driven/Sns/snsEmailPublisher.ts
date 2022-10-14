import aws from "aws-sdk";
import { Env } from "../../../utils/constants";

export class SnsManager {

    sns: aws.SNS;

    constructor() {
        this.sns = new aws.SNS({ region: Env.REGION });
    }

    /**
     * 
     * @param message 
     * @returns 
     */
    async publishMessage(message: string) {
        const params: aws.SNS.PublishInput = {
            Message: message,
            TopicArn: Env.TOPIC_ARN
        }
        const publishEmail = await this.sns.publish(params).promise();
        console.log('publishEmail: ', publishEmail);
        return publishEmail;
    }
}