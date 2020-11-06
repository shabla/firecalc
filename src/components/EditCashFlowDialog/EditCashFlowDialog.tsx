import React, { useState } from "react";
import {
    Text,
    Radio,
    Button,
    Heading,
    InputGroup,
    InputRightElement,
    FormControl,
    FormLabel,
    Select,
    Input,
    Stack,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
} from "@chakra-ui/core";

import { RecurrenceType, RecurrenceUntilType, FrequencyScope } from "values";
import { CashFlow } from "models";

import "./EditCashFlowDialog.scss";

interface EditCashFlowDialogProps {
    title: string;
    cashFlow?: CashFlow;
    onCancel: () => void;
    onSave: (cashFlow: CashFlow) => void;
}

export const EditCashFlowDialog: React.FC<EditCashFlowDialogProps> = ({ title, cashFlow, onCancel, onSave }) => {
    const [name, setName] = useState<string>(cashFlow?.name || "");
    const [amount, setAmount] = useState<string>(cashFlow?.amount != null ? `${cashFlow?.amount}` : "");
    const [recurrenceType, setRecurrenceType] = useState<string>(cashFlow?.recurrenceType || RecurrenceType.Once);
    const [year, setYear] = useState<string>(`${cashFlow?.year || new Date().getFullYear()}`);
    const [frequency, setFrequency] = useState<string>(cashFlow?.frequency != null ? `${cashFlow.frequency}` : "1");
    const [frequencyScope, setFrequencyScope] = useState<string>(cashFlow?.frequencyScope || FrequencyScope.Year);
    const [untilType, setUntilType] = useState<string>(cashFlow?.untilType || RecurrenceUntilType.Forever);
    const [untilYear, setUntilYear] = useState<string>(`${cashFlow?.untilYear || new Date().getFullYear()}`);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value);
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.currentTarget.value);
    const handleSourceTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => setRecurrenceType(e.currentTarget.value);
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => setYear(e.currentTarget.value);
    const handleUntilYearChange = (e: React.ChangeEvent<HTMLInputElement>) => setUntilYear(e.currentTarget.value);
    const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => setFrequency(e.currentTarget.value);
    const handleUntilTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => setUntilType(e.currentTarget.value);
    const handleFrequencyScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setFrequencyScope(e.currentTarget.value);

    const handleSave = () => {
        const hasName = name !== "";
        const hasAmount = amount !== "";
        const hasYear = year !== "";
        const hasFrequency = frequency !== "";
        const isRecurring = recurrenceType === RecurrenceType.Recurring;
        const isUntilYear = untilType === RecurrenceUntilType.Year;
        const hasUntilYear = untilYear !== "";

        // Needed in all recurrence types
        if (!hasName || !hasAmount || !hasYear) {
            return;
        }

        // Needed for Recurring
        if (isRecurring && !hasFrequency && !(isUntilYear && !hasUntilYear)) {
            return;
        }

        onSave({
            ...cashFlow,
            name,
            amount: parseInt(amount),
            recurrenceType,
            year: parseInt(year),
            frequency: isRecurring ? parseInt(frequency) : undefined,
            frequencyScope: isRecurring ? frequencyScope : undefined,
            untilType: isRecurring ? untilType : undefined,
            untilYear: isRecurring && isUntilYear ? parseInt(untilYear) : undefined,
        });
    };

    const getFrequencyScopeLabel = (freqScope: FrequencyScope) => {
        const plural = parseInt(frequency) > 1 ? "s" : "";
        return `${freqScope.slice(0, 1).toUpperCase()}${freqScope.slice(1)}${plural}`;
    };

    const isRecurring = recurrenceType === RecurrenceType.Recurring;

    return (
        <ModalContent>
            <ModalHeader>
                <Heading size="lg" textAlign="center">
                    {title}
                </Heading>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl isRequired>
                    <Stack isInline alignItems="center">
                        <FormLabel flex="0 0 120px">Description</FormLabel>
                        <Input type="text" isRequired isFullWidth value={name} onChange={handleNameChange} autoFocus />
                    </Stack>
                </FormControl>

                <FormControl isRequired marginTop="15px">
                    <Stack isInline alignItems="center">
                        <FormLabel flex="0 0 120px">Amount</FormLabel>
                        <InputGroup flex="1">
                            <Input type="number" isFullWidth isRequired value={amount} onChange={handleAmountChange} />
                            <InputRightElement children="$" />
                        </InputGroup>
                    </Stack>
                </FormControl>

                <FormControl isRequired marginTop="15px">
                    <FormLabel>Recurrence</FormLabel>

                    <Stack isInline marginTop="0px" className={"recurrence-type" + (!isRecurring ? " selected" : "")}>
                        <Radio
                            isChecked={!isRecurring}
                            value={RecurrenceType.Once}
                            onChange={handleSourceTypeChange}
                            fontWeight="semibold"
                            flex="0 0 120px"
                            marginRight={0}
                        >
                            One time
                        </Radio>

                        <Text alignSelf="center" flex="0 0 70px" color={isRecurring ? "gray.300" : undefined}>
                            in year
                        </Text>

                        <Input
                            type="string"
                            value={year}
                            flexBasis="auto"
                            isDisabled={isRecurring}
                            onChange={handleYearChange}
                        />
                    </Stack>

                    <Stack isInline marginTop="15px" className={"recurrence-type" + (isRecurring ? " selected" : "")}>
                        <Radio
                            isChecked={isRecurring}
                            value={RecurrenceType.Recurring}
                            onChange={handleSourceTypeChange}
                            fontWeight="semibold"
                            flex="0 0 120px"
                            marginRight={0}
                        >
                            Recurring
                        </Radio>

                        <Stack>
                            <Stack isInline>
                                <Text alignSelf="center" flex="0 0 70px" color={!isRecurring ? "gray.300" : undefined}>
                                    every
                                </Text>

                                <Input
                                    type="number"
                                    value={frequency}
                                    isDisabled={!isRecurring}
                                    onChange={handleFrequencyChange}
                                    flexBasis="35%"
                                />

                                <Select
                                    value={frequencyScope}
                                    onChange={handleFrequencyScopeChange}
                                    isDisabled={!isRecurring}
                                    flexBasis="65%"
                                >
                                    <option value={FrequencyScope.Day}>
                                        {getFrequencyScopeLabel(FrequencyScope.Day)}
                                    </option>
                                    <option value={FrequencyScope.Week}>
                                        {getFrequencyScopeLabel(FrequencyScope.Week)}
                                    </option>
                                    <option value={FrequencyScope.Month}>
                                        {getFrequencyScopeLabel(FrequencyScope.Month)}
                                    </option>
                                    <option value={FrequencyScope.Year}>
                                        {getFrequencyScopeLabel(FrequencyScope.Year)}
                                    </option>
                                </Select>
                            </Stack>

                            <Stack isInline>
                                <Text alignSelf="center" flex="0 0 70px" color={!isRecurring ? "gray.300" : undefined}>
                                    starting
                                </Text>

                                <Input
                                    type="number"
                                    value={year}
                                    onChange={handleYearChange}
                                    isDisabled={!isRecurring}
                                />
                            </Stack>

                            <Stack isInline>
                                <Text alignSelf="center" flex="0 0 70px" color={!isRecurring ? "gray.300" : undefined}>
                                    until
                                </Text>

                                <Stack>
                                    <Radio
                                        isChecked={untilType === RecurrenceUntilType.Forever}
                                        value={RecurrenceUntilType.Forever}
                                        onChange={handleUntilTypeChange}
                                        isDisabled={!isRecurring}
                                    >
                                        forever
                                    </Radio>

                                    <Radio
                                        isChecked={untilType === RecurrenceUntilType.Goal}
                                        value={RecurrenceUntilType.Goal}
                                        onChange={handleUntilTypeChange}
                                        isDisabled={!isRecurring}
                                    >
                                        goal reached
                                    </Radio>

                                    <Stack isInline>
                                        <Radio
                                            isChecked={untilType === RecurrenceUntilType.Year}
                                            value={RecurrenceUntilType.Year}
                                            onChange={handleUntilTypeChange}
                                            isDisabled={!isRecurring}
                                        >
                                            year
                                        </Radio>

                                        <Input
                                            type="number"
                                            size="sm"
                                            value={untilYear}
                                            onChange={handleUntilYearChange}
                                            isDisabled={!isRecurring || untilType !== RecurrenceUntilType.Year}
                                        />
                                    </Stack>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Stack>
                </FormControl>
            </ModalBody>

            <ModalFooter>
                <Button onClick={onCancel} marginRight="10px">
                    Cancel
                </Button>
                <Button onClick={handleSave} variantColor="blue">
                    Save
                </Button>
            </ModalFooter>
        </ModalContent>
    );
};

export default EditCashFlowDialog;
