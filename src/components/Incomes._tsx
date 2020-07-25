import React, { useState } from "react";
import { Heading, Box } from "@chakra-ui/core";

import FrequencyInput from "./FrequencyInput";

const Incomes = ({ onChange, startingYear, ...rest }) => {
    const [incomes, setIncomes] = useState([]);

    React.useEffect(() => {
        onChange(incomes);
    }, [incomes]);

    const addIncome = income => {
        setIncomes([...incomes, income]);
    };

    return (
        <Box {...rest}>
            <Heading>Incomes</Heading>
            <FrequencyInput minYear={startingYear} onSave={addIncome} />
        </Box>
    );
};

export default Incomes;
