import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
    Button,
    InputGroup,
    InputRightElement,
    FormControl,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormLabel,
    Input,
    Stack,
    Modal,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/core";

import { EditCashFlowDialog } from "../EditCashFlowDialog/EditCashFlowDialog";
import { FilterSection } from "./FilterSection";
import { removeFromList } from "utils";
import { CashFlowTable } from "components";
import { CashFlow, FiltersValues } from "models";

interface FiltersBarProps {
    defaultValues?: FiltersValues;
    onChange: (filters: FiltersValues) => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
    defaultValues = {
        startingYear: new Date().getFullYear(),
        age: undefined,
        initialCapital: 0,
        avgYearlyReturns: 0,
        withdrawalRate: 4,
        retirementIncomeTarget: 40000,
        incomes: [],
        expenses: [],
    },
    onChange,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [dialogTitle, setDialogTitle] = useState<string>("");
    const [activeCashFlow, setActiveCashFlow] = useState<CashFlow | undefined>();

    // Misc
    const [startingYear, setStartingYear] = useState<number>(defaultValues.startingYear);
    const [age, setAge] = useState<number | undefined>(defaultValues.age);
    const [initialCapital, setInitialCapital] = useState<number>(defaultValues.initialCapital);
    const [avgYearlyReturns, setAvgYearlyReturns] = useState<number>(defaultValues.avgYearlyReturns);
    const [retirementIncomeTarget, setRetirementIncomeTarget] = useState<number>(
        defaultValues.retirementIncomeTarget
    );
    const [withdrawalRate, setWithdrawalRate] = useState<number>(defaultValues.withdrawalRate);

    // Incomes
    const [incomes, setIncomes] = useState<CashFlow[]>(() =>
        defaultValues.incomes.map((income) => {
            if (!income.id) {
                income.id = uuidv4();
            }
            return income;
        })
    );

    // Expenses
    const [expenses, setExpenses] = useState<CashFlow[]>(() =>
        defaultValues.expenses.map((expense) => {
            if (!expense.id) {
                expense.id = uuidv4();
            }
            return expense;
        })
    );

    const handleAddIncome = () => {
        setDialogTitle("Add Income");
        onOpen();
    };

    const handleAddExpense = () => {
        setDialogTitle("Add Expense");
        onOpen();
    };

    const handleDeleteIncome = (cashFlow: CashFlow) => {
        setIncomes(removeFromList(incomes, cashFlow));
    };

    const handleDeleteExpense = (cashFlow: CashFlow) => {
        setExpenses(removeFromList(expenses, cashFlow));
    };

    const handleEditIncome = (cashFlow: CashFlow) => {
        setActiveCashFlow(cashFlow);
        setDialogTitle("Edit Income");
        onOpen();
    };

    const handleEditExpense = (cashFlow: CashFlow) => {
        setActiveCashFlow(cashFlow);
        setDialogTitle("Edit Expense");
        onOpen();
    };

    const updateCashFlow = (target: CashFlow[], cashFlow: CashFlow): CashFlow[] => {
        const index = target.findIndex((item) => item.id === cashFlow.id);

        if (index > -1) {
            // Update
            const newCashFlows = [...target];
            newCashFlows[index] = { ...cashFlow };
            
            return newCashFlows;
        } else {
            // Create
            return [...target, cashFlow];
        }
    };

    const handleDialogSave = (cashFlow: CashFlow) => {
        if (!cashFlow.id) {
            cashFlow = { ...cashFlow, id: uuidv4() };
        }

        // this is sketchy, find a better way
        if ((activeCashFlow && dialogTitle === "Edit Income") || dialogTitle === "Add Income") {
            setIncomes(updateCashFlow(incomes, cashFlow));
            setActiveCashFlow(undefined);
        } else if ((activeCashFlow && dialogTitle === "Edit Expense") || dialogTitle === "Add Expense") {
            setExpenses(updateCashFlow(expenses, cashFlow));
            setActiveCashFlow(undefined);
        }

        onClose();
    };

    useEffect(() => {
        onChange({
            startingYear,
            age,
            initialCapital,
            avgYearlyReturns,
            withdrawalRate,
            retirementIncomeTarget,
            incomes,
            expenses,
        });
    }, [
        startingYear,
        age,
        initialCapital,
        avgYearlyReturns,
        withdrawalRate,
        retirementIncomeTarget,
        incomes,
        expenses,
        onChange,
    ]);

    return (
        <Stack backgroundColor="white" flexBasis="450px">
            <Modal isOpen={isOpen} closeOnOverlayClick={false} onClose={onClose}>
                <ModalOverlay />
                <EditCashFlowDialog
                    title={dialogTitle}
                    cashFlow={activeCashFlow}
                    onCancel={onClose}
                    onSave={handleDialogSave}
                />
            </Modal>

            <Stack spacing={0}>
                <FilterSection title="Misc" padding="15px">
                    <Stack isInline>
                        <FormControl flexBasis="50%">
                            <FormLabel htmlFor="startingYear">Starting Year</FormLabel>

                            <NumberInput
                                size="sm"
                                min={1900}
                                max={3000}
                                defaultValue={startingYear}
                                onChange={(value: React.ReactText) => setStartingYear(value as number)}
                            >
                                <NumberInputField id="startingYear" />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>

                        <FormControl flexBasis="50%">
                            <FormLabel htmlFor="age">Age</FormLabel>

                            <NumberInput
                                size="sm"
                                precision={0}
                                defaultValue={age}
                                onChange={(value: React.ReactText) => setAge(value as number)}
                            >
                                <NumberInputField id="age" />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                    </Stack>

                    <Stack isInline marginTop="15px">
                        <FormControl flexBasis="50%">
                            <FormLabel htmlFor="initialCapital">Initial Capital ($)</FormLabel>

                            <NumberInput
                                size="sm"
                                step={1000}
                                precision={0}
                                defaultValue={initialCapital}
                                onChange={(value: React.ReactText) => setInitialCapital(value as number)}
                            >
                                <NumberInputField id="initialCapital" />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>

                        <FormControl flexBasis="50%">
                            <FormLabel htmlFor="avgYearlyReturns">Avg Yearly Returns</FormLabel>
                            <InputGroup size="sm">
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

                    <Stack isInline>
                        <FormControl flexBasis="50%">
                            <FormLabel htmlFor="withdrawalRate">Withdrawal Rate (%)</FormLabel>

                            <NumberInput
                                min={0}
                                step={0.1}
                                defaultValue={withdrawalRate}
                                onChange={(value: React.ReactText) => setWithdrawalRate(value as number)}
                                size="sm"
                            >
                                <NumberInputField id="withdrawalRate" />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>

                        <FormControl flexBasis="50%">
                            <FormLabel htmlFor="retirementIncomeTarget">
                                Retirement Income Target ($)
                            </FormLabel>
                            <NumberInput
                                min={0}
                                step={5000}
                                defaultValue={retirementIncomeTarget}
                                onChange={(value: React.ReactText) =>
                                    setRetirementIncomeTarget(value as number)
                                }
                                size="sm"
                            >
                                <NumberInputField id="retirementIncomeTarget" />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>
                    </Stack>
                </FilterSection>

                <FilterSection title="Incomes">
                    <Stack>
                        <CashFlowTable
                            items={incomes}
                            onEdit={handleEditIncome}
                            onDelete={handleDeleteIncome}
                        />

                        <Button variantColor="blue" onClick={handleAddIncome} borderRadius={0}>
                            Add Income
                        </Button>
                    </Stack>
                </FilterSection>

                <FilterSection title="Expenses">
                    <Stack>
                        <CashFlowTable
                            items={expenses}
                            onEdit={handleEditExpense}
                            onDelete={handleDeleteExpense}
                        />

                        <Button variantColor="red" onClick={handleAddExpense} borderRadius={0}>
                            Add Expense
                        </Button>
                    </Stack>
                </FilterSection>
            </Stack>
        </Stack>
    );
};
