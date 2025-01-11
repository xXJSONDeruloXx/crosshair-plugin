import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin } from "@decky/api";
import { useState, useEffect } from "react";
import { FaCrosshairs } from "react-icons/fa";

// Existing Python methods
const make800pCrosshair = callable<[], void>("make_800p_crosshair");
const make1080pCrosshair = callable<[], void>("make_1080p_crosshair");
const adjustCrosshairOffset = callable<[number, number], void>("adjust_crosshair_offset");
// New method to fetch the current offsets
const getCurrentOffsets = callable<[], number[]>("get_current_offsets");

function Content() {
  const [status, setStatus] = useState("No action yet");
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);

  const fetchOffsets = async () => {
    try {
      const [x, y] = await getCurrentOffsets();
      setXOffset(x);
      setYOffset(y);
    } catch (error) {
      console.error(error);
      // Keep old values if there's an error
    }
  };

  const on800pClick = async () => {
    try {
      await make800pCrosshair();
      setStatus("Crosshair for Deck (800p) applied!");
      await fetchOffsets();
    } catch (error) {
      console.error(error);
      setStatus("Failed to apply 800p crosshair.");
    }
  };

  const on1080pClick = async () => {
    try {
      await make1080pCrosshair();
      setStatus("Crosshair for 1080p applied!");
      await fetchOffsets();
    } catch (error) {
      console.error(error);
      setStatus("Failed to apply 1080p crosshair.");
    }
  };

  const onOffsetClick = async (xDelta: number, yDelta: number) => {
    try {
      await adjustCrosshairOffset(xDelta, yDelta);
      setStatus(`Crosshair offset adjusted by x=${xDelta}, y=${yDelta}`);
      await fetchOffsets();
    } catch (error) {
      console.error(error);
      setStatus("Failed to adjust crosshair offset.");
    }
  };

  useEffect(() => {
    // On initial load, fetch the current offsets
    fetchOffsets();
  }, []);

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
        <ButtonItem layout="below" onClick={() => onOffsetClick(0, -1)}>
          Up
        </ButtonItem>
        <ButtonItem layout="below" onClick={() => onOffsetClick(-1, 0)}>
          Left
        </ButtonItem>
        <ButtonItem layout="below" onClick={() => onOffsetClick(1, 0)}>
          Right
        </ButtonItem>
        <ButtonItem layout="below" onClick={() => onOffsetClick(0, 1)}>
          Down
        </ButtonItem>
      </PanelSectionRow>

      <PanelSectionRow>
        <div>Status: {status}</div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div>
          Current Offsets: X = {xOffset}, Y = {yOffset}
        </div>
      </PanelSectionRow>
    </PanelSection>
  );
}

export default definePlugin(() => ({
  name: "Crosshair Plugin",
  titleView: <div className={staticClasses.Title}>Crosshair Plugin</div>,
  content: <Content />,
  icon: <FaCrosshairs />,
}));