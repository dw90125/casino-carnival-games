import { IBasicConfig } from "./ibasicconfig.js";

export interface IHCFConfig extends IBasicConfig {
    readonly FLUSHES: string[];
}