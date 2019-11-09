import React, { useState } from "react";
import { Heading, Box } from "@chakra-ui/core";

import FrequencyInput from "./FrequencyInput";

const Expenses = ({ onChange, ...rest }) => {
    const [expenses, setExpenses] = useState([]);

    React.useEffect(() => {
        onChange(expenses);
    }, [expenses]);

    return (
        <Box {...rest}>
            <Heading>Expenses</Heading>
            <FrequencyInput />
        </Box>
    );
};

export default Expenses;
