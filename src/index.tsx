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
const adjustCrosshair = callable<[number, number], void>("adjust_crosshair");
const getCurrentOffsets = callable<[], { offset_x: number; offset_y: number }>(
  "get_current_offsets"
);

function Content() {
  const [status, setStatus] = useState<string>("No action yet");
  const [offsets, setOffsets] = useState<{ offset_x: number; offset_y: number }>({ offset_x: 0, offset_y: 0 });

  const on800pClick = async () => {
    try {
      await make800pCrosshair();
      setStatus("Crosshair for Deck (800p) applied!");
      refreshOffsets();
    } catch (error) {
      console.error(error);
      setStatus("Failed to apply 800p crosshair.");
    }
  };

  const on1080pClick = async () => {
    try {
      await make1080pCrosshair();
      setStatus("Crosshair for 1080p applied!");
      refreshOffsets();
    } catch (error) {
      console.error(error);
      setStatus("Failed to apply 1080p crosshair.");
    }
  };

  const refreshOffsets = async () => {
    try {
      const current = await getCurrentOffsets();
      setOffsets(current);
    } catch (error) {
      console.error(error);
    }
  };

  const moveCrosshair = async (dx: number, dy: number) => {
    try {
      await adjustCrosshair(dx, dy);
      await refreshOffsets();
      setStatus(`Crosshair moved by [${dx}, ${dy}]`);
    } catch (error) {
      console.error(error);
      setStatus("Failed to move crosshair.");
    }
  };

  useEffect(() => {
    refreshOffsets();
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
        <ButtonItem onClick={() => moveCrosshair(0, -1)}>Up</ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem onClick={() => moveCrosshair(-1, 0)}>Left</ButtonItem>
        <ButtonItem onClick={() => moveCrosshair(1, 0)}>Right</ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <ButtonItem onClick={() => moveCrosshair(0, 1)}>Down</ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <div>Status: {status}</div>
      </PanelSectionRow>
      <PanelSectionRow>
        <div>Offsets: X = {offsets.offset_x}, Y = {offsets.offset_y}</div>
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