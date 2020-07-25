import React from "react";
import { Box, Heading } from "@chakra-ui/core";

import "./FilterSection.scss";

interface FilterSectionProps {
    title: string;
    bg?: string;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ title, bg = "white", children }) => {
    return (
        <Box flex="1" bg={bg} paddingX="25px" paddingY="30px">
            <Heading size="lg" textAlign="center" marginBottom="10px">{title}</Heading>
            {children}
        </Box>
    );
};

export default FilterSection;
