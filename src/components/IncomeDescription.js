import React from "react";
import { Text } from "@chakra-ui/core";

const TIME_SCALE = {
    day: {
        name: "day",
        multiplier: 365
    },
    week: {
        name: "week",
        multiplier: 52
    },
    month: {
        name: "month",
        multiplier: 12
    },
    year: {
        name: "year",
        multiplier: 1
    }
};

const IncomeDescription = ({
    amount,
    isRecurring,
    targetYear,
    recurringFrequency,
    recurringScale,
    startingFromYear
}) => {
    const composeDescription = () => {
        if (!isRecurring) {
            return `You will receive ${+amount}$ once in ${targetYear}.`;
        }
        const scale = TIME_SCALE[recurringScale];
        const showTotal = scale.name !== "year" || (scale.name === "year" && recurringFrequency !== 1);
        const yearlyTotal = amount * (scale.multiplier / recurringFrequency);
        const totalString = showTotal ? `(${yearlyTotal}$ per year) ` : "";

        return `You will receive ${+amount}$ every ${recurringFrequency} ${recurringScale} ${totalString}starting from ${startingFromYear}.`;
    };

    return <Text>{composeDescription()}</Text>;
};

export default IncomeDescription;
