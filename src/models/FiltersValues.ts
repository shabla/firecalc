import { CashFlow } from "./CashFlow";

export interface FiltersValues {
    startingYear: number;
    age?: number;
    initialCapital: number;
    avgYearlyReturns: number;
    triType: string;
    triValue: number;
    incomes: CashFlow[];
    expenses: CashFlow[];
}
