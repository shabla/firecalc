import { FrequencyScope, RecurrenceUntilType, RecurrenceStartingType } from "values";

export interface CashFlow {
    id?: string;
    name: string;
    amount: number;
    recurring: boolean;
    fixedYear?: number;
    recurringOptions?: RecurringOptions;
}

export interface RecurringOptions {
    frequency: number;
    frequencyScope: FrequencyScope;
    startingType: RecurrenceStartingType;
    untilType: RecurrenceUntilType;
    startingValue?: number;
    untilValue?: number;
}