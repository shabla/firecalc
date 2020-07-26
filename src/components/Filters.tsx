import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    Button,
    InputGroup,
    InputRightElement,
    FormControl,
    FormLabel,
    Select,
    Input,
    Stack,
    Modal,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/core";

import { EditCashFlowDialog } from "./EditCashFlowDialog/EditCashFlowDialog";
import { FilterSection } from "./FilterSection";
import { CashFlow } from "../models/CashFlow";
import { FiltersValues } from "../models/FiltersValues";
import { SafeWithdrawalType } from "../values/SafeWithdrawalType";

interface FiltersProps {
    defaultYear?: number;
    defaultAge?: number;
    defaultInitialCapital?: number;
    defaultAvgYearlyReturns?: number;
    defaultTriType?: string;
    defaultTriValue?: number;
    defaultIncomes?: CashFlow[];
    defaultExpenses?: CashFlow[];
    onChange: (filters: FiltersValues) => void;
}

const Filters: React.FC<FiltersProps> = ({
    defaultYear = new Date().getFullYear(),
    defaultAge,
    defaultInitialCapital = 0,
    defaultAvgYearlyReturns = 6,
    defaultTriType = SafeWithdrawalType.Percentage,
    defaultTriValue = 4,
    defaultIncomes = [],
    defaultExpenses = [],
    onChange,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [dialogTitle, setDialogTitle] = useState<string>("");

    // Misc
    const [startingYear, setStartingYear] = useState<number>(defaultYear);
    const [age, setAge] = useState<number | undefined>(defaultAge);
    const [initialCapital, setInitialCapital] = useState<number>(defaultInitialCapital);
    const [avgYearlyReturns, setAvgYearlyReturns] = useState<number>(defaultAvgYearlyReturns);
    const [triType, setTriType] = useState<string>(defaultTriType);
    const [triValue, setTriValue] = useState<number>(defaultTriValue);

    // Incomes
    const [incomes, setIncomes] = useState<CashFlow[]>(() =>
        defaultIncomes.map((income) => {
            if (!income.id) {
                income.id = uuidv4();
            }
            return income;
        })
    );

    // Expenses
    const [expenses, setExpenses] = useState<CashFlow[]>(() =>
        defaultExpenses.map((expense) => {
            if (!expense.id) {
                expense.id = uuidv4();
            }
            return expense;
        })
    );

    const addCashFlow = (target: CashFlow[], cashFlow: CashFlow): CashFlow[] => {
        if (cashFlow.id) {
            // Update
            const index = target.findIndex((item) => item.id === cashFlow.id);
            if (index > -1) {
                const newCashFlows = [...target];
                newCashFlows[index] = cashFlow;
                return newCashFlows;
            }
        } else {
            // Create
            cashFlow.id = uuidv4();
            return [...target, cashFlow];
        }
        return target;
    };

    const handleIncomeChange = (cashFlow: CashFlow) => {
        console.log(cashFlow);
        onClose();
        setIncomes(addCashFlow(incomes, cashFlow));
    };

    const handleExpenseChange = (cashFlow: CashFlow) => {
        console.log(cashFlow);
        onClose();
        setExpenses(addCashFlow(expenses, cashFlow));
    };

    const handleAddIncome = () => {
        setDialogTitle("Add Income");
        onOpen();
    };

    const handleAddExpense = () => {
        setDialogTitle("Add Expense");
        onOpen();
    };

    useEffect(() => {
        // TODO: bundle all the misc into an object
        onChange({
            startingYear,
            age,
            initialCapital,
            avgYearlyReturns,
            triType,
            triValue,
            incomes,
            expenses,
        });
    }, [startingYear, age, initialCapital, avgYearlyReturns, triType, triValue, incomes, expenses]);

    return (
        <>
            <Stack isInline spacing={8}>
                <FilterSection title="Misc">
                    <Stack isInline>
                        <FormControl flexBasis="50%">
                            <FormLabel htmlFor="startingYear">Starting Year</FormLabel>
                            <Input
                                type="number"
                                id="startingYear"
                                value={startingYear}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setStartingYear(parseInt(e.currentTarget.value))
                                }
                            />
                        </FormControl>

                        <FormControl flexBasis="50%">
                            <FormLabel htmlFor="age">Age</FormLabel>
                            <Input
                                type="text"
                                id="age"
                                value={age}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setAge(parseInt(e.currentTarget.value) || undefined)
                                }
                            />
                        </FormControl>
                    </Stack>

                    <Stack isInline marginTop="15px">
                        <FormControl flexBasis="50%">
                            <FormLabel htmlFor="initialCapital">Initial Capital</FormLabel>
                            <InputGroup>
                                <Input
                                    type="text"
                                    id="initialCapital"
                                    value={initialCapital}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setInitialCapital(parseInt(e.currentTarget.value))
                                    }
                                />
                                <InputRightElement children="$" color="gray.300" />
                            </InputGroup>
                        </FormControl>

                        <FormControl flexBasis="50%">
                            <FormLabel htmlFor="avgYearlyReturns">Avg Yearly Returns</FormLabel>
                            <InputGroup>
                                <Input
                                    type="number"
                                    id="avgYearlyReturns"
                                    value={avgYearlyReturns}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setAvgYearlyReturns(parseInt(e.currentTarget.value))
                                    }
                                />
                                <InputRightElement children="%" color="gray.300" />
                            </InputGroup>
                        </FormControl>
                    </Stack>

                    <FormControl marginTop="15px">
                        <FormLabel htmlFor="targetRetirementIncome">Minimum Retirement Withdrawal</FormLabel>
                        <Stack isInline>
                            <Select
                                value={triType}
                                onChange={(e) => setTriType(e.currentTarget.value)}
                                flexBasis="50%"
                            >
                                <option value={SafeWithdrawalType.Percentage}>Percentage</option>
                                <option value={SafeWithdrawalType.Fixed}>Fixed</option>
                            </Select>

                            <InputGroup flexBasis="50%">
                                <Input
                                    type="number"
                                    id="triValue"
                                    value={triValue}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setTriValue(parseInt(e.currentTarget.value))
                                    }
                                    isInvalid={
                                        triType === SafeWithdrawalType.Percentage
                                            ? triValue > 100 || triValue <= 0
                                            : false
                                    }
                                />
                                <InputRightElement
                                    children={triType === SafeWithdrawalType.Percentage ? "%" : "$"}
                                    color="gray.300"
                                />
                            </InputGroup>
                        </Stack>
                    </FormControl>
                </FilterSection>

                <FilterSection title="Incomes" bg="#F8F9FC">
                    <Stack>
                        {incomes.map((income) => {
                            return (
                                <div key={income.id}>
                                    {income.name} - {income.amount}
                                </div>
                            );
                        })}
                        <Button variantColor="blue" onClick={handleAddIncome}>
                            Add Income
                        </Button>
                    </Stack>
                </FilterSection>

                <FilterSection title="Expenses">
                    <Stack>
                        {expenses.map((expense) => {
                            return (
                                <div key={expense.id}>
                                    {expense.name} - {expense.amount}
                                </div>
                            );
                        })}
                        <Button variantColor="red" onClick={handleAddExpense}>
                            Add Expense
                        </Button>
                    </Stack>
                </FilterSection>
            </Stack>

            <Modal isOpen={isOpen} closeOnOverlayClick={false} onClose={onClose}>
                <ModalOverlay />
                <EditCashFlowDialog
                    title={dialogTitle}
                    onCancel={onClose}
                    onSave={dialogTitle === "Add Income" ? handleIncomeChange : handleExpenseChange} // this is flaky as fuck
                />
            </Modal>
        </>
    );
};

export default Filters;
