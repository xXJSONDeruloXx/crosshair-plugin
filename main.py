import os
import decky

class Plugin:
    async def write_crosshair_config(self, offset_x: int, offset_y: int):
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
font_size=250
background_color=020202
text_color=FF007B
custom_text=+
offset_x={offset_x}
offset_y={offset_y}
"""

            # Overwrite the MangoHud file
            with open(mangohud_file, "w") as f:
                f.write(crosshair_config)

            decky.logger.info(f"Crosshair configuration written to {mangohud_file}")
        except Exception as e:
            decky.logger.error(f"Error in write_crosshair_config: {str(e)}")
            raise e

    async def make_800p_crosshair(self):
        # Parameters for 800p resolution (1280x800, 16:10)
        await self.write_crosshair_config(offset_x=640, offset_y=400)

    async def make_1080p_crosshair(self):
        # Parameters for 1080p resolution (1920x1080, 16:9)
        await self.write_crosshair_config(offset_x=960, offset_y=540)

    async def _main(self):
        decky.logger.info("Crosshair Plugin initialized!")

    async def _unload(self):
        decky.logger.info("Crosshair Plugin unloaded!")