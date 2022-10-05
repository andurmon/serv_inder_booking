import { Cuenta } from "../../../domain/models/models";

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

}