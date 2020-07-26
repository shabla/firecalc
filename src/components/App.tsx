import React, { useState, useEffect } from "react";
import Currency from "react-currency-formatter";
import { ThemeProvider, Stack, theme, CSSReset, Box } from "@chakra-ui/core";

import Filters from "./Filters";
import { FiltersValues } from "../models/FiltersValues";
import { CashFlow } from "../models/CashFlow";
import { RecurrenceType } from "../values/RecurrenceType";
import { FrequencyScope } from "../values/FrequencyScope";
import { SafeWithdrawalType } from "../values/SafeWithdrawalType";
import { SimpleTable } from "components"

import "./App.scss";

type RowItem = {
    year: number;
    age?: number | undefined;
    startOfYearCapital: number;
    income: number;
    expenses: number;
    savings: number;
    returns: number;
    totalCapital: number;
    retirementWithdrawal: number;
    ready: boolean;
};

type ColumnDefinition = {
    title: string;
    key: string;
    getData: (row: RowItem, column: ColumnDefinition) => any;
    condition?: (filters: FiltersValues) => boolean;
    getHeaderClasses?: (filters: FiltersValues) => string;
    getCellClasses?: (row: RowItem) => string;
};

const columns = [
    {
        title: "Year",
        key: "year",
        getData: (row: RowItem, col: ColumnDefinition) => row.year,
    },
    {
        title: "Age",
        key: "age",
        getData: (row: RowItem, col: ColumnDefinition) => row.age,
        condition: (filters: FiltersValues): boolean => filters.age !== undefined,
    },
    {
        title: "Start of Year\nCapital",
        key: "startingCapital",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.startOfYearCapital} currency="CAD" pattern="###,### !" />
        ),
    },
    {
        title: "Retirement Withdrawal",
        key: "retirementWithdrawal",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.retirementWithdrawal} currency="CAD" pattern="###,### !" />
        ),
    },
    {
        title: "Income",
        key: "income",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.income} currency="CAD" pattern="###,### !" />
        ),
        getHeaderClasses: (filters: FiltersValues) => "border-left",
        getCellClasses: (row: RowItem) => "border-left",
    },
    {
        title: "Expenses",
        key: "expenses",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.expenses} currency="CAD" pattern="###,### !" />
        ),
    },
    {
        title: "Savings",
        key: "Savings",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.savings} currency="CAD" pattern="###,### !" />
        ),
        getHeaderClasses: (filters: FiltersValues) => "border-right",
        getCellClasses: (row: RowItem) => "border-right",
    },
    {
        title: "Returns",
        key: "returns",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.returns} currency="CAD" pattern="###,### !" />
        ),
    },
    {
        title: "End of Year\n Capital",
        key: "totalCapital",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.totalCapital} currency="CAD" pattern="###,### !" />
        ),
    },
];

const ROWS_TO_SHOW = 70;

const App = () => {
    const [filters, setFilters] = useState<FiltersValues>({
        startingYear: 2020,
        age: 31,
        initialCapital: 5000,
        avgYearlyReturns: 6,
        triType: "percentage",
        triValue: 4,
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
    });

    const calculateCashFlow = (year: number, cashFlows: CashFlow[]): number => {
        let total = 0;
        cashFlows.forEach((cashFlow) => {
            if (cashFlow.recurrenceType === RecurrenceType.Once) {
                if (year === cashFlow.year) {
                    total += cashFlow.amount;
                }
            } else if (cashFlow.recurrenceType === RecurrenceType.Recurring) {
                if (year >= cashFlow.year) {
                    const freq = cashFlow.frequency as number;
                    // calc the total for the year
                    switch (cashFlow.frequencyScope) {
                        case FrequencyScope.Day:
                            total += cashFlow.amount * (365 / freq);
                            break;
                        case FrequencyScope.Week:
                            total += cashFlow.amount * (52 / freq);
                            break;
                        case FrequencyScope.Month:
                            total += cashFlow.amount * (12 / freq);
                            break;
                        case FrequencyScope.Year:
                            total += cashFlow.amount * (1 / freq);
                            break;
                    }
                }
            }
        });
        return total;
    };

    const onFiltersChange = (filters: FiltersValues) => {
        console.log("filters", filters);

        const rows: RowItem[] = [];

        for (let i = 0; i < ROWS_TO_SHOW; i++) {
            // Year
            const year = filters.startingYear + i;

            // Age
            let age;
            if (filters.age) {
                age = filters.age + i;
            }

            // Capital at the start of the year
            let startOfYearCapital = 0;
            if (i === 0) {
                startOfYearCapital = filters.initialCapital;
            } else {
                startOfYearCapital = rows[i - 1].totalCapital;
            }

            // Potential Withdrawal Rate at start of year
            let retirementWithdrawal = 0;
            let ready = false;
            if (filters.triType === SafeWithdrawalType.Percentage) {
                retirementWithdrawal = startOfYearCapital * (filters.triValue / 100);
            } else if (filters.triType === SafeWithdrawalType.Fixed) {
                let returnsFromLastYear = 0;
                if (i > 0) {
                    returnsFromLastYear = rows[i - 1].returns;
                }
                retirementWithdrawal = returnsFromLastYear;

                if (retirementWithdrawal >= filters.triValue) {
                    ready = true;
                }
            }

            // Income for this year
            let income = calculateCashFlow(year, filters.incomes);

            // Expenses for this year
            const expenses = calculateCashFlow(year, filters.expenses);

            // Savings
            const savings = income - expenses;

            const totalCapitalBeforeReturns = startOfYearCapital + savings;

            const returns = totalCapitalBeforeReturns * (filters.avgYearlyReturns / 100);

            const endOfYearTotalCapital = totalCapitalBeforeReturns + returns;

            const row: RowItem = {
                year,
                age,
                startOfYearCapital,
                income,
                expenses,
                savings,
                returns,
                totalCapital: endOfYearTotalCapital,
                retirementWithdrawal,
                ready,
            };

            rows.push(row);
        }

        console.log("rows", rows);

        setFilters(filters);
        setRows(rows);
    };

    const [rows, setRows] = useState<RowItem[]>([]);

    return (
        <ThemeProvider theme={theme}>
            <CSSReset />

            <Filters
                defaultAge={filters.age}
                defaultInitialCapital={filters.initialCapital}
                defaultAvgYearlyReturns={filters.avgYearlyReturns}
                defaultTriType={filters.triType}
                defaultTriValue={filters.triValue}
                defaultIncomes={filters.incomes}
                defaultExpenses={filters.expenses}
                onChange={onFiltersChange}
            />

            <Stack>
                <SimpleTable className="the-table">
                    <thead>
                        <tr>
                            {columns.map((col) => {
                                if (col.condition && !col.condition(filters)) {
                                    return;
                                }
                                return (
                                    <th
                                        key={`th-${col.key}`}
                                        className={col.getHeaderClasses && col.getHeaderClasses(filters)}
                                    >
                                        {col.title.split("\n").map((letters, index) => (
                                            <div key={index}>{letters}</div>
                                        ))}
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((row) => {
                            return (
                                <tr key={row.year} className={row.ready ? "ready" : undefined}>
                                    {columns.map((col) => {
                                        if (col.condition && !col.condition(filters)) {
                                            return;
                                        }
                                        return (
                                            <td key={row.year + "-" + col.key} className={col.getCellClasses && col.getCellClasses(row)}>
                                                {col.getData(row, col)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </SimpleTable>
            </Stack>
        </ThemeProvider>
    );
};

export default App;
