import React, { useState } from "react";
import {
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormControl,
    FormLabel,
    Heading,
    Box
} from "@chakra-ui/core";

const FiltersMisc = ({ onChange, ...rest }) => {
    const [startingYear, setStartingYear] = useState(2019);
    const [initialCapital, setInitialCapital] = useState(0);
    const [targetRetirementIncome, setTargetRetirementIncome] = useState(40000);

    React.useEffect(() => {
        onChange({
            startingYear: +startingYear,
            initialCapital: +initialCapital,
            targetRetirementIncome: +targetRetirementIncome
        });
    }, [startingYear, initialCapital, targetRetirementIncome]);

    return (
        <Box {...rest}>
            <Heading>Misc</Heading>

            <FormControl>
                <FormLabel htmlFor="starting-year">Starting Year</FormLabel>
                <NumberInput
                    size="sm"
                    min={1900}
                    max={3000}
                    defaultValue={startingYear}
                    onChange={setStartingYear}
                >
                    <NumberInputField id="starting-year" />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="initial-capital">Initial Capital ($)</FormLabel>
                <NumberInput
                    size="sm"
                    step={1000}
                    precision={0}
                    defaultValue={initialCapital}
                    onChange={setInitialCapital}
                >
                    <NumberInputField id="initial-capital" />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="tri">Target Retirement Income ($)</FormLabel>
                <NumberInput
                    size="sm"
                    min={0}
                    step={5000}
                    defaultValue={targetRetirementIncome}
                    onChange={setTargetRetirementIncome}
                >
                    <NumberInputField id="tri" />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
        </Box>
    );
};

export default FiltersMisc;
