import { nativeImage } from "electron";

// 16x16 simple clipboard icon as base64 PNG (white clipboard on transparent bg)
const ICON_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA" +
  "BHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA" +
  "7AAAAOwBNRcIFAAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAB" +
  "ySURBVDiNY2AYBUMHMDIwMPxHAUwMDAz/GRgYGBgZGBj+MzAw" +
  "MDAwMDAwfGBgYPjPwMDAwMDAwPCBgYHhPwMDAwMDAwPDBwYGhv8MDAwMDAwMDB8YGBj" +
  "+MzAwMDAwMDAwfGBgYPjPwMDAwMBAAwAA5GQE4f/cqJwAAAAASUVORK5CYII=";

export function createTrayIcon(): Electron.NativeImage {
  return nativeImage.createFromDataURL(ICON_DATA_URL);
}
