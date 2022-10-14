import { AthletesList, Cuenta } from "../../../domain/models/models";

export default interface IPuppeterHandler {

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
    login(cuenta: Cuenta): Promise<void>;

    /**
     * 
     */
    screenshot(): Promise<string | void | Buffer>

    /**
     * 
     */
    scenarioSelection(): Promise<void>;

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