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
    IconButton,
    Stack,
    Modal,
    ModalOverlay,
    useDisclosure,
} from "@chakra-ui/core";

import { EditCashFlowDialog } from "../EditCashFlowDialog/EditCashFlowDialog";
import { FilterSection } from "./FilterSection";
import { removeFromList } from "utils";
import { CashFlowTable, Input as MyInput, Panel } from "components";
import { CashFlow, FiltersValues } from "models";
import { getDefaultSettings } from "utils";

import "./FiltersBar.scss";

interface FiltersBarProps {
    defaultValues?: FiltersValues;
    onChange: (filters: FiltersValues) => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({ defaultValues = getDefaultSettings(), onChange }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [dialogTitle, setDialogTitle] = useState<string>("");
    const [activeCashFlow, setActiveCashFlow] = useState<CashFlow | undefined>();

    // Misc
    const [startingYear, setStartingYear] = useState<number>(defaultValues.startingYear);
    const [age, setAge] = useState<number>(defaultValues.age);
    const [initialCapital, setInitialCapital] = useState<number>(defaultValues.initialCapital);
    const [avgYearlyReturns, setAvgYearlyReturns] = useState<number>(defaultValues.avgYearlyReturns);
    const [retirementIncomeTarget, setRetirementIncomeTarget] = useState<number>(defaultValues.retirementIncomeTarget);
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

    // Spendings
    const [spendings, setSpendings] = useState<CashFlow[]>(() =>
        defaultValues.spendings.map((spending) => {
            if (!spending.id) {
                spending.id = uuidv4();
            }
            return spending;
        })
    );

    const handleAddIncome = () => {
        setDialogTitle("Add Income");
        onOpen();
    };

    const handleAddSpending = () => {
        setDialogTitle("Add Spending");
        onOpen();
    };

    const handleDeleteIncome = (cashFlow: CashFlow) => {
        setIncomes(removeFromList(incomes, cashFlow));
    };

    const handleDeleteSpending = (cashFlow: CashFlow) => {
        setSpendings(removeFromList(spendings, cashFlow));
    };

    const handleEditIncome = (cashFlow: CashFlow) => {
        setActiveCashFlow(cashFlow);
        setDialogTitle("Edit Income");
        onOpen();
    };

    const handleEditSpending = (cashFlow: CashFlow) => {
        setActiveCashFlow(cashFlow);
        setDialogTitle("Edit Spending");
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
        } else if ((activeCashFlow && dialogTitle === "Edit Spending") || dialogTitle === "Add Spending") {
            setSpendings(updateCashFlow(spendings, cashFlow));
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
            spendings,
        });
    }, [
        startingYear,
        age,
        initialCapital,
        avgYearlyReturns,
        withdrawalRate,
        retirementIncomeTarget,
        incomes,
        spendings,
        onChange,
    ]);

    return (
        <Stack className="filters-bar" flexBasis="450px">
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
                {/* <Panel title="Misc">
                    <Stack direction="row" spacing={0}>
                        <Stack>
                            <MyInput label="Starting Year" />
                        </Stack>
                        <Stack>
                            <MyInput label="Age" />
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={0}>
                        <Stack>
                            <MyInput label="Initial Capital ($)" />
                        </Stack>
                        <Stack>
                            <MyInput label="Avg Yearly Returns" />
                        </Stack>
                    </Stack>
                    <Stack direction="row" spacing={0}>
                        <Stack>
                            <MyInput label="Withdrawal Rate (%)" />
                        </Stack>
                        <Stack>
                            <MyInput label="Retirement Income Target ($)" />
                        </Stack>
                    </Stack>
                </Panel> */}

                <Panel title="Misc">
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
                            <FormLabel htmlFor="retirementIncomeTarget">Retirement Income Target ($)</FormLabel>
                            <NumberInput
                                min={0}
                                step={5000}
                                defaultValue={retirementIncomeTarget}
                                onChange={(value: React.ReactText) => setRetirementIncomeTarget(value as number)}
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
                </Panel>

                <Panel
                    title="Incomes"
                    rightElement={
                        <IconButton aria-label="Add Income" icon="add" variantColor="gray" onClick={handleAddIncome} />
                    }
                >
                    <Stack>
                        <CashFlowTable items={incomes} onEdit={handleEditIncome} onDelete={handleDeleteIncome} />
                    </Stack>
                </Panel>

                <Panel
                    title="Spendings"
                    rightElement={
                        <IconButton
                            aria-label="Add Spending"
                            icon="add"
                            variantColor="gray"
                            onClick={handleAddSpending}
                        />
                    }
                >
                    <Stack>
                        <CashFlowTable items={spendings} onEdit={handleEditSpending} onDelete={handleDeleteSpending} />
                    </Stack>
                </Panel>
            </Stack>
        </Stack>
    );
};
