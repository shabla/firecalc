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
    Select,
    Input,
    Stack,
    Modal,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/core";

import { EditCashFlowDialog } from "./EditCashFlowDialog/EditCashFlowDialog";
import { FilterSection } from "./FilterSection";
import { removeFromList } from "utils";
import { CashFlowTable } from "components";
import { SafeWithdrawalType } from "values";
import { CashFlow, FiltersValues } from "models";

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
    const [activeCashFlow, setActiveCashFlow] = useState<CashFlow | undefined>();

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

    const updateCashFlow = (target: CashFlow[], cashFlow: CashFlow): CashFlow[] => {
        console.log("find ", cashFlow, "in", target)
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

    const handleIncomeCreated = (cashFlow: CashFlow) => {
        setIncomes(updateCashFlow(incomes, cashFlow));
    };

    const handleExpenseCreated = (cashFlow: CashFlow) => {
        setExpenses(updateCashFlow(expenses, cashFlow));
    };

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

    const handleDialogSave = (cashFlow: CashFlow) => {
        // this is fucking awful
        console.log(cashFlow);
        onClose();

        if (activeCashFlow && dialogTitle === "Edit Income") {
            updateCashFlow(incomes, cashFlow);
            setActiveCashFlow(undefined);
        } else if (activeCashFlow && dialogTitle === "Edit Expense") {
            updateCashFlow(expenses, cashFlow);
            setActiveCashFlow(undefined);
        } else if (dialogTitle === "Add Income") {
            handleIncomeCreated(cashFlow);
        } else if (dialogTitle === "Add Expense") {
            handleExpenseCreated(cashFlow);
        }
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
            <Stack isInline spacing={0}>
                <FilterSection title="Misc" paddingX="30px" paddingBottom="30px" flexBasis={`${100 / 3}%`}>
                    <Stack isInline>
                        <FormControl flexBasis="50%">
                            <FormLabel htmlFor="startingYear">Starting Year</FormLabel>

                            <NumberInput
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

                    <FormControl flexBasis="50%">
                        <FormLabel htmlFor="targetRetirementIncome">Target Retirement Income ($)</FormLabel>
                        <NumberInput min={0} step={5000} defaultValue={40000} onChange={console.log}>
                            <NumberInputField id="targetRetirementIncome" />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </FormControl>
                </FilterSection>

                <FilterSection title="Incomes" bg="#F8F9FC" paddingX={0} flexBasis={`${100 / 3}%`}>
                    <Stack flex="1" justifyContent="space-between">
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

                <FilterSection title="Expenses" paddingX={0} flexBasis={`${100 / 3}%`}>
                    <Stack flex="1" justifyContent="space-between">
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

            <Modal isOpen={isOpen} closeOnOverlayClick={false} onClose={onClose}>
                <ModalOverlay />
                <EditCashFlowDialog
                    title={dialogTitle}
                    cashFlow={activeCashFlow}
                    onCancel={onClose}
                    onSave={handleDialogSave}
                />
            </Modal>
        </>
    );
};

export default Filters;
