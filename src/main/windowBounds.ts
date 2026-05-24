import { screen, Rectangle } from "electron";
import { BUBBLE_WIDTH, BUBBLE_HEIGHT, PANEL_WIDTH, PANEL_HEIGHT, MARGIN } from "../shared/constants";

export function defaultBubbleBounds(): Rectangle {
  const display = screen.getPrimaryDisplay().workArea;
  return {
    x: display.x + display.width - BUBBLE_WIDTH - MARGIN,
    y: display.y + display.height - BUBBLE_HEIGHT - MARGIN,
    width: BUBBLE_WIDTH,
    height: BUBBLE_HEIGHT,
  };
}

export function defaultPanelBounds(): Rectangle {
  const display = screen.getPrimaryDisplay().workArea;
  return {
    x: display.x + display.width - PANEL_WIDTH - MARGIN,
    y: display.y + display.height - PANEL_HEIGHT - MARGIN,
    width: PANEL_WIDTH,
    height: PANEL_HEIGHT,
  };
}

export function ensureBoundsVisible(bounds: Rectangle): Rectangle {
  const displays = screen.getAllDisplays();
  for (const display of displays) {
    const wa = display.workArea;
    if (
      bounds.x >= wa.x &&
      bounds.y >= wa.y &&
      bounds.x + bounds.width <= wa.x + wa.width &&
      bounds.y + bounds.height <= wa.y + wa.height
    ) {
      return bounds;
    }
  }
  return defaultBubbleBounds();
}
