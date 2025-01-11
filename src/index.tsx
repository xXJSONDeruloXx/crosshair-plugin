import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin } from "@decky/api";
import { useState, useEffect } from "react";
import { FaCrosshairs } from "react-icons/fa";

const make800pCrosshair = callable<[], void>("make_800p_crosshair");
const make1080pCrosshair = callable<[], void>("make_1080p_crosshair");
const adjustOffset = callable<["x" | "y", number], void>("adjust_offset");
const getCurrentOffsets = callable<[], { offsetX: number; offsetY: number }>("get_current_offsets");

function Content() {
  const [status, setStatus] = useState<string>("No action yet");
  const [offsetX, setOffsetX] = useState<number>(960);
  const [offsetY, setOffsetY] = useState<number>(540);

  useEffect(() => {
    const fetchOffsets = async () => {
      try {
        const { offsetX, offsetY } = await getCurrentOffsets();
        setOffsetX(offsetX);
        setOffsetY(offsetY);
      } catch (error) {
        console.error("Failed to fetch current offsets:", error);
      }
    };

    fetchOffsets();
  }, []);

  const on800pClick = async () => {
    try {
      await make800pCrosshair();
      const { offsetX, offsetY } = await getCurrentOffsets();
      setOffsetX(offsetX);
      setOffsetY(offsetY);
      setStatus("Crosshair for Deck (800p) applied!");
    } catch (error) {
      console.error("Error applying 800p crosshair:", error);
      setStatus("Failed to apply 800p crosshair.");
    }
  };

  const on1080pClick = async () => {
    try {
      await make1080pCrosshair();
      const { offsetX, offsetY } = await getCurrentOffsets();
      setOffsetX(offsetX);
      setOffsetY(offsetY);
      setStatus("Crosshair for 1080p applied!");
    } catch (error) {
      console.error("Error applying 1080p crosshair:", error);
      setStatus("Failed to apply 1080p crosshair.");
    }
  };

  const adjustCrosshairOffset = async (axis: "x" | "y", delta: number) => {
    try {
      await adjustOffset(axis, delta);
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