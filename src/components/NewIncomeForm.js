import React, { useState } from "react";
import styled from "styled-components";

import Button from "./Button";
import { Radio, RadioGroup } from "./Radio";
import { Select, Option } from "./Select"
import InputNumber from "./InputNumber"

const StyledNewIncomeForm = styled.div`

    .interval {
        display: flex;
        flex-direction: row;
        margin-bottom: 20px;
        
        .quantity {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
        }

        .frequency {
            flex: 1 1 auto;

            .freq-once {
                display: flex;
                flex-direction: row;
                margin-bottom: 20px;

                .ant-select {
                    width: 120px;
                }
            }

            .freq-every {
                display: flex;
                flex-direction: row;

                .ant-select {
                    width: 80px;
                }
            }
        }
        
    }
`

const NewIncomeForm = ({ freqs, years, onAdd }) => {

    const units = {
        year: "year"
    }

    const [quantity, setQuantity] = useState(1000)
    const [freq, setFreq] = useState(1)
    const [unit, setUnit] = useState(units.year)

    const add = () => {
        onAdd({
            quantity,
            freq,
            unit,
        });
    }

    return (
        <StyledNewIncomeForm>

            <div className="interval">
                <div className="quantity">
                    Receive
                    <InputNumber
                        size="small"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={setQuantity}
                        precision={0}
                        formatter={v => v ? `${v}$` : v}
                        parser={value => value.replace('$', '')}
                        step={100}
                        min={0}
                        max={999999999}
                    />
                </div>

                <div className="frequency">
                    <RadioGroup value={freq} onChange={e => setFreq(e.target.value)}>
                        <div className="freq-once">
                            <Radio value={freqs.YEARLY}>Once</Radio>
                            <Select disabled={freq !== freqs.ONCE} showSearch placeholder="Select a year" size="small">
                                {years.map(year => (
                                    <Option key={year} value={year}>{year}</Option>
                                ))}
                            </Select>
                        </div>

                        <div className="freq-every">
                            <Radio value={freqs.MONTHLY}>Every</Radio>
                            {/* <span style={{ margin: "0 5px", display: "inline-block" }}>per</span> */}


                            <InputNumber size="small" value={freq} onChange={setFreq} />

                            <Select showSearch size="small" value={unit} onChange={v => setUnit(v)}>
                                <Option value="year">year</Option>
                                <Option value="month">month</Option>
                                <Option value="week">week</Option>
                                <Option value="day">day</Option>
                            </Select>
                        </div>
                    </RadioGroup>
                </div>
            </div>

            <Button onClick={add}>Add Income</Button>
        </StyledNewIncomeForm>
    )
}

export default NewIncomeForm;