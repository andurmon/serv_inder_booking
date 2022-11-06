export interface Account {
    user: string;
    pass: string;
    docType: "CC" | "TI" | "CE";
    guests: AthletesList[]
}

export interface CaseUseRequestModel {
    userList: Account[];
    initTime: string;
    initDate: string;
}

export interface ResponsePackage {
    statusCode: number;
    message?: string;
    data: any
}

export interface AthletesList {
    document: string;
    docType: "CC" | "TI" | "CE";
}

export interface BookingsList {
    valid: boolean;
    document: string;
    screenshot: string | void | Buffer
}
export interface ScreenShot {
    document: string;
    screenshot: string | void | Buffer
}

export interface IResponse {
    valid: boolean;
    step: number;
    message: string;
    detail?: string;
    screenshot?: ScreenShot
}