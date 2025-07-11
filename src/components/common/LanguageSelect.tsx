"use client";
import React, { useEffect, useRef, useState } from "react";
const languageOptions = [
  { id: "en", label: "English" },
  { id: "ar", label: "العربية" },
  { id: "zh", label: "简体中文" },
  { id: "ur", label: "اردو" },
];

export default function LanguageSelect({
  parentClassName = "image-select center style-default type-languages",
  topStart = false,
}: {
  parentClassName?: string;
  topStart?: boolean;
}) {
  const [selected, setSelected] = useState(languageOptions[0]);
  const [isDDOpen, setIsDDOpen] = useState(false);
  const languageSelect = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageSelect.current &&
        !languageSelect.current.contains(event.target as Node)
      ) {
        setIsDDOpen(false); // Close the dropdown if click is outside
      }
    };
    // Add the event listener when the component mounts
    document.addEventListener("click", handleClickOutside);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  return (
    <>
      <div
        className={`dropdown bootstrap-select ${parentClassName}  dropup `}
        onClick={() => setIsDDOpen((pre) => !pre)}
        ref={languageSelect}
      >
        <select
          className="image-select center style-default type-languages"
          tabIndex={-1}
        >
          {languageOptions.map((option, i) => (
            <option key={i} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          tabIndex={-1}
          className={`btn dropdown-toggle btn-light  ${
            isDDOpen ? "show" : ""
          } `}
        >
          <div className="filter-option">
            <div className="filter-option-inner">
              <div className="filter-option-inner-inner">{selected.label}</div>
            </div>
          </div>
        </button>
        <div
          className={`dropdown-menu ${isDDOpen ? "show" : ""} `}
          style={{
            maxHeight: "899.688px",
            overflow: "hidden",
            minHeight: 142,
            position: "absolute",
            inset: "auto auto 0px 0px",
            margin: 0,
            transform: `translate(0px, ${topStart ? 22 : -20}px)`,
          }}
          data-popper-placement={`${!topStart ? "top" : "bottom"}-start`}
        >
          <div
            className="inner show"
            style={{
              maxHeight: "869.688px",
              overflowY: "auto",
              minHeight: 112,
            }}
          >
            <ul
              className="dropdown-menu inner show"
              role="presentation"
              style={{ marginTop: 0, marginBottom: 0 }}
            >
              {languageOptions.map((elm, i) => (
                <li
                  key={i}
                  onClick={() => setSelected(elm)}
                  className={`selected ${selected == elm ? "active" : ""}`}
                >
                  <a
                    className={`dropdown-item ${
                      selected == elm ? "active selected" : ""
                    }`}
                  >
                    <span className="text">{elm.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
