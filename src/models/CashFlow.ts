export interface CashFlow {
    id?: string;
    name: string,
    amount: number,
    recurring: boolean,
    year: number,

    // only if recurring
    frequency?: number,
    frequencyScope?: string,
    untilType?: string,
    untilYear?: number,
    startingType?: string;
    startingValue?: number;
}