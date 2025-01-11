import {
  ButtonItem,
  PanelSection,
  PanelSectionRow,
  staticClasses,
} from "@decky/ui";
import { callable, definePlugin } from "@decky/api";
import { useState } from "react";
import { FaCrosshairs } from "react-icons/fa";

// Callable Python method to make the crosshair
const makeCrosshair = callable<[], void>("make_crosshair");

function Content() {
  const [status, setStatus] = useState<string>("No action yet");

  const onMakeCrosshairClick = async () => {
    try {
      await makeCrosshair();
      setStatus("Crosshair configuration applied!");
    } catch (error) {
      console.error(error);
      setStatus("Failed to apply crosshair.");
    }
  };

  return (
    <PanelSection title="Crosshair Plugin">
      <PanelSectionRow>
        <ButtonItem layout="below" onClick={onMakeCrosshairClick}>
          Make Crosshair
        </ButtonItem>
      </PanelSectionRow>
      <PanelSectionRow>
        <div>Status: {status}</div>
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