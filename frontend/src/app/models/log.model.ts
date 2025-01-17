export interface Log {
    _id: string,
    location: string,
    workscope: string,
    isCompleted: boolean,
    createdAt: Date,
    completedAt: Date | null,
}
