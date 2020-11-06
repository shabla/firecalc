import { CashFlow } from "./CashFlow";

export interface FiltersValues {
    startingYear: number;
    age?: number;
    initialCapital: number;
    avgYearlyReturns: number;
    withdrawalRate: number;
    retirementIncomeTarget: number;
    incomes: CashFlow[];
    spendings: CashFlow[];
}
