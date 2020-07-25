import React, { useState, useEffect } from "react";
import Currency from "react-currency-formatter";
import {
    Text,
    Radio,
    RadioGroup,
    Button,
    Heading,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    FormErrorMessage,
    Icon,
    FormControl,
    FormLabel,
    Select,
    Input,
    Stack,
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
} from "@chakra-ui/core";

// import FiltersMisc from "./FiltersMisc";
// import Incomes from "./Incomes";
// import Expenses from "./Expenses";

import { FilterSection } from "./FilterSection";

interface FiltersProps {
    onChange: (filters: Record<string, any>) => void;
}

enum TargetRetirementIncomeType {
    Percentage = "percentage",
    Fixed = "fixed",
}

const Filters: React.FC<FiltersProps> = ({ onChange }) => {
    const [misc, setMisc] = useState({});
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);

    const { isOpen, onOpen, onClose } = useDisclosure();

    // Misc
    const [startingYear, setStartingYear] = useState<number>(new Date().getFullYear());
    const [age, setAge] = useState<number | undefined>();
    const [initialCapital, setInitialCapital] = useState<number>(0);
    const [triType, setTriType] = useState<string>(TargetRetirementIncomeType.Percentage);
    const [triValue, setTriValue] = useState<number>(4);

    useEffect(() => {
        onChange({ ...misc, incomes, expenses });
    }, [misc, incomes, expenses]);

    return (
        <>
            <Stack isInline spacing={8}>
                <FilterSection title="Misc">
                    <Stack isInline>
                        <FormControl>
                            <FormLabel htmlFor="startingYear">Starting Year</FormLabel>
                            <Input
                                type="number"
                                id="startingYear"
                                value={startingYear}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setStartingYear(parseInt(e.currentTarget.value))
                                }
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="age">Age</FormLabel>
                            <Input
                                type="text"
                                id="age"
                                value={age}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setAge(parseInt(e.currentTarget.value))
                                }
                            />
                        </FormControl>
                    </Stack>

                    <FormControl>
                        <FormLabel htmlFor="initialCapital">Initial Capital</FormLabel>
                        <InputGroup>
                            <Input
                                type="text"
                                id="initialCapital"
                                value={initialCapital}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setInitialCapital(parseInt(e.currentTarget.value))
                                }
                            />
                            <InputRightElement children="$" color="gray.300" />
                        </InputGroup>
                    </FormControl>

                    <FormControl>
                        <FormLabel htmlFor="targetRetirementIncome">Target Retirement Income</FormLabel>
                        <Stack isInline>
                            <Select value={triType} onChange={(e) => setTriType(e.currentTarget.value)}>
                                <option value={TargetRetirementIncomeType.Percentage}>Percentage</option>
                                <option value={TargetRetirementIncomeType.Fixed}>Fixed</option>
                            </Select>

                            <InputGroup>
                                <Input
                                    type="number"
                                    id="triValue"
                                    value={triValue}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setTriValue(parseInt(e.currentTarget.value))
                                    }
                                    isInvalid={
                                        triType === TargetRetirementIncomeType.Percentage
                                            ? triValue > 100 || triValue <= 0
                                            : false
                                    }
                                />
                                <InputRightElement
                                    children={triType === TargetRetirementIncomeType.Percentage ? "%" : "$"}
                                    color="gray.300"
                                />
                            </InputGroup>
                        </Stack>
                    </FormControl>
                </FilterSection>

                <FilterSection title="Incomes" bg="#F8F9FC">
                    <Stack>
                        <Button variantColor="blue" onClick={onOpen}>
                            Add Income
                        </Button>
                    </Stack>
                </FilterSection>

                <FilterSection title="Expenses">
                    <Stack>
                        <Button variantColor="red">Add Expense</Button>
                    </Stack>
                </FilterSection>
            </Stack>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Heading size="lg" textAlign="center">
                            Add Income
                        </Heading>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack isInline>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input type="text" isRequired isFullWidth />
                            </FormControl>
                        </Stack>

                        <Stack isInline>
                            <FormControl>
                                <FormLabel>Amount</FormLabel>
                                <InputGroup>
                                    <Input type="number" isFullWidth value={5000} />
                                    <InputRightElement children="$" />
                                </InputGroup>
                            </FormControl>
                        </Stack>

                        <Stack isInline>
                            <Radio value="once">once</Radio>
                            <Text alignSelf="center">in year</Text>
                            <Input type="text" value="2020" isFullWidth={false} />
                        </Stack>

                        <Stack isInline>
                            <Radio value="recurring">recurring</Radio>
                            <Stack>
                                <Stack isInline>
                                    <Text alignSelf="center">every</Text>
                                    <Input type="number" value={3} />
                                    <Select value="day">
                                        <option value="day">Day</option>
                                        <option value="week">Week</option>
                                        <option value="month">Month</option>
                                        <option value="year">Year</option>
                                    </Select>
                                </Stack>
                                <Stack isInline>
                                    <Text alignSelf="center">starting</Text>
                                    <Input type="number" value={2020} />
                                </Stack>
                            </Stack>
                        </Stack>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose} marginRight="10px">
                            Cancel
                        </Button>
                        <Button onClick={onClose} variantColor="blue">
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Filters;
