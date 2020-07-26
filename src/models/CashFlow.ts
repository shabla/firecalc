

export interface CashFlow {
    id?: string;
    name: string,
    amount: number,
    recurrenceType: string,
    year: number,

    // only for RecurrenceType.Recurring
    frequency?: number,
    frequencyScope?: string,
}