import styled from "styled-components";

const FormField = styled.label`
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    margin: 5px 0;

    > span {
        display: inline-block;
        margin-right: 20px;
        text-align: right;
        flex-basis: 60%;

        :after {
            content: " :";
        }
    }
`

const FiltersCol = styled.div`
    padding: 5px;
    flex: 1 1 auto;
`

const FiltersColContainer = styled.div`
    display: flex;
    flex-direction: row;
`

const FiltersColTitle = styled.h2`
    text-align: center;
`

export { FormField, FiltersCol, FiltersColContainer, FiltersColTitle };