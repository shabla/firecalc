import React, { useState, useCallback } from "react";
import Currency from "react-currency-formatter";
import { ThemeProvider, Stack, theme, CSSReset } from "@chakra-ui/core";

import { SimpleTable, FiltersBar } from "components";
import { FiltersValues, CashFlow } from "models";
import { RecurrenceUntilType, FrequencyScope } from "values";
import { getDefaultSettings, saveToLocalStorage } from "utils";

import "./App.scss";

type RowItem = {
    year: number;
    age?: number | undefined;
    startOfYearCapital: number;
    income: number;
    spendings: number;
    savings: number;
    returns: number;
    totalCapital: number;
    retirementWithdrawal: number;
    goalReached: boolean;
};

type ColumnDefinition = {
    title: string;
    key: string;
    getData: (row: RowItem, column: ColumnDefinition) => any;
    condition?: (filters: FiltersValues) => boolean;
    textAlign?: string;
    cellHeaderClasses?: string;
    cellClasses?: string;
};

const columns: ColumnDefinition[] = [
    {
        title: "Year",
        key: "year",
        getData: (row: RowItem, col: ColumnDefinition) => row.year,
        textAlign: "center",
    },
    {
        title: "Age",
        key: "age",
        getData: (row: RowItem, col: ColumnDefinition) => row.age,
        condition: (filters: FiltersValues): boolean => filters.age !== undefined,
        textAlign: "center",
    },
    {
        title: "Start of Year\nCapital",
        key: "startingCapital",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.startOfYearCapital} currency="CAD" pattern="###,### !" />
        ),
        textAlign: "right",
    },
    {
        title: "Retirement Withdrawal",
        key: "retirementWithdrawal",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.retirementWithdrawal} currency="CAD" pattern="###,### !" />
        ),
        textAlign: "right",
    },
    {
        title: "Income",
        key: "income",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.income} currency="CAD" pattern="###,### !" />
        ),
        textAlign: "right",
        cellHeaderClasses: "border-left",
        cellClasses: "border-left",
    },
    {
        title: "spendings",
        key: "spendings",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.spendings} currency="CAD" pattern="###,### !" />
        ),
        textAlign: "right",
    },
    {
        title: "Savings",
        key: "Savings",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.savings} currency="CAD" pattern="###,### !" />
        ),
        textAlign: "right",
        cellHeaderClasses: "border-right",
        cellClasses: "border-right",
    },
    {
        title: "Returns",
        key: "returns",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.returns} currency="CAD" pattern="###,### !" />
        ),
        textAlign: "right",
    },
    {
        title: "End of Year\n Capital",
        key: "totalCapital",
        getData: (row: RowItem, col: ColumnDefinition) => (
            <Currency quantity={row.totalCapital} currency="CAD" pattern="###,### !" />
        ),
        textAlign: "right",
    },
];

const ROWS_TO_SHOW = 70;

export const App: React.FC = () => {
    const [rows, setRows] = useState<RowItem[]>([]);
    const [filters, setFilters] = useState<FiltersValues>(getDefaultSettings());

    const calculateCashFlow = (year: number, cashFlows: CashFlow[], goalReached: boolean): number => {
        let total = 0;

        cashFlows.forEach((cashFlow) => {
            if (!cashFlow.recurring) {
                const started = year >= cashFlow.year;
                const expired =
                    (cashFlow.untilType === RecurrenceUntilType.Year && year > cashFlow.untilYear!) ||
                    (cashFlow.untilType === RecurrenceUntilType.Goal && goalReached);

                if (started && !expired) {
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
            } else if (year === cashFlow.year) {
                total += cashFlow.amount;
            }
        });

        return total;
    };

    const onFiltersChange = useCallback((filters: FiltersValues) => {
        const rows: RowItem[] = [];

        console.log(filters);

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
            const retirementWithdrawal = startOfYearCapital * (filters.withdrawalRate / 100);
            const goalReached = retirementWithdrawal >= filters.retirementIncomeTarget;

            // Income for this year
            const income = calculateCashFlow(year, filters.incomes, goalReached);

            // Spendings for this year
            const spendings = calculateCashFlow(year, filters.spendings, goalReached);

            // Savings
            const savings = income - spendings;

            const totalCapitalBeforeReturns = startOfYearCapital + savings;

            const returns = totalCapitalBeforeReturns * (filters.avgYearlyReturns / 100);

            const endOfYearTotalCapital = totalCapitalBeforeReturns + returns;

            const row: RowItem = {
                year,
                age,
                startOfYearCapital,
                income,
                spendings,
                savings,
                returns,
                totalCapital: endOfYearTotalCapital,
                retirementWithdrawal,
                goalReached,
            };

            rows.push(row);
        }

        saveToLocalStorage("filters", filters);
        setFilters(filters);
        setRows(rows);
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <CSSReset />

            <Stack isInline>
                <FiltersBar defaultValues={filters} onChange={onFiltersChange} />

                <Stack flex="1">
                    <SimpleTable className="the-table">
                        <thead>
                            <tr>
                                {columns.map((col) => {
                                    if (col.condition && !col.condition(filters)) {
                                        return null;
                                    }

                                    return (
                                        <th
                                            key={`th-${col.key}`}
                                            className={[
                                                col.cellHeaderClasses,
                                                col.textAlign ? `align-${col.textAlign}` : undefined,
                                            ].join(" ")}
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
                                    <tr key={row.year} className={row.goalReached ? "ready" : undefined}>
                                        {columns.map((col) => {
                                            if (col.condition && !col.condition(filters)) {
                                                return null;
                                            }
                                            return (
                                                <td
                                                    key={row.year + "-" + col.key}
                                                    className={[
                                                        col.cellClasses,
                                                        col.textAlign ? `align-${col.textAlign}` : undefined,
                                                    ].join(" ")}
                                                >
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
            </Stack>
        </ThemeProvider>
    );
};
