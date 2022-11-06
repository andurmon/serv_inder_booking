import { AthletesList, Account, IResponse } from "../../../domain/models/models";

export default interface IPuppeterHandler {

    /**
     * 
     * @param cuenta 
     * @param initDate 
     * @param initTime 
     */
    createOneBooking(cuenta: Account, initDate: string, initTime: number): Promise<IResponse>;

    /**
     * 
     */
    initBrowser(): Promise<void>;

    /**
     * 
     */
    closeBrowser(): Promise<void>;

    /**
     * 
     * @param cuenta 
     */
    login(cuenta: Account): Promise<void>;

    /**
     * 
     * @param cuenta 
     */
    logout(): Promise<void>;

    /**
     * 
     */
    screenshot(): Promise<string | void | Buffer>

    /**
     * 
     */
    scenarioSelection(initDate: string, initTime: number): Promise<void>;

    /**
     * 
     */
    location(): Promise<void>;

    /**
     * 
     */
    athletes(athletesList: Array<AthletesList>): Promise<void>;

    /**
     * 
     */
    termsAndConfirmation(): Promise<void>;

}