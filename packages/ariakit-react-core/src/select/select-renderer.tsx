import type { ComponentPropsWithRef } from "react";
import { useContext, useMemo } from "react";
import { toArray } from "@ariakit/core/utils/array";
import { invariant } from "@ariakit/core/utils/misc";
import {
  getCompositeRendererItem,
  getCompositeRendererItemId,
  useCompositeRenderer,
} from "../composite/composite-renderer.js";
import type {
  CompositeRendererBaseItemProps,
  CompositeRendererItem,
  CompositeRendererItemObject,
  CompositeRendererItemProps,
  CompositeRendererOptions,
} from "../composite/composite-renderer.js";
import { createElement, forwardRef } from "../utils/system.js";
import { SelectContext } from "./select-context.js";
import type { SelectStore, SelectStoreValue } from "./select-store.js";

interface ItemObject extends CompositeRendererItemObject {
  value?: string;
}

type Item = ItemObject | CompositeRendererItem;

type BaseItemProps = CompositeRendererBaseItemProps;

type ItemProps<
  T extends Item,
  P extends BaseItemProps = BaseItemProps
> = CompositeRendererItemProps<T, P>;

function getItemObject(item: Item): ItemObject {
  if (!item || typeof item !== "object") {
    return { value: `${item}` };
  }
  return item;
}

function findIndicesByValue<V extends SelectStoreValue>(
  items: readonly Item[],
  value: V
): number[] {
  const values = toArray(value);
  const indices: number[] = [];

  for (const [index, item] of items.entries()) {
    if (indices.length === values.length) break;

    const object = getItemObject(item);

    if (object.value != null && values.includes(object.value)) {
      indices.push(index);
    } else if (object.items?.length) {
      const childIndices = findIndicesByValue(object.items, value);
      if (childIndices.length) {
        indices.push(index);
      }
    }
  }

  return indices;
}

function useSelectRenderer<T extends Item = any>({
  store,
  orientation: orientationProp,
  persistentIndices: persistentIndicesProp,
  ...props
}: SelectRendererProps<T>) {
  const context = useContext(SelectContext);
  store = store || context;

  invariant(
    store,
    process.env.NODE_ENV !== "production" &&
      "SelectRenderer must be wrapped in a SelectPopover or SelectList component"
  );

  const items = store.useState((state) =>
    state.mounted ? props.items ?? (state.items as T[]) : 0
  );

  const value = store.useState("value");

  const valueIndices = useMemo(() => {
    if (!items) return [];
    if (value == null) return [];
    if (typeof items === "number") return [];
    if (!items.length) return [];
    return findIndicesByValue(items, value);
  }, [items, value]);

  const persistentIndices = useMemo(() => {
    if (persistentIndicesProp) {
      return [...persistentIndicesProp, ...valueIndices];
    }
    return valueIndices;
  }, [valueIndices, persistentIndicesProp]);

  return useCompositeRenderer({
    store,
    persistentIndices,
    ...props,
    items,
  });
}

export const SelectRenderer = forwardRef(function SelectRenderer<
  T extends Item = any
>(props: SelectRendererProps<T>) {
  const htmlProps = useSelectRenderer(props);
  return createElement("div", htmlProps);
});

export {
  getCompositeRendererItem as getSelectRendererItem,
  getCompositeRendererItemId as getSelectRendererItemId,
};

export type SelectRendererItemObject = ItemObject;
export type SelectRendererItem = Item;
export type SelectRendererBaseItemProps = BaseItemProps;
export type SelectRendererItemProps<
  T extends Item,
  P extends BaseItemProps = BaseItemProps
> = ItemProps<T, P>;

export interface SelectRendererOptions<T extends Item = any>
  extends Omit<CompositeRendererOptions<T>, "store"> {
  /**
   * Object returned by the
   * [`useSelectStore`](https://ariakit.org/reference/use-select-store) hook. If
   * not provided, the parent [Select](https://ariakit.org/components/select)
   * component's context will be used.
   *
   * The store [`items`](https://ariakit.org/reference/use-select-store#items)
   * state will be used to render the items if the
   * [`items`](https://ariakit.org/reference/select-items#items) prop is not
   * provided.
   */
  store?: SelectStore & CompositeRendererOptions["store"];
}

export interface SelectRendererProps<T extends Item = any>
  extends Omit<ComponentPropsWithRef<"div">, "children">,
    SelectRendererOptions<T> {}