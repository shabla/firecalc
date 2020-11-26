import React from "react";
import Currency from "react-currency-formatter";
import { IconButton, Stack } from "@chakra-ui/core";

import { CashFlow } from "models";
import { SimpleTable } from "components";
import { RecurrenceStartingType, RecurrenceUntilType } from "values";

export interface CashFlowTableProps {
    items: CashFlow[];
    onEdit?: (cashFlow: CashFlow) => void;
    onDelete?: (cashFlow: CashFlow) => void;
}

export const CashFlowTable: React.FC<CashFlowTableProps> = ({
    items = [],
    onEdit = () => undefined,
    onDelete = () => undefined,
}) => {
    const getFrequencyDescription = (cashFlow: CashFlow): string => {
        if (cashFlow.recurring) {
            const {
                frequency,
                frequencyScope,
                startingType,
                startingValue,
                untilType,
                untilValue,
            } = cashFlow.recurringOptions!;
            const freq = frequency > 1 ? `${frequency} ` : "";
            const freqScope = frequencyScope + (frequency > 1 ? "s" : "");

            const starting =
                {
                    [RecurrenceStartingType.Now]: "now",
                    [RecurrenceStartingType.Goal]: "when goal is reached",
                    [RecurrenceStartingType.Age]: `at age ${startingValue}`,
                    [RecurrenceStartingType.Year]: `in year ${startingValue}`,
                }[startingType] || "";

            const until =
                {
                    [RecurrenceUntilType.Forever]: "",
                    [RecurrenceUntilType.Goal]: " until goal reached",
                    [RecurrenceUntilType.Age]: ` until age ${untilValue}`,
                    [RecurrenceUntilType.Year]: ` until ${untilValue}`,
                }[untilType] || "";

            return `Every ${freq}${freqScope} starting ${starting}${until}`;
        } else {
            return `Once in ${cashFlow.fixedYear}`;
        }
    };

    return (
        <SimpleTable>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Frequency</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {items.map((cashFlow) => {
                    return (
                        <tr key={cashFlow.id}>
                            <td>{cashFlow.name}</td>
                            <td>
                                <Currency quantity={cashFlow.amount} currency="CAD" pattern="###,### !" />
                            </td>
                            <td>{getFrequencyDescription(cashFlow)}</td>
                            <td>
                                <Stack isInline>
                                    <IconButton
                                        size="sm"
                                        aria-label="Edit"
                                        icon="edit"
                                        onClick={() => onEdit(cashFlow)}
                                    />
                                    <IconButton
                                        size="sm"
                                        aria-label="Delete"
                                        icon="delete"
                                        onClick={() => onDelete(cashFlow)}
                                    />
                                </Stack>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </SimpleTable>
    );
};

export default CashFlowTable;
