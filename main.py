import os
import asyncio
import decky

class Plugin:
    async def make_crosshair(self):
        try:
            # Locate the MangoHud file in /tmp/
            mangohud_file = None
            for file in os.listdir("/tmp"):
                if file.startswith("mangohud"):
                    mangohud_file = os.path.join("/tmp", file)
                    break
            
            if not mangohud_file:
                raise FileNotFoundError("MangoHud file not found in /tmp/")
            
            # Define the crosshair configuration for 1080p
            crosshair_config = """
legacy_layout=false
background_alpha=0
alpha=1
font_size=50
background_color=020202
width=5
text_color=FF007B
custom_text=.
offset_x=960
offset_y=540
"""

            # Overwrite the MangoHud file
            with open(mangohud_file, "w") as f:
                f.write(crosshair_config)

            decky.logger.info(f"Crosshair configuration written to {mangohud_file}")
        except Exception as e:
            decky.logger.error(f"Error in make_crosshair: {str(e)}")
            raise e

    async def _main(self):
        decky.logger.info("Crosshair Plugin initialized!")

    async def _unload(self):
        decky.logger.info("Crosshair Plugin unloaded!")