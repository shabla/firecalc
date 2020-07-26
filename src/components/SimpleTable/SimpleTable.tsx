import React from "react";

import "./SimpleTable.scss";

export interface SimpleTableProps {
    className?: string;
}

export const SimpleTable: React.FC<SimpleTableProps> = ({ children, className = "", ...rest }) => {
    return (
        <table className={"simple-table " + className} {...rest}>
            {children}
        </table>
    );
};

export default SimpleTable;
