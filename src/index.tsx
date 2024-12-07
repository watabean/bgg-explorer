import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { StyledEngineProvider } from "@mui/material/styles";
import DataGridBGG from "./DataGridBGG";

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <DataGridBGG />
    </StyledEngineProvider>
  </React.StrictMode>
);
