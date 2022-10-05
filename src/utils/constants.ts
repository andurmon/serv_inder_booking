require("dotenv").config();

import { KeyInput } from "puppeteer";

export const HEADLESS: boolean = process?.env?.HEADLESS === "true" ? true : false;

export const ENTER: KeyInput = "Enter";