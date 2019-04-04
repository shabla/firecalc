import React from "react";
import Radio from "antd/lib/radio"
import "antd/lib/radio/style/css"

const RadioGroup = Radio.Group;

const RadioBlock = ({ style = {}, children, ...rest }) => {
    const radioStyle = {
        display: "block",
        height: "30px",
        lineHeight: "30px",
        ...style
    };

    return (
        <Radio style={radioStyle} {...rest}>
            {children}
        </Radio>
    )
}

export default Radio;
export { Radio, RadioBlock, RadioGroup };