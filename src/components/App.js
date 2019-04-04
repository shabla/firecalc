import React, { useState, useEffect } from "react";
import Currency from "react-currency-formatter";

import { Table, TableColumn } from "./Table";
import InputNumber from "./InputNumber";
import GlobalStyle from "./GlobalStyle";
import { FormField, FiltersCol, FiltersColContainer, FiltersColTitle } from "./Form";
import NewIncomeForm from "./NewIncomeForm";

const App = () => {
    const columns = [
        { title: "Year", dataIndex: "year", key: "year", width: 60 },
        { title: "Age", dataIndex: "startingAge", key: "startingAge", width: 60 },
        { title: "Income", dataIndex: "income", key: "income" },
        { title: "Net Income", dataIndex: "netIncome", key: "netIncome" },
        { title: "Expenses", dataIndex: "expenses", key: "expenses" },
        { title: "Savings", dataIndex: "savings", key: "savings" },
        { title: "Net Capital", dataIndex: "capital", key: "capital" },
        { title: "Returns", dataIndex: "returns", key: "returns" },
        { title: "Total Capital", dataIndex: "totalCapital", key: "totalCapital" },
        { title: "Retirement Withdrawal", dataIndex: "retirementIncome", key: "retirementIncome" },


        { title: "testcol", dataIndex: "test", key: "test" },
    ];

    const [startingYear, setStartingYear] = useState((new Date()).getFullYear());
    const [startingAge, setStartingAge] = useState(30);
    const [endAge, setEndAge] = useState(75);
    const [initialSalary, setInitialSalary] = useState(40000);
    const [yearlySalaryIncrease, setYearlySalaryIncrease] = useState(0);
    const [incomeTaxes, setIncomeTaxes] = useState(30);
    const [monthlyExpenses, setMonthlyExpenses] = useState(2000);
    const [yearlyExpensesIncrease, setYearlyExpensesIncrease] = useState(0);
    const [averageYearlyReturns, setAverageYearlyReturns] = useState(6);
    const [initialCapital, setInitialCapital] = useState(0);
    const [targetRetirementIncome, setTargetRetirementIncome] = useState(30000);
    const [targetCapitalFraction, setTargetCapitalFraction] = useState(4);

    const FREQ = {
        YEARLY: "yearly",
        MONTHLY: "monthly",
        BIWEEKLY: "biweekly",
        WEEKLY: "weekly",
        ONCE: "once"
    };

    const [incomes, setIncomes] = useState([
        // {value: 100, freq: FREQ.MONTHLY}
    ]);

    const getYears = (start, end) => {
        const years = [];
        for (let year = start; year <= end; year++) {
            years.push(year);
        }
        return years;
    }

    const [years, setYears] = useState(getYears(startingYear, startingYear + endAge - startingAge));

    useEffect(() => {
        setYears(getYears(startingYear, startingYear + endAge - startingAge));
    }, [startingYear, endAge])

    const generateData = () => {
        let prevYearCapital = initialCapital;
        let prevYearRetirementIncome = prevYearCapital * (targetCapitalFraction / 100);

        return years.map((year, i) => {
            const item = {
                key: year,
                year,
                startingAge: startingAge + i,
            };

            const isRetired = prevYearRetirementIncome >= targetRetirementIncome;

            item.test = incomes.reduce((acc, income) => {
                return {
                    [FREQ.YEARLY]: (total, value) => total + value,
                    [FREQ.MONTHLY]: (total, value) => total + value * 12,
                    [FREQ.BIWEEKLY]: (total, value) => total + value * 26,
                    [FREQ.WEEKLY]: (total, value) => total + value * 52,
                    [FREQ.ONCE]: (total, value) => total + value,
                }[income.freq](acc, income.value);
            }, 0);


            item.income = isRetired
                ? 0
                : Math.pow(1 + yearlySalaryIncrease / 100, i) * initialSalary;

            item.netIncome = isRetired
                ? prevYearRetirementIncome
                : item.income * (1 - incomeTaxes / 100);

            item.expenses = Math.pow(1 + yearlyExpensesIncrease / 100, i) * monthlyExpenses * 12;

            item.savings = item.netIncome - item.expenses;

            item.capital = isRetired
                ? prevYearCapital - prevYearRetirementIncome + item.savings
                : prevYearCapital + item.savings;

            item.returns = item.capital * (averageYearlyReturns / 100);
            item.totalCapital = item.capital + item.returns;
            item.retirementIncome = item.totalCapital * (targetCapitalFraction / 100);

            prevYearCapital = item.totalCapital;
            prevYearRetirementIncome = item.retirementIncome;

            return item;
        });
    }

    const addIncome = newIncome => {
        console.log(newIncome)
        setIncomes([...incomes, newIncome]);
    }

    const data = generateData();

    return (
        <div>
            <GlobalStyle />

            <FiltersColContainer>
                <FiltersCol>
                    <FiltersColTitle>Misc</FiltersColTitle>

                    <FormField>
                        <span>Starting Year</span>
                        <InputNumber
                            size="small"
                            value={startingYear}
                            onChange={setStartingYear}
                        />
                    </FormField>

                    <FormField>
                        <span>Starting Age</span>
                        <InputNumber
                            size="small"
                            value={startingAge}
                            onChange={setStartingAge}
                        />
                    </FormField>

                    <FormField>
                        <span>End Age</span>
                        <InputNumber
                            size="small"
                            value={endAge}
                            onChange={setEndAge}
                            min={18}
                            max={120}
                        />
                    </FormField>

                    <FormField>
                        <span>Starting Capital ($)</span>
                        <InputNumber
                            size="small"
                            value={initialCapital}
                            onChange={setInitialCapital}
                            precision={0}
                            step={1000}
                            min={0}
                            max={999999999}
                        />
                    </FormField>

                    <FormField>
                        <span>Target Retirement Withdrawal (%)</span>
                        <InputNumber
                            size="small"
                            value={targetCapitalFraction}
                            onChange={setTargetCapitalFraction}
                            formatter={v => `${v}%`}
                            parser={value => value.replace('%', '')}
                            precision={2}
                            step={0.25}
                            min={0}
                            max={10}
                        />
                    </FormField>

                    <FormField>
                        <span>Target Retirement Income ($)</span>
                        <InputNumber
                            size="small"
                            value={targetRetirementIncome}
                            onChange={setTargetRetirementIncome}
                            precision={0}
                            step={1000}
                            min={0}
                            max={999999999}
                        />
                    </FormField>
                </FiltersCol>

                <FiltersCol>
                    <FiltersColTitle>Income</FiltersColTitle>

                    <FormField>
                        <span>Salary ($)</span>
                        <InputNumber
                            size="small"
                            value={initialSalary}
                            onChange={setInitialSalary}
                            precision={0}
                            step={1000}
                            min={0}
                            max={999999999}
                        />
                    </FormField>

                    <FormField>
                        <span>Yearly Salary Increase (%)</span>
                        <InputNumber
                            size="small"
                            value={yearlySalaryIncrease}
                            onChange={setYearlySalaryIncrease}
                            precision={2}
                            formatter={v => `${v}%`}
                            parser={value => value.replace('%', '')}
                            step={0.5}
                            min={0}
                            max={10}
                        />
                    </FormField>

                    <FormField>
                        <span>Average Yearly Returns (%)</span>
                        <InputNumber
                            size="small"
                            value={averageYearlyReturns}
                            onChange={setAverageYearlyReturns}
                            precision={1}
                            formatter={v => `${v}%`}
                            parser={value => value.replace('%', '')}
                            step={0.5}
                            min={0}
                            max={100}
                        />
                    </FormField>

                    <hr />

                    <NewIncomeForm freqs={FREQ} years={years} onAdd={addIncome} />

                    <pre>
                        {JSON.stringify(incomes, null, 4)}
                    </pre>
                </FiltersCol>

                <FiltersCol>
                    <FiltersColTitle>Expenses</FiltersColTitle>

                    <FormField>
                        <span>Income Taxes (%)</span>
                        <InputNumber
                            value={incomeTaxes}
                            onChange={setIncomeTaxes}
                            precision={1}
                            formatter={v => `${v}%`}
                            parser={value => value.replace('%', '')}
                            step={0.5}
                            min={0}
                            max={100}
                        />
                    </FormField>

                    <FormField>
                        <span>Monthly Expenses ($)</span>
                        <InputNumber
                            value={monthlyExpenses}
                            onChange={setMonthlyExpenses}
                            precision={0}
                            formatter={v => `${v}$`}
                            parser={value => value.replace('$', '')}
                            step={100}
                            min={0}
                            max={100000}
                        />
                    </FormField>

                    <FormField>
                        <span>Yearly Expenses Increase (%)</span>
                        <InputNumber
                            value={yearlyExpensesIncrease}
                            onChange={setYearlyExpensesIncrease}
                            precision={1}
                            formatter={v => `${v}%`}
                            parser={value => value.replace('%', '')}
                            step={0.5}
                            min={0}
                            max={100}
                        />
                    </FormField>
                </FiltersCol>
            </FiltersColContainer>

            <Table
                dataSource={data}
                size="small"
                pagination={false}
                rowClassName={(row, index) => {
                    return row.retirementIncome >= targetRetirementIncome ? "row-success" : ""
                }}
            >
                {columns.map(col => {
                    const colProps = {};
                    if (!["year", "startingAge", "empty", "capitalFraction"].includes(col.dataIndex)) {
                        colProps.render = v => (
                            <Currency quantity={v} currency="CAD" pattern="###,### !" />
                        );
                    }

                    return (
                        <TableColumn
                            align="right"
                            key={col.key}
                            dataIndex={col.dataIndex}
                            title={col.title}
                            width={col.width}
                            {...colProps}
                        />
                    )
                })}
            </Table>
        </div>
    );
}

export default App;
