import * as React from "react";
import { render } from "react-dom";
import App from "./components/App";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

const rootEl = document.getElementById("root");

render(<App />, rootEl);
