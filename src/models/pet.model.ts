export type Status = "available" | "pending" | "sold";

export interface Pet {
    id: number;
    name: string;
    status: Status; 
    photoUrls: string[];
}