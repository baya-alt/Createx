import { useState } from "react";
// import "./filters.css";

export default function FilterBlock({ title, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="filter-block">
      <div className="filter-header" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className="toggle">{open ? "−" : "+"}</span>
      </div>

      {open && <div className="filter-content">{children}</div>}
    </div>
  );
}
