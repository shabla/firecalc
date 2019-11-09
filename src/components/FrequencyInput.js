import React, { useEffect, useState, useRef } from "react";
import { Select, NumberInput, NumberInputField, Radio, Text, Stack, Box, Button } from "@chakra-ui/core";

import IncomeDescription from "./IncomeDescription";

const TIME_SCALES = ["day", "week", "month", "year"];

const FiltersIncomes = ({ onSave, minYear }) => {
    const [amount, setAmount] = useState(1);
    const [isRecurring, setIsRecurring] = useState(false);
    const [targetYear, setTargetYear] = useState(minYear);
    const [recurringFrequency, setRecurringFrequency] = useState(1);
    const [recurringStartingFromYear, setRecurringStartingFromYear] = useState(minYear);
    const [recurringScale, setRecurringScale] = useState(TIME_SCALES[0]);

    const amountField = useRef(null);
    const targetYearField = useRef(null);
    const recurringFrequencyField = useRef(null);

    useEffect(() => {
        amountField.current.focus();
    }, []);

    useEffect(() => {
        if (isRecurring) {
            recurringFrequencyField.current.focus();
        } else {
            targetYearField.current.focus();
        }
    }, [isRecurring]);

    const save = () => {
        const income = {
            amount: +amount,
            isRecurring
        };
        if (isRecurring) {
            income.recurringFrequency = +recurringFrequency;
            income.recurringScale = recurringScale;
            income.startingFromYear = +recurringStartingFromYear;
        } else {
            income.targetYear = +targetYear;
        }
        onSave(income);
    };

    return (
        <Box>
            <Stack spacing="1rem">
                {/* Amount */}
                <Stack isInline align="center">
                    <Text>Receive</Text>
                    <NumberInput size="sm" min={1} defaultValue={amount} onChange={setAmount}>
                        <NumberInputField variant="filled" isFullWidth={false} ref={amountField} />
                    </NumberInput>
                    <Text>$</Text>
                </Stack>

                {/* Single amount */}
                <Stack isInline align="center">
                    <Radio onChange={e => setIsRecurring(false)} isChecked={!isRecurring}>
                        once
                    </Radio>
                    <Text paddingLeft="20px">in year</Text>
                    <NumberInput
                        size="sm"
                        min={minYear}
                        defaultValue={targetYear}
                        onChange={setTargetYear}
                        isDisabled={isRecurring}
                    >
                        <NumberInputField variant="filled" isFullWidth={false} ref={targetYearField} />
                    </NumberInput>
                </Stack>

                {/* Recurring amount */}
                <Box>
                    <Radio onChange={e => setIsRecurring(true)} isChecked={isRecurring}>
                        recurring
                    </Radio>

                    <Box paddingLeft="20px">
                        <Stack isInline>
                            <Text>every</Text>
                            <NumberInput
                                size="sm"
                                width="50px"
                                min={1}
                                defaultValue={recurringFrequency}
                                onChange={setRecurringFrequency}
                                isDisabled={!isRecurring}
                            >
                                <NumberInputField
                                    variant="filled"
                                    isFullWidth={false}
                                    ref={recurringFrequencyField}
                                />
                            </NumberInput>

                            <Select
                                size="sm"
                                onChange={e => setRecurringScale(e.target.value)}
                                isDisabled={!isRecurring}
                            >
                                {TIME_SCALES.map(scale => (
                                    <option value={scale} key={scale}>
                                        {scale}
                                    </option>
                                ))}
                            </Select>
                        </Stack>

                        <Stack isInline>
                            <Text>starting from</Text>
                            <NumberInput
                                size="sm"
                                min={minYear}
                                defaultValue={recurringStartingFromYear}
                                onChange={setRecurringStartingFromYear}
                                isDisabled={!isRecurring}
                            >
                                <NumberInputField isFullWidth={false} />
                            </NumberInput>
                        </Stack>
                    </Box>
                </Box>

                <IncomeDescription
                    amount={amount}
                    isRecurring={isRecurring}
                    targetYear={targetYear}
                    recurringFrequency={recurringFrequency}
                    recurringScale={recurringScale}
                    startingFromYear={recurringStartingFromYear}
                />

                <Button onClick={save}>Add</Button>
            </Stack>
        </Box>
    );
};

export default FiltersIncomes;
