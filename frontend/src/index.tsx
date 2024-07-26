import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";

const queryClient = new QueryClient();
const tmp: string | null = localStorage.getItem("authorId");
let authorId: string;
if (tmp === null) {
  authorId = uuidv4();
  localStorage.setItem("authorId", authorId);
} else {
  authorId = tmp as string;
}

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App authorId={authorId} />
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
