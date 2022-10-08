require("dotenv").config();

import { KeyInput } from "puppeteer-core";

export const HEADLESS: boolean = process?.env?.HEADLESS === "true" ? true : false;
export const REGION: string = <string>process?.env?.REGION;
export const PUBLIC_BUCKET: string = <string>process?.env?.PUBLIC_BUCKET;
export const PUBLIC_BUCKET_FOLDER: string = <string>process?.env?.PUBLIC_BUCKET_FOLDER;

export const ENTER: KeyInput = "Enter";