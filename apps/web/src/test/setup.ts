import "@testing-library/jest-dom/vitest";
import { createElement } from "react";
import { vi } from "vitest";
vi.mock("next/image",()=>({default:(props:Record<string,unknown>)=>{const {fill,...rest}=props;return createElement("img",rest)}}));
