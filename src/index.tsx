import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin } from "@decky/api";
import { useState } from "react";
import { FaCrosshairs } from "react-icons/fa";

// Callable Python methods for 800p, 1080p crosshairs, and dynamic offset adjustments
const make800pCrosshair = callable<[], void>("make_800p_crosshair");
const make1080pCrosshair = callable<[], void>("make_1080p_crosshair");
const adjustOffset = callable<{ axis: string; delta: number }, void>("adjust_offset");

function Content() {
  const [status, setStatus] = useState<string>("No action yet");
  const [offsetX, setOffsetX] = useState<number>(960); // Default for 1080p
  const [offsetY, setOffsetY] = useState<number>(540); // Default for 1080p

  const on800pClick = async () => {
    try {
      await make800pCrosshair();
      setOffsetX(640);
      setOffsetY(400);
      setStatus("Crosshair for Deck (800p) applied!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to apply 800p crosshair.");
    }
  };

  const on1080pClick = async () => {
    try {
      await make1080pCrosshair();
      setOffsetX(960);
      setOffsetY(540);
      setStatus("Crosshair for 1080p applied!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to apply 1080p crosshair.");
    }
  };

  const adjustCrosshairOffset = async (axis: "x" | "y", delta: number) => {
    try {
      await adjustOffset({ axis, delta });
      if (axis === "x") {
        setOffsetX((prev) => prev + delta);
      } else {
        setOffsetY((prev) => prev + delta);
      }
      setStatus(`Offset adjusted: ${axis.toUpperCase()} ${delta > 0 ? "+" : ""}${delta}`);
    } catch (error) {
      console.error(error);
      setStatus("Failed to adjust offset.");
    }
  };

  return (
    <PanelSection title="Crosshair Plugin">
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={on800pClick}>
          Make Crosshair for Deck (800p)
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={on1080pClick}>
          Make Crosshair for 1080p
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <div>Status: {status}</div>
      </PanelSectionRow>
      <PanelSection title="Adjust Crosshair Position">
        <PanelSectionRow>
          <div>Horizontal Offset (X): {offsetX}</div>
          <ButtonItem layout="below" onClick={() => adjustCrosshairOffset("x", -1)}>
            Move Left
          </ButtonItem>
          <ButtonItem layout="below" onClick={() => adjustCrosshairOffset("x", 1)}>
            Move Right
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <div>Vertical Offset (Y): {offsetY}</div>
          <ButtonItem layout="below" onClick={() => adjustCrosshairOffset("y", -1)}>
            Move Up
          </ButtonItem>
          <ButtonItem layout="below" onClick={() => adjustCrosshairOffset("y", 1)}>
            Move Down
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </PanelSection>
  );
}

export default definePlugin(() => ({
  name: "Crosshair Plugin",
  titleView: <div className={staticClasses.Title}>Crosshair Plugin</div>,
  content: <Content />,
  icon: <FaCrosshairs />,
}));