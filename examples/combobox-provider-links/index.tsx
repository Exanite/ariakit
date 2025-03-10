import "./style.css";
import { startTransition, useMemo, useState } from "react";
import * as Ariakit from "@ariakit/react";
import { ComboboxProvider } from "@ariakit/react-core/combobox/combobox-provider";
import { matchSorter } from "match-sorter";
import { NewWindow } from "./icons.jsx";

const links = [
  {
    href: "https://twitter.com/ariakitjs",
    children: "Twitter",
    target: "_blank",
  },
  {
    href: "https://www.facebook.com/ariakitjs",
    children: "Facebook",
    target: "_blank",
  },
  {
    href: "https://www.instagram.com/ariakitjs",
    children: "Instagram",
    target: "_blank",
  },
  { href: "https://ariakit.org", children: "Ariakit.org" },
];

export default function Example() {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const matches = useMemo(() => {
    return matchSorter(links, searchValue, {
      keys: ["children"],
      baseSort: (a, b) => (a.index < b.index ? -1 : 1),
    });
  }, [searchValue]);

  return (
    <div className="wrapper">
      <ComboboxProvider
        open={open}
        setOpen={setOpen}
        setValue={(value) => startTransition(() => setSearchValue(value))}
      >
        <label className="label">
          Links
          <Ariakit.Combobox
            placeholder="e.g., Twitter"
            className="combobox"
            autoSelect
          />
        </label>
        {open && (
          <Ariakit.ComboboxPopover gutter={4} sameWidth className="popover">
            {matches.length ? (
              matches.map(({ children, ...props }) => (
                <Ariakit.ComboboxItem
                  key={children}
                  focusOnHover
                  hideOnClick
                  className="combobox-item"
                  render={<a {...props} />}
                >
                  {children}
                  {props.target === "_blank" && (
                    <NewWindow className="combobox-item-icon" />
                  )}
                </Ariakit.ComboboxItem>
              ))
            ) : (
              <div className="no-results">No results found</div>
            )}
          </Ariakit.ComboboxPopover>
        )}
      </ComboboxProvider>
    </div>
  );
}
