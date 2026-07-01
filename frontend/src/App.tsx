import { RouterProvider } from "react-router/dom";
import { router } from "./router";

export default function App() {
  return (
    <>
      <div aria-hidden="true" className="rm-space-bg">
        <div className="rm-nebula" />
        <div className="rm-stars" />
        <div className="rm-portal-motif" />
      </div>
      <RouterProvider router={router} />
    </>
  );
}
