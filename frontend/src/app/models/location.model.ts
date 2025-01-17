export interface Location {
    _id: string;
    name: string;
    isComplete: boolean;
    workScope: string;
}


export interface locationHistory {
    _id : string;
    locationId: string;
    action: "CREATE" | "UPDATE" | "DELETE" | "COMPLETE";
    oldValue: Location | null;
    newValue: Location | null;
    timestamp: Date;
}