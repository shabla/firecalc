import { FiltersValues, CashFlow } from "models";

export const removeFromList = <T>(list: T[], item: T): T[] => {
    const index = list.indexOf(item);
    if (index > -1) {
        return [...list.slice(0, index), ...list.slice(index + 1)];
    }
    return list;
};

export const saveToLocalStorage = (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
};

export const getFromLocalStorage = (name: string): unknown => {
    const value = localStorage.getItem(name);

    try {
        return JSON.parse(value || "");
    } catch (e) {
        return undefined;
    }
};

const getDefaultStartingYear = (val?: number): number => val != null ? val : new Date().getFullYear();
const getDefaultAge = (val?: number): number | undefined => val;
const getDefaultInitialCapital = (val?: number): number => val != null ? val : 0;
const getDefaultAvgYearlyReturns = (val?: number): number => val != null ? val : 6;
const getDefaultWithdrawalRate = (val?: number): number => val != null ? val : 4;
const getDefaultRetirementIncomeTarget = (val?: number): number => val != null ? val : 40000;
const getDefaultIncomes = (val?: CashFlow[]): CashFlow[] => val || [];
const getDefaultSpendings = (val?: CashFlow[]): CashFlow[] => val || [];

export const getDefaultSettings = (): FiltersValues => {
    const filters = getFromLocalStorage("filters") as FiltersValues;

    return {
        startingYear: getDefaultStartingYear(filters.startingYear),
        age: getDefaultAge(filters.age),
        initialCapital: getDefaultInitialCapital(filters.initialCapital),
        avgYearlyReturns: getDefaultAvgYearlyReturns(filters.avgYearlyReturns),
        withdrawalRate: getDefaultWithdrawalRate(filters.withdrawalRate),
        retirementIncomeTarget: getDefaultRetirementIncomeTarget(filters.retirementIncomeTarget),
        incomes: getDefaultIncomes(filters.incomes),
        spendings: getDefaultSpendings(filters.spendings),
    };

    // return {
    //     startingYear: 2020,
    //     age: 31,
    //     initialCapital: 5000,
    //     avgYearlyReturns: 6,
    //     withdrawalRate: 4,
    //     retirementIncomeTarget: 40000,
    //     incomes: [
    //         {
    //             name: "Bonus thingie",
    //             amount: 1234,
    //             recurrenceType: "once",
    //             year: 2021,
    //             id: "706139e3-be1b-4410-a137-047b64f1849c",
    //         },
    //         {
    //             name: "Payroll",
    //             amount: 2400,
    //             recurrenceType: "recurring",
    //             frequency: 2,
    //             frequencyScope: "week",
    //             year: 2020,
    //             id: "7z6139e3-be1b-4410-a137-047b64f1849c",
    //         },
    //     ],
    //     spendings: [
    //         {
    //             name: "everything",
    //             amount: 30000,
    //             recurrenceType: "recurring",
    //             frequency: 1,
    //             frequencyScope: "year",
    //             year: 2020,
    //             id: "7z6139e3-be1b-4a10-a137-047b64f1849c",
    //         },
    //     ],
    // };
};
