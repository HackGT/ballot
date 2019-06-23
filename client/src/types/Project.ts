export default interface Project {
    id?: number;
    name: string;
    devpostURL: string;
    expoNumber: number;
    tableGroup: TableGroup;
    tableNumber: number;
    sponsorPrizes: string;
    tags: string;
}

export interface TableGroup {
    id?: number;
    name: string;
    shortcode: string;
    color: string;
}
