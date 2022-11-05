import log4js, { Level } from "log4js";
import { ResponsePackage } from "../domain/models/models";

export abstract class LogHandler {

    protected static Logger: log4js.Logger;
    protected static requestEvent: any;
    protected static response: ResponsePackage;

    /**
     * 
     * @param level 
     */
    static getInstance(level?: Level) {

        log4js.configure({
            appenders: { inder_users: { type: "console", layout: { type: "colored" } } },
            categories: {
                default: { appenders: ["inder_users"], level: "debug" }
            },
        });

        LogHandler.Logger = log4js.getLogger();
        LogHandler.Logger.level = level ?? "debug";

    }

    /**
     * 
     * @param event 
     */
    static requestMessage(event: any) {
        LogHandler.requestEvent = event;

        const log = {
            messageType: "requestMessage",
            event: LogHandler.requestEvent
        }

        LogHandler.Logger.info(JSON.stringify(log));

    }

    /**
     * 
     * @param response 
     */
    static responseMessage(response: ResponsePackage) {
        const log = {
            messageType: "responseMessage",
            request: LogHandler.requestEvent,
            response: response
        }

        LogHandler.Logger.info(JSON.stringify(log));

    }

    /**
     * 
     * @param request 
     * @param response 
     * @param message 
     * @param detail 
     */
    static integrationMessage(request: any, response: any, message: string, detail: string,) {

        const log = {
            messageType: "integrationMessage",
            loggingInfo: {
                message,
                detail,
            },
            request,
            response,
        }

        LogHandler.Logger.info(JSON.stringify(log));
    }

    /**
     * 
     * @param messageObject 
     * @param message 
     * @param detail 
     */
    static anyMessage(messageObject: any, message: string, detail: string) {
        const log = {
            messageType: "anyMessage",
            loggingInfo: {
                message,
                detail,
            },
            messageObject

        }
        LogHandler.Logger.trace(JSON.stringify(log));
        // LogHandler.Logger.debug(JSON.stringify(log));
    }

    /**
     * 
     * @param message 
     * @param detail 
     * @param errorObject 
     */
    static errorMessage(message: string, detail: string, errorObject?: any) {
        const log = {
            messageType: "errorMessage",
            loggingInfo: {
                message,
                detail,
            },
            errorObject
        }

        LogHandler.Logger.error(JSON.stringify(log));

    }

}