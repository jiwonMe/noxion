import { describe, it, expect } from "bun:test";
import { resolveSlots } from "../theme/slot-resolver";
import type { NoxionSlotMap } from "../theme/types";
import type { ComponentType } from "react";

describe("resolveSlots", () => {
  const MockHeader = (() => null) as ComponentType<any>;
  const MockFooter = (() => null) as ComponentType<any>;
  const CustomHeader = (() => null) as ComponentType<any>;

  it("returns defaults when no overrides provided", () => {
    const defaults: Partial<NoxionSlotMap> = { header: MockHeader, footer: MockFooter };
    const resolved = resolveSlots(defaults, {});
    expect(resolved.header).toBe(MockHeader);
    expect(resolved.footer).toBe(MockFooter);
  });

  it("overrides specific slots", () => {
    const defaults: Partial<NoxionSlotMap> = { header: MockHeader };
    const overrides: Partial<NoxionSlotMap> = { header: CustomHeader };
    const resolved = resolveSlots(defaults, overrides);
    expect(resolved.header).toBe(CustomHeader);
  });

  it("disables a slot when override is null", () => {
    const defaults: Partial<NoxionSlotMap> = { header: MockHeader, footer: MockFooter };
    const overrides: Partial<NoxionSlotMap> = { header: null };
    const resolved = resolveSlots(defaults, overrides);
    expect(resolved.header).toBeNull();
    expect(resolved.footer).toBe(MockFooter);
  });

  it("preserves unmentioned slots from defaults", () => {
    const defaults: Partial<NoxionSlotMap> = { header: MockHeader, footer: MockFooter, sidebar: MockHeader };
    const overrides: Partial<NoxionSlotMap> = { footer: CustomHeader };
    const resolved = resolveSlots(defaults, overrides);
    expect(resolved.header).toBe(MockHeader);
    expect(resolved.footer).toBe(CustomHeader);
    expect(resolved.sidebar).toBe(MockHeader);
  });

  it("adds new slots from overrides", () => {
    const defaults: Partial<NoxionSlotMap> = { header: MockHeader };
    const overrides: Partial<NoxionSlotMap> = { hero: CustomHeader };
    const resolved = resolveSlots(defaults, overrides);
    expect(resolved.header).toBe(MockHeader);
    expect(resolved.hero).toBe(CustomHeader);
  });

  it("handles empty defaults and overrides", () => {
    const resolved = resolveSlots({}, {});
    expect(Object.keys(resolved)).toHaveLength(0);
  });
});
