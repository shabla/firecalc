import React from "react";
import Currency from "react-currency-formatter";
import { IconButton, Stack } from "@chakra-ui/core";

import { CashFlow } from "models";
import { SimpleTable } from "components";
import { RecurrenceType } from "values";

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
        if (cashFlow.recurrenceType === RecurrenceType.Once) {
            return `Once in ${cashFlow.year}`;
        } else if (cashFlow.recurrenceType === RecurrenceType.Recurring) {
            const freq = cashFlow.frequency && cashFlow.frequency > 1 ? `${cashFlow.frequency} ` : "";
            const freqScope =
                cashFlow.frequencyScope + (cashFlow.frequency && cashFlow.frequency > 1 ? "s" : "");
            return `Every ${freq}${freqScope} starting in ${cashFlow.year}`;
        }
        return "";
    };

    return (
        <SimpleTable>
            <thead>
                <tr>
                    <th className="spacer"></th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Frequency</th>
                    <th></th>
                    <th className="spacer"></th>
                </tr>
            </thead>
            <tbody>
                {items.map((cashFlow) => {
                    return (
                        <tr key={cashFlow.id}>
                            <td className="spacer"></td>
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
                            <td className="spacer"></td>
                        </tr>
                    );
                })}
            </tbody>
        </SimpleTable>
    );
};

export default CashFlowTable;
