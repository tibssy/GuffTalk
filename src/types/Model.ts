export type ModelStatus = "not_downloaded" | "downloading" | "downloaded";

export interface Model {
    id: string;
    name: string;
    size: string;
    url: string;
    fileName: string;
    status: ModelStatus;
    progress?: number; // From 0 to 1
    isActive?: boolean;
    buttonTitle?: string;
}
