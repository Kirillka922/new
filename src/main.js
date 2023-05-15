import React from "react";
import ReactDom from "react-dom";
import App from "./app";
import style from "./style.module.css";

ReactDom.render(
  <div className="some">
    <App />
  </div>,
  document.querySelector(".app")
);
import "bootstrap/dist/css/bootstrap.min.css";
