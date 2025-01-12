# Crosshair Plugin

![alt text](83EC67A8B25603F81A57F5C72715001021AC8484.jpeg)

The Crosshair Plugin is a tool for the Steam Deck that overlays a crosshair on the screen. It uses MangoHud's configuration to display a customizable aiming aid, making it useful for games that don’t provide a native crosshair.

## Features

- Predefined crosshairs for:
  - **800p** (Steam Deck native resolution)
  - **1080p** (external display support)
- Adjustable offsets to fine-tune the crosshair's position.
- Displays the current x and y offsets in the UI.

## Usage

1. Open the plugin from Decky Loader.
2. Select the resolution you want:
   - **800p**: For the Steam Deck's built-in screen.
   - **1080p**: For external displays.
3. Adjust the crosshair's position using the directional buttons (Up, Down, Left, Right).
4. View the current offsets in the plugin UI for reference.

## How It Works

- The plugin generates a MangoHud configuration file with the crosshair settings.
- Offset adjustments are handled dynamically, and the configuration is updated automatically.
- NOTE: this may conflict with any MangoHUD overrides you have set, or override plugins such as MangoPeel.