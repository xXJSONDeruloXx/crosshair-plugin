import os
import asyncio
import decky

class Plugin:
    def __init__(self):
        self.offset_x = 960
        self.offset_y = 540
        self.lock = asyncio.Lock()

    async def write_crosshair_config(self):
        try:
            mangohud_file = "/tmp/mangohud.conf"
            if not os.path.exists(mangohud_file):
                decky.logger.info(f"MangoHud file not found. Creating {mangohud_file}")
                with open(mangohud_file, "w") as f:
                    f.write("")  # Create an empty file
            
            crosshair_config = f"""
legacy_layout=false
background_alpha=0
alpha=1
background_color=020202
text_color=FF007B
custom_text=-+-
offset_x={self.offset_x}
offset_y={self.offset_y}
"""
            with open(mangohud_file, "w") as f:
                f.write(crosshair_config)

            decky.logger.info(f"Crosshair configuration written to {mangohud_file}")
        except Exception as e:
            decky.logger.error(f"Error in write_crosshair_config: {str(e)}")
            raise e

    async def make_800p_crosshair(self):
        async with self.lock:
            self.offset_x = 640
            self.offset_y = 400
            await self.write_crosshair_config()

    async def make_1080p_crosshair(self):
        async with self.lock:
            self.offset_x = 960
            self.offset_y = 540
            await self.write_crosshair_config()

    async def _main(self):
        decky.logger.info("Crosshair Plugin initialized!")

    async def _unload(self):
        decky.logger.info("Crosshair Plugin unloaded!")