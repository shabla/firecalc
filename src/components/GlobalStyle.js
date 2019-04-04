import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    html, body, #root {
        min-height: 100vh;
        font-family: 'Roboto', sans-serif;
    }

    .row-success {
        background-color: rgba(0, 200, 0, 0.1);
    }

    .ant-table-row {
        td {
            white-space: nowrap;
        }
    }
`

export default GlobalStyle;