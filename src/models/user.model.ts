export interface User {
    key?: string;  //? key is optional - not necessary cause firebase does it
    name: string;
    password: number;
    status: string;
    applevel: string;
    companyid: number;
    lasttimestamp: string;
    lastcomment: string;
    worktime: number;
    lasttimestampISO: string;
    lasttimestampUTC_d: string;
    userID: number;
}
