import { CopyChimeAPI } from "../../shared/types";

declare global {
  interface Window {
    copyChime: CopyChimeAPI;
  }
}
