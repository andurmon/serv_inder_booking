
import { SNSClient } from "@aws-sdk/client-sns";
import { Env } from "../../../utils/constants";

const snsClient = new SNSClient({ region: Env.REGION });
export { snsClient };

