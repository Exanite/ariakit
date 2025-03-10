import * as Ariakit from "@ariakit/react";
import "./style.css";

export default function Example() {
  const select = Ariakit.useSelectStore({ defaultValue: "Student" });
  return (
    <form className="wrapper">
      <label htmlFor="email">Email</label>
      <input type="email" id="email" name="email" className="input" />
      <Ariakit.SelectLabel store={select}>Role</Ariakit.SelectLabel>
      <Ariakit.Select store={select} name="role" className="button" />
      <Ariakit.SelectPopover store={select} sameWidth className="popover">
        <Ariakit.SelectItem className="select-item" value="Student" />
        <Ariakit.SelectItem className="select-item" value="Tutor" />
        <Ariakit.SelectItem className="select-item" value="Parent" />
      </Ariakit.SelectPopover>
    </form>
  );
}
