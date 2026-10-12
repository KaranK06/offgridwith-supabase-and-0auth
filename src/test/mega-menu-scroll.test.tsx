import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createMemoryHistory,
  createRouter,
  RouterContextProvider,
} from "@tanstack/react-router";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StoreHeader } from "@/components/store/shell";
import { AuthProvider } from "@/lib/store/auth";
import { StoreProvider } from "@/lib/store/context";
import { routeTree } from "@/routeTree.gen";

// The mega menu opens only via its arrow and must drop away as soon as the visitor
// scrolls, so it never floats over content they are moving through. Scrolling
// inside the panel itself is not a page scroll and must keep it open.
const renderHeader = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/"] }),
    context: { queryClient },
  });

  // Same provider order as the real app root (src/routes/__root.tsx).
  return render(
    <RouterContextProvider router={router}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StoreProvider>
            <StoreHeader />
          </StoreProvider>
        </AuthProvider>
      </QueryClientProvider>
    </RouterContextProvider>,
  );
};

describe("Mega menu scroll dismissal", () => {
  it("closes the open Men panel when the page is scrolled", async () => {
    renderHeader();

    fireEvent.click(await screen.findByRole("button", { name: /^Men/ }));
    expect(document.querySelector("#store-mega-menu")).not.toBeNull();

    fireEvent(window, new Event("scroll"));

    await waitFor(() => expect(document.querySelector("#store-mega-menu")).toBeNull());
  });

  it("keeps the clicked menu open when the cursor leaves the header", async () => {
    renderHeader();

    fireEvent.click(await screen.findByRole("button", { name: /^Men/ }));
    expect(document.querySelector("#store-mega-menu")).not.toBeNull();

    // jsdom has no PointerEvent constructor, so hand it the pointer type the
    // handler checks for before it will close the panel.
    const leave = Object.assign(new Event("pointerleave"), { pointerType: "mouse" });
    (document.querySelector(".store-header") as Element).dispatchEvent(leave);

    expect(document.querySelector("#store-mega-menu")).not.toBeNull();
  });

  it("does not open on hover and toggles with the Men arrow only", async () => {
    renderHeader();
    const arrow = await screen.findByRole("button", { name: "Men menu" });
    const enter = Object.assign(new Event("pointerover", { bubbles: true }), { pointerType: "mouse" });
    arrow.dispatchEvent(enter);
    expect(document.querySelector("#store-mega-menu")).toBeNull();
    fireEvent.click(arrow);
    expect(document.querySelector("#store-mega-menu")).not.toBeNull();
    fireEvent.click(arrow);
    expect(document.querySelector("#store-mega-menu")).toBeNull();
  });

  it("switches to Women only when its arrow is clicked", async () => {
    renderHeader();
    fireEvent.click(await screen.findByRole("button", { name: "Men menu" }));
    const women = screen.getByRole("button", { name: "Women menu" });
    women.dispatchEvent(Object.assign(new Event("pointerover", { bubbles: true }), { pointerType: "mouse" }));
    expect(screen.getByRole("navigation", { name: "Men collections" })).toBeInTheDocument();
    fireEvent.click(women);
    expect(screen.queryByRole("navigation", { name: "Men collections" })).toBeNull();
    expect(screen.getByRole("navigation", { name: "Women collections" })).toBeInTheDocument();
  });

  it("keeps the panel open while scrolling inside the panel itself", async () => {
    renderHeader();

    fireEvent.click(await screen.findByRole("button", { name: /^Women/ }));
    const panel = document.querySelector("#store-mega-menu");
    expect(panel).not.toBeNull();

    fireEvent(panel as Element, new Event("scroll", { bubbles: true }));

    expect(document.querySelector("#store-mega-menu")).not.toBeNull();
  });
});
