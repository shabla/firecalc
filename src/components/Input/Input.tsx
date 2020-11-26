import React, { useState } from "react";
import { Stack, Icon } from "@chakra-ui/core";

import "./Input.scss";

interface InputProps {
    label?: string;
}

export const Input: React.FC<InputProps> = ({ label }) => {
    const [value, setValue] = useState<string>("");

    return (
        <div className="ui-input">
            <button onClick={() => setValue("")}>
                <Icon name="small-close" />
            </button>
            <input type="text" value={value} onChange={(e) => setValue(e.currentTarget.value)} />
            {label && <label>{label}</label>}
        </div>
    );
};

interface PanelProps {
    title?: string;
    desc?: string;
    rightElement?: JSX.Element;
}

export const Panel: React.FC<PanelProps> = ({ children, title, desc, rightElement }) => {
    return (
        <div className="ui-panel">
            {(title || desc) && (
                <header className="ui-panel-header">
                    <Stack direction="row" justifyContent="space-between">
                        {title && <h3>{title}</h3>}
                        {rightElement}
                    </Stack>
                    {desc && <h4>{desc}</h4>}
                </header>
            )}
            <div className="ui-panel-body">{children}</div>
        </div>
    );
};
