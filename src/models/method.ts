export interface Method {
    id: string;
    name: string;
    description?: string;
    work_duration: number;
    break_duration: number;
    long_break_duration: number;
    cycles_before_long_break: number;
}

export interface MethodState {
    methods: Method[];
    fetchMethods: () => Promise<void>;
}