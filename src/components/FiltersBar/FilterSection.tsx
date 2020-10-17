import React from "react";
import { Stack, StackProps, Heading } from "@chakra-ui/core";

interface FilterSectionProps extends StackProps {
    title: string;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ title, bg = "white", children, ...rest }) => {
    return (
        <>
            <Stack>
                <Heading size="lg" textAlign="center" bg="#2b2e35" color="white" padding="10px">
                    {title}
                </Heading>
            </Stack>

            <Stack bg={bg} {...rest}>
                {children}
            </Stack>
        </>
    );
};

export default FilterSection;
