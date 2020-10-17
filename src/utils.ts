import { FiltersValues } from "models/FiltersValues";

export const removeFromList = <T>(list: T[], item: T): T[] => {
    const index = list.indexOf(item);
    if (index > -1) {
        return [...list.slice(0, index), ...list.slice(index + 1)];
    }
    return list;
};

export const getDefaultSettings = (): FiltersValues => {
    return {
        startingYear: 2020,
        age: 31,
        initialCapital: 5000,
        avgYearlyReturns: 6,
        withdrawalRate: 4,
        retirementIncomeTarget: 40000,
        incomes: [
            {
                name: "Bonus thingie",
                amount: 1234,
                recurrenceType: "once",
                year: 2021,
                id: "706139e3-be1b-4410-a137-047b64f1849c",
            },
            {
                name: "Payroll",
                amount: 2400,
                recurrenceType: "recurring",
                frequency: 2,
                frequencyScope: "week",
                year: 2020,
                id: "7z6139e3-be1b-4410-a137-047b64f1849c",
            },
        ],
        expenses: [
            {
                name: "everything",
                amount: 30000,
                recurrenceType: "recurring",
                frequency: 1,
                frequencyScope: "year",
                year: 2020,
                id: "7z6139e3-be1b-4a10-a137-047b64f1849c",
            },
        ],
    };
};
