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
const make800pDotCrosshair = callable<[], void>("make_800p_dot_crosshair");
const make1080pDotCrosshair = callable<[], void>("make_1080p_dot_crosshair");
const adjustCrosshairOffset = callable<[number, number], void>("adjust_crosshair_offset");
const getCurrentOffsets = callable<[], number[]>("get_current_offsets");
const removeCrosshair = callable<[], void>("remove_crosshair");

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
    }
  };

  const on800pClick = async () => {
    try {
      await make800pCrosshair();
      setStatus("Crosshair Box (800p) applied!");
      await fetchOffsets();
    } catch (error) {
      console.error(error);
      setStatus("Failed to apply 800p crosshair.");
    }
  };

  const on1080pClick = async () => {
    try {
      await make1080pCrosshair();
      setStatus("Crosshair Box for 1080p applied!");
      await fetchOffsets();
    } catch (error) {
      console.error(error);
      setStatus("Failed to apply 1080p crosshair.");
    }
  };

  const on800pDotClick = async () => {
    try {
      await make800pDotCrosshair();
      setStatus("Crosshair Dot (800p) applied!");
      await fetchOffsets();
    } catch (error) {
      console.error(error);
      setStatus("Failed to apply 800p dot crosshair.");
    }
  };

  const on1080pDotClick = async () => {
    try {
      await make1080pDotCrosshair();
      setStatus("Crosshair Dot for 1080p applied!");
      await fetchOffsets();
    } catch (error) {
      console.error(error);
      setStatus("Failed to apply 1080p dot crosshair.");
    }
  };

  const onRemoveClick = async () => {
    try {
      await removeCrosshair();
      setStatus("Crosshair removed!");
      setXOffset(0);
      setYOffset(0);
    } catch (error) {
      console.error(error);
      setStatus("Failed to remove crosshair.");
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
    fetchOffsets();
  }, []);

  return (
    <PanelSection title="Crosshair Plugin">
      <PanelSectionRow>
        <div>
          NOTE: This plugin works by replacing the performance overlay with text that acts as a crosshair in your game. Currently you can not have both a performance overlay and crosshairs at the same time. To restore performance overlay, simply toggle one of the 4 levels from the QAM tab. 
        </div>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={on800pClick}>
          Make Crosshair Box (800p)
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={on800pDotClick}>
          Make Crosshair Dot (800p)
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={on1080pClick}>
          Make Crosshair Box for 1080p
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={on1080pDotClick}>
          Make Crosshair Dot for 1080p
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={onRemoveClick}>
          Remove Crosshair
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