import type { MouseEvent as ReactMouseEvent } from "react";
import { useEffect, useRef } from "react";
import { addGlobalEventListener } from "@ariakit/core/utils/events";
import { invariant } from "@ariakit/core/utils/misc";
import type { BooleanOrCallback } from "@ariakit/core/utils/types";
import type { FocusableOptions } from "../focusable/focusable.js";
import { useFocusable } from "../focusable/focusable.js";
import {
  useBooleanEvent,
  useEvent,
  useIsMouseMoving,
  useMergeRefs,
} from "../utils/hooks.js";
import { createComponent, createElement, createHook } from "../utils/system.js";
import type { As, Props } from "../utils/types.js";
import { useHovercardProviderContext } from "./hovercard-context.js";
import type { HovercardStore } from "./hovercard-store.js";

/**
 * Returns props to create a `HovercardAnchor` component.
 * @see https://ariakit.org/components/hovercard
 * @example
 * ```jsx
 * const store = useHovercardStore();
 * const props = useHovercardAnchor({ store });
 * <Role {...props} render={<a />}>@username</Role>
 * <Hovercard store={store}>Details</Hovercard>
 * ```
 */
export const useHovercardAnchor = createHook<HovercardAnchorOptions>(
  ({ store, showOnHover = true, ...props }) => {
    const context = useHovercardProviderContext();
    store = store || context;

    invariant(
      store,
      process.env.NODE_ENV !== "production" &&
        "HovercardAnchor must receive a `store` prop or be wrapped in a HovercardProvider component.",
    );

    const mounted = store.useState("mounted");
    const disabled =
      props.disabled ||
      props["aria-disabled"] === true ||
      props["aria-disabled"] === "true";

    const showTimeoutRef = useRef(0);

    // Clear the show timeout if the anchor is unmounted
    useEffect(() => () => window.clearTimeout(showTimeoutRef.current), []);

    // Clear the show timeout if the mouse leaves the anchor element. We're
    // using the native mouseleave event instead of React's onMouseLeave so we
    // bypass the event.stopPropagation() logic set on the Hovercard component
    // for when the mouse is moving toward the Hovercard.
    useEffect(() => {
      const onMouseLeave = (event: MouseEvent) => {
        if (!store) return;
        const { anchorElement } = store.getState();
        if (!anchorElement) return;
        if (event.target !== anchorElement) return;
        window.clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = 0;
      };
      return addGlobalEventListener("mouseleave", onMouseLeave, true);
    }, [store]);

    const onMouseMoveProp = props.onMouseMove;
    const showOnHoverProp = useBooleanEvent(showOnHover);
    const isMouseMoving = useIsMouseMoving();

    const onMouseMove = useEvent(
      (event: ReactMouseEvent<HTMLAnchorElement>) => {
        store?.setAnchorElement(event.currentTarget);
        onMouseMoveProp?.(event);
        if (disabled) return;
        if (event.defaultPrevented) return;
        if (showTimeoutRef.current) return;
        if (!isMouseMoving()) return;
        if (!store) return;
        if (!showOnHoverProp(event)) return;
        const { showTimeout, timeout } = store.getState();
        showTimeoutRef.current = window.setTimeout(() => {
          showTimeoutRef.current = 0;
          // Let's check again if the mouse is moving. This is to avoid showing
          // the hovercard on mobile clicks or after clicking on the anchor.
          if (!isMouseMoving()) return;
          store?.show();
        }, showTimeout ?? timeout);
      },
    );

    props = {
      ...props,
      ref: useMergeRefs(
        store.setAnchorElement,
        // We need to set the anchor element as the hovercard disclosure
        // disclosure element only when the hovercard is shown so it doesn't get
        // assigned an arbitrary element by the dialog component.
        mounted ? store.setDisclosureElement : undefined,
        props.ref,
      ),
      onMouseMove,
    };

    props = useFocusable(props);

    return props;
  },
);

/**
 * Renders an anchor element that will open a popover (`Hovercard`) on hover.
 * @see https://ariakit.org/components/hovercard
 * @example
 * ```jsx
 * const hovercard = useHovercardStore();
 * <HovercardAnchor store={hovercard}>@username</HovercardAnchor>
 * <Hovercard store={hovercard}>Details</Hovercard>
 * ```
 */
export const HovercardAnchor = createComponent<HovercardAnchorOptions>(
  (props) => {
    const htmlProps = useHovercardAnchor(props);
    return createElement("a", htmlProps);
  },
);

if (process.env.NODE_ENV !== "production") {
  HovercardAnchor.displayName = "HovercardAnchor";
}

export interface HovercardAnchorOptions<T extends As = "a">
  extends FocusableOptions<T> {
  /**
   * Object returned by the `useHovercardStore` hook.
   */
  store?: HovercardStore;
  /**
   * Whether to show the hovercard on mouse move.
   * @default true
   */
  showOnHover?: BooleanOrCallback<ReactMouseEvent<HTMLElement>>;
}

export type HovercardAnchorProps<T extends As = "a"> = Props<
  HovercardAnchorOptions<T>
>;
