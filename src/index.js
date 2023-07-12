import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <div>
      <div class="container-fluid">
        <h1> React Class Conversion</h1>
        <ul>
          <li>
            Convert this TODO application from a class component into a function
            component using es6 and react hooks.
          </li>
          <li>
            Use{" "}
            <a href="https://styled-components.com/" target="_blank">
              styled components
            </a>{" "}
            for all styles
          </li>
          <li>Create a way to delete multiple selected items</li>
          <li>
            Create a way to save the lists you have created in an organized
            fashion. The ability to resume editing or delete a whole saved list
            is required.
          </li>
          <li>Bonus put your own design flair on this application!</li>
          <li>Have fun!</li>
        </ul>
      </div>
      <hr />
      <App />
    </div>
  </StrictMode>
);
