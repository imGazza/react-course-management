//TODO: Transform status in enum

export interface Course {
    id: string;
    name: string;
    description: string;
    image: string;
    status: "Pianificato" | "In corso" | "Chiuso";
    subscribers: number;
    year: number;
    closeDate: Date;
}