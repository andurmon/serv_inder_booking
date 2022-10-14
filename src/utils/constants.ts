require("dotenv").config();

import { KeyInput } from "puppeteer-core";

export abstract class Env {
    static readonly HEADLESS: boolean = process?.env?.HEADLESS === "true" ? true : false;
    static readonly REGION: string = <string>process?.env?.REGION;
    static readonly PUBLIC_BUCKET: string = <string>process?.env?.PUBLIC_BUCKET;
    static readonly PUBLIC_BUCKET_FOLDER: string = <string>process?.env?.PUBLIC_BUCKET_FOLDER;
    static readonly STAGE: string = <string>process?.env?.STAGE;
    static readonly EXECUTABLE_PATH = "puppeteer/node_modules/puppeteer-core/.local-chromium/win64-1045629/chrome-win/chrome.exe"; //C:/Program Files (x86)/Google/Chrome/Application/chrome.exe
    static readonly TOPIC_ARN = <string>process.env.TOPIC_ARN;
}

//509 - CANCHA DE VOLEY PLAYA N. 1 DE LA UNIDAD DEPORTIVA ATANASIO GIRARDOT

export abstract class Selectors {

}

export class DocumentTypeCatalogAthletes {
    static getDocTypeAthl(key: "CC" | "TI" | "CE"): string {
        switch (key) {
            case "CC":
                return "6";
                break;
            case "TI":
                return "4";
                break;
            case "CE":
                return "7";
                break;
            default:
                return ""
                break;
        }
    }
}

export const ENTER: KeyInput = "Enter";