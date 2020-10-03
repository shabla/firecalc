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

import { RecurrenceType, FrequencyScope } from "values";
import { CashFlow } from "models";

interface EditCashFlowDialogProps {
    title: string;
    cashFlow?: CashFlow;
    onCancel: () => void;
    onSave: (cashFlow: CashFlow) => void;
}

export const EditCashFlowDialog: React.FC<EditCashFlowDialogProps> = ({
    title,
    cashFlow,
    onCancel,
    onSave,
}) => {
    const [name, setName] = useState<string>(cashFlow?.name || "");
    const [amount, setAmount] = useState<string>(cashFlow?.amount + "" || "");
    const [recurrenceType, setRecurrenceType] = useState<string>(
        cashFlow?.recurrenceType || RecurrenceType.Once
    );
    const [year, setYear] = useState<string>(`${cashFlow?.year || new Date().getFullYear()}`);
    const [frequency, setFrequency] = useState<string>(cashFlow?.frequency + "" || "");
    const [frequencyScope, setFrequencyScope] = useState<string>(
        cashFlow?.frequencyScope || FrequencyScope.Day
    );

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value);
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.currentTarget.value);
    const handleSourceTypeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setRecurrenceType(e.currentTarget.value);
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => setYear(e.currentTarget.value);
    const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setFrequency(e.currentTarget.value);
    const handleFrequencyScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setFrequencyScope(e.currentTarget.value);

    const handleSave = () => {
        const hasName = name !== "";
        const hasAmount = amount !== "";
        const hasYear = year !== "";
        const hasFrequency = frequency !== "";
        const isRecurring = recurrenceType === RecurrenceType.Recurring;

        // Needed in all recurrence types
        if (!hasName || !hasAmount || !hasYear) {
            return;
        }

        // Needed for Recurring
        if (isRecurring && !hasFrequency) {
            return;
        }

        onSave({
            name,
            amount: parseInt(amount),
            recurrenceType,
            year: parseInt(year),
            frequency: isRecurring ? parseInt(frequency) : undefined,
            frequencyScope: isRecurring ? frequencyScope : undefined,
        });
    };

    const getFrequencyScopeLabel = (freqScope: FrequencyScope) => {
        const plural = parseInt(frequency) > 1 ? "s" : "";
        return `${freqScope.slice(0, 1).toUpperCase()}${freqScope.slice(1)}${plural}`;
    };

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
                        <Input
                            type="text"
                            isRequired
                            isFullWidth
                            value={name}
                            onChange={handleNameChange}
                            autoFocus
                        />
                    </Stack>
                </FormControl>

                <FormControl isRequired marginTop="15px">
                    <Stack isInline alignItems="center">
                        <FormLabel flex="0 0 120px">Amount</FormLabel>
                        <InputGroup flex="1">
                            <Input
                                type="number"
                                isFullWidth
                                isRequired
                                value={amount}
                                onChange={handleAmountChange}
                            />
                            <InputRightElement children="$" />
                        </InputGroup>
                    </Stack>
                </FormControl>

                <FormControl isRequired marginTop="15px">
                    <FormLabel>Recurrence</FormLabel>

                    <Stack isInline marginTop="0px">
                        <Radio
                            isChecked={recurrenceType === RecurrenceType.Once}
                            value={RecurrenceType.Once}
                            onChange={handleSourceTypeChange}
                            fontWeight="semibold"
                            flex="0 0 120px"
                            marginRight={0}
                        >
                            One time
                        </Radio>

                        <Text
                            alignSelf="center"
                            flex="0 0 70px"
                            color={recurrenceType !== RecurrenceType.Once ? "gray.300" : undefined}
                        >
                            in year
                        </Text>

                        <Input
                            type="text"
                            value={year}
                            flexBasis="auto"
                            isDisabled={recurrenceType !== RecurrenceType.Once}
                            onChange={handleYearChange}
                        />
                    </Stack>

                    <Stack isInline marginTop="20px">
                        <Radio
                            isChecked={recurrenceType === RecurrenceType.Recurring}
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
                                <Text
                                    alignSelf="center"
                                    flex="0 0 70px"
                                    color={
                                        recurrenceType !== RecurrenceType.Recurring ? "gray.300" : undefined
                                    }
                                >
                                    every
                                </Text>

                                <Input
                                    type="number"
                                    value={frequency}
                                    isDisabled={recurrenceType !== RecurrenceType.Recurring}
                                    onChange={handleFrequencyChange}
                                    flexBasis="35%"
                                />

                                <Select
                                    value={frequencyScope}
                                    onChange={handleFrequencyScopeChange}
                                    isDisabled={recurrenceType !== RecurrenceType.Recurring}
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
                                <Text
                                    alignSelf="center"
                                    flex="0 0 70px"
                                    color={
                                        recurrenceType !== RecurrenceType.Recurring ? "gray.300" : undefined
                                    }
                                >
                                    starting
                                </Text>
                                <Input
                                    type="number"
                                    value={year}
                                    onChange={handleYearChange}
                                    isDisabled={recurrenceType !== RecurrenceType.Recurring}
                                />
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
