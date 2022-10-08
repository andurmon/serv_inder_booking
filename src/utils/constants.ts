require("dotenv").config();

import { KeyInput } from "puppeteer-core";

export const HEADLESS: boolean = process?.env?.HEADLESS === "true" ? true : false;
export const REGION: string = <string>process?.env?.REGION;
export const PUBLIC_BUCKET: string = <string>process?.env?.PUBLIC_BUCKET;
export const PUBLIC_BUCKET_FOLDER: string = <string>process?.env?.PUBLIC_BUCKET_FOLDER;
export const STAGE: string = <string>process?.env?.STAGE;
export const EXECUTABLE_PATH = "puppeteer/node_modules/puppeteer-core/.local-chromium/win64-1045629/chrome-win/chrome.exe"; //C:/Program Files (x86)/Google/Chrome/Application/chrome.exe

export const ENTER: KeyInput = "Enter";