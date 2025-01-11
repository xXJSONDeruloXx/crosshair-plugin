import os
import decky

class Plugin:
    def __init__(self):
        # Initialize offsets with defaults (centered for 1080p)
        self.offset_x = 960
        self.offset_y = 540

    async def write_crosshair_config(self):
        try:
            # Locate the MangoHud file in /tmp/
            mangohud_file = None
            for file in os.listdir("/tmp"):
                if file.startswith("mangohud"):
                    mangohud_file = os.path.join("/tmp", file)
                    break

            if not mangohud_file:
                raise FileNotFoundError("MangoHud file not found in /tmp/")
            
            # Define the crosshair configuration with the given offsets
            crosshair_config = f"""
legacy_layout=false
background_alpha=0
alpha=1
font_size=1
background_color=020202
text_color=FF007B
custom_text=+
offset_x={self.offset_x}
offset_y={self.offset_y}
"""

            # Overwrite the MangoHud file
            with open(mangohud_file, "w") as f:
                f.write(crosshair_config)

            decky.logger.info(f"Crosshair configuration written to {mangohud_file}")
        except Exception as e:
            decky.logger.error(f"Error in write_crosshair_config: {str(e)}")
            raise e

    async def adjust_offset(self, axis: str, delta: int):
        try:
            if axis == "x":
                self.offset_x += delta
            elif axis == "y":
                self.offset_y += delta
            else:
                raise ValueError("Invalid axis specified. Must be 'x' or 'y'.")
            
            await self.write_crosshair_config()
            decky.logger.info(f"Offset adjusted: {axis}={delta}")
        except Exception as e:
            decky.logger.error(f"Error in adjust_offset: {str(e)}")

    async def set_800p_crosshair(self):
        self.offset_x = 640
        self.offset_y = 400
        await self.write_crosshair_config()

    async def set_1080p_crosshair(self):
        self.offset_x = 960
        self.offset_y = 540
        await self.write_crosshair_config()

    async def _main(self):
        decky.logger.info("Crosshair Plugin initialized!")

    async def _unload(self):
        decky.logger.info("Crosshair Plugin unloaded!")