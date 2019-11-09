import React, { useState, useEffect } from "react";
import { Stack, Box } from "@chakra-ui/core";

import FiltersMisc from "./FiltersMisc";
import Incomes from "./Incomes";
import Expenses from "./Expenses";

const Filters = ({ onChange, startingYear }) => {
    const [misc, setMisc] = useState({});
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        onChange({ ...misc, incomes, expenses });
    }, [misc, incomes, expenses]);

    return (
        <Stack isInline spacing={8}>
            <FiltersMisc onChange={setMisc} flex="1" />
            <Incomes onChange={setIncomes} startingYear={startingYear} flex="1" />
            {/* <Expenses onChange={setExpenses} startingYear={startingYear} flex="1" /> */}
        </Stack>
    );
};

export default Filters;
