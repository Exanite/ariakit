import * as Core from "@ariakit/core/checkbox/checkbox-store";
import type { PickRequired } from "@ariakit/core/utils/types";
import { useUpdateEffect } from "../utils/hooks.js";
import type { Store } from "../utils/store.js";
import { useStore, useStoreProps } from "../utils/store.js";

type Value = Core.CheckboxStoreValue;

export function useCheckboxStoreProps<T extends Core.CheckboxStore>(
  store: T,
  update: () => void,
  props: CheckboxStoreProps,
) {
  useUpdateEffect(update, [props.store]);
  useStoreProps(store, props, "value", "setValue");
  return store;
}

/**
 * Creates a checkbox store.
 * @see https://ariakit.org/components/checkbox
 * @example
 * ```jsx
 * const checkbox = useCheckboxStore({ defaultValue: true });
 * <Checkbox store={checkbox} />
 * ```
 */

export function useCheckboxStore<T extends Value = Value>(
  props: PickRequired<CheckboxStoreProps<T>, "value" | "defaultValue">,
): CheckboxStore<T>;

export function useCheckboxStore(props?: CheckboxStoreProps): CheckboxStore;

export function useCheckboxStore(
  props: CheckboxStoreProps = {},
): CheckboxStore {
  const [store, update] = useStore(Core.createCheckboxStore, props);
  return useCheckboxStoreProps(store, update, props);
}

export type CheckboxStoreValue = Core.CheckboxStoreValue;

export type CheckboxStoreState<T extends Value = Value> =
  Core.CheckboxStoreState<T>;

export type CheckboxStoreFunctions<T extends Value = Value> =
  Core.CheckboxStoreFunctions<T>;

export interface CheckboxStoreOptions<T extends Value = Value>
  extends Core.CheckboxStoreOptions<T> {
  /**
   * A callback that gets called when the `value` state changes.
   * @param value The new value.
   * @example
   * function MyCheckbox({ value, onChange }) {
   *   const checkbox = useCheckboxStore({ value, setValue: onChange });
   * }
   */
  setValue?: (value: CheckboxStoreState<T>["value"]) => void;
}

export interface CheckboxStoreProps<T extends Value = Value>
  extends CheckboxStoreOptions<T>,
    Core.CheckboxStoreProps<T> {}

export interface CheckboxStore<T extends Value = Value>
  extends CheckboxStoreFunctions<T>,
    Store<Core.CheckboxStore<T>> {}
