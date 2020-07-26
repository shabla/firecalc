import React from "react";
import { Stack, StackProps, Heading } from "@chakra-ui/core";

interface FilterSectionProps extends StackProps {
    title: string;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ title, bg = "white", children, ...rest }) => {
    return (
        <Stack flex="1" bg={bg} paddingTop="10px" {...rest}>
            <Heading size="lg" textAlign="center" marginBottom="10px">
                {title}
            </Heading>
            {children}
        </Stack>
    );
};

export default FilterSection;
