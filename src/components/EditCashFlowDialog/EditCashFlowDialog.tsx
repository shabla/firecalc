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

import { RecurrenceUntilType, RecurrenceStartingType, FrequencyScope } from "values";
import { CashFlow } from "models";

import "./EditCashFlowDialog.scss";

interface EditCashFlowDialogProps {
    title: string;
    cashFlow?: CashFlow;
    onCancel: () => void;
    onSave: (cashFlow: CashFlow) => void;
}

const getDefaultStartingTypeValue = (type: RecurrenceStartingType): string => {
    if (type === RecurrenceStartingType.Year) {
        return `${new Date().getFullYear()}`;
    }
    return "";
};

export const EditCashFlowDialog: React.FC<EditCashFlowDialogProps> = ({ title, cashFlow, onCancel, onSave }) => {
    const [name, setName] = useState<string>(cashFlow?.name || "");
    const [amount, setAmount] = useState<string>(cashFlow?.amount != null ? `${cashFlow?.amount}` : "");
    const [recurring, setRecurring] = useState<boolean>(cashFlow?.recurring || false);
    const [year, setYear] = useState<string>(`${cashFlow?.fixedYear || new Date().getFullYear()}`);
    const [frequency, setFrequency] = useState<string>(
        cashFlow?.recurringOptions?.frequency != null ? `${cashFlow.recurringOptions?.frequency}` : "1"
    );
    const [frequencyScope, setFrequencyScope] = useState<string>(
        cashFlow?.recurringOptions?.frequencyScope || FrequencyScope.Year
    );
    const [untilType, setUntilType] = useState<string>(
        cashFlow?.recurringOptions?.untilType || RecurrenceUntilType.Forever
    );
    const [untilValue, setUntilValue] = useState<string>(
        `${cashFlow?.recurringOptions?.untilValue || new Date().getFullYear()}`
    );
    const [startingType, setStartingType] = useState<string>(
        cashFlow?.recurringOptions?.startingType || RecurrenceStartingType.Now
    );
    const [startingValue, setStartingValue] = useState<string>(() => {
        if (cashFlow?.recurringOptions?.startingValue) {
            return `${cashFlow?.recurringOptions?.startingValue}`;
        }

        return getDefaultStartingTypeValue(startingType as RecurrenceStartingType);
    });

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value);
    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => setAmount(e.currentTarget.value);
    const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => setYear(e.currentTarget.value);
    const handleUntilYearChange = (e: React.ChangeEvent<HTMLInputElement>) => setUntilValue(e.currentTarget.value);
    const handleFrequencyChange = (e: React.ChangeEvent<HTMLInputElement>) => setFrequency(e.currentTarget.value);
    const handleUntilTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => setUntilType(e.currentTarget.value);
    const handleFrequencyScopeChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
        setFrequencyScope(e.currentTarget.value);
    const handleStartingTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newType = e.currentTarget.value;
        const value = getDefaultStartingTypeValue(newType as RecurrenceStartingType);
        setStartingValue(value);
        setStartingType(newType);
    };
    const handleStartingValueChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setStartingValue(e.currentTarget.value);

    const handleSave = () => {
        const hasName = name !== "";
        const hasAmount = amount !== "";
        const hasYear = year !== "";
        const hasFrequency = frequency !== "";
        const isUntilYear = untilType === RecurrenceUntilType.Year;
        const hasUntilYear = untilValue !== "";

        // Needed in all recurrence types
        if (!hasName || !hasAmount || !hasYear) {
            return;
        }

        // Needed for Recurring
        if (recurring && !hasFrequency && !(isUntilYear && !hasUntilYear)) {
            return;
        }

        let updatedCashFlow: CashFlow = {
            ...cashFlow,
            name,
            amount: parseInt(amount),
            recurring,
        };

        if (recurring) {
            updatedCashFlow.recurringOptions = {
                frequency: parseInt(frequency),
                frequencyScope: frequencyScope as FrequencyScope,
                untilType: untilType as RecurrenceUntilType,
                untilValue: parseInt(untilValue),
                startingType: startingType as RecurrenceStartingType,
                startingValue: parseInt(startingValue),
            };
        } else {
            updatedCashFlow.fixedYear = parseInt(year);
        }

        onSave(updatedCashFlow);
    };

    const getFrequencyScopeLabel = (freqScope: FrequencyScope) => {
        const plural = parseInt(frequency) > 1 ? "s" : "";
        return `${freqScope.slice(0, 1).toUpperCase()}${freqScope.slice(1)}${plural}`;
    };

    return (
        <ModalContent minWidth="550px">
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

                    <Stack isInline marginTop="0px" className={"recurrence-type" + (!recurring ? " selected" : "")}>
                        <Radio
                            isChecked={!recurring}
                            onChange={() => setRecurring(false)}
                            fontWeight="semibold"
                            flex="0 0 120px"
                            marginRight={0}
                        >
                            One time
                        </Radio>

                        <Text alignSelf="center" flex="0 0 70px" color={recurring ? "gray.300" : undefined}>
                            in year
                        </Text>

                        <Input
                            type="number"
                            value={year}
                            isDisabled={recurring}
                            onChange={handleYearChange}
                            flexBasis="auto"
                        />
                    </Stack>

                    <Stack isInline marginTop="15px" className={"recurrence-type" + (recurring ? " selected" : "")}>
                        <Radio
                            isChecked={recurring}
                            onChange={() => setRecurring(true)}
                            fontWeight="semibold"
                            flex="0 0 120px"
                            marginRight={0}
                        >
                            Recurring
                        </Radio>

                        <Stack>
                            <Stack isInline marginBottom="1em">
                                <Text alignSelf="center" flex="0 0 80px" color={!recurring ? "gray.300" : undefined}>
                                    every
                                </Text>

                                <Input
                                    type="number"
                                    value={frequency}
                                    isDisabled={!recurring}
                                    onChange={handleFrequencyChange}
                                    flexBasis="35%"
                                />

                                <Select
                                    value={frequencyScope}
                                    onChange={handleFrequencyScopeChange}
                                    isDisabled={!recurring}
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

                            <Stack isInline marginY="1em" paddingY="1em" borderY="1px solid #efefef">
                                <Text alignSelf="center" flex="0 0 80px" color={!recurring ? "gray.300" : undefined}>
                                    starting
                                </Text>

                                <Stack>
                                    <Radio
                                        isChecked={startingType === RecurrenceStartingType.Now}
                                        value={RecurrenceStartingType.Now}
                                        onChange={handleStartingTypeChange}
                                        isDisabled={!recurring}
                                    >
                                        now
                                    </Radio>

                                    <Radio
                                        isChecked={startingType === RecurrenceStartingType.Goal}
                                        value={RecurrenceStartingType.Goal}
                                        onChange={handleStartingTypeChange}
                                        isDisabled={!recurring}
                                    >
                                        when goal reached
                                    </Radio>

                                    <Stack isInline>
                                        <Radio
                                            isChecked={startingType === RecurrenceStartingType.Age}
                                            value={RecurrenceStartingType.Age}
                                            onChange={handleStartingTypeChange}
                                            isDisabled={!recurring}
                                            flexShrink={0}
                                            flexBasis="35%"
                                        >
                                            at age
                                        </Radio>

                                        <Input
                                            type="number"
                                            size="sm"
                                            flexBasis="65%"
                                            value={startingType === RecurrenceStartingType.Age ? startingValue : ""}
                                            onChange={handleStartingValueChange}
                                            isDisabled={!recurring || startingType !== RecurrenceStartingType.Age}
                                        />
                                    </Stack>

                                    <Stack isInline>
                                        <Radio
                                            isChecked={startingType === RecurrenceStartingType.Year}
                                            value={RecurrenceStartingType.Year}
                                            onChange={handleStartingTypeChange}
                                            isDisabled={!recurring}
                                            flexShrink={0}
                                            flexBasis="35%"
                                        >
                                            year
                                        </Radio>

                                        <Input
                                            type="number"
                                            size="sm"
                                            flexBasis="65%"
                                            value={startingType === RecurrenceStartingType.Year ? startingValue : ""}
                                            onChange={handleStartingValueChange}
                                            isDisabled={!recurring || startingType !== RecurrenceStartingType.Year}
                                        />
                                    </Stack>
                                </Stack>
                            </Stack>

                            <Stack isInline marginTop="1em">
                                <Text alignSelf="center" flex="0 0 80px" color={!recurring ? "gray.300" : undefined}>
                                    until
                                </Text>

                                <Stack>
                                    <Radio
                                        isChecked={untilType === RecurrenceUntilType.Forever}
                                        value={RecurrenceUntilType.Forever}
                                        onChange={handleUntilTypeChange}
                                        isDisabled={!recurring}
                                    >
                                        forever
                                    </Radio>

                                    <Radio
                                        isChecked={untilType === RecurrenceUntilType.Goal}
                                        value={RecurrenceUntilType.Goal}
                                        onChange={handleUntilTypeChange}
                                        isDisabled={!recurring}
                                    >
                                        goal reached
                                    </Radio>

                                    <Stack isInline>
                                        <Radio
                                            isChecked={untilType === RecurrenceUntilType.Year}
                                            value={RecurrenceUntilType.Year}
                                            onChange={handleUntilTypeChange}
                                            isDisabled={!recurring}
                                            flexShrink={0}
                                            flexBasis="35%"
                                        >
                                            year
                                        </Radio>

                                        <Input
                                            type="number"
                                            size="sm"
                                            flexBasis="65%"
                                            value={untilValue}
                                            onChange={handleUntilYearChange}
                                            isDisabled={!recurring || untilType !== RecurrenceUntilType.Year}
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
