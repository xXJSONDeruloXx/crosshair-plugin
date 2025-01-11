import os
import decky

class Plugin:
    def __init__(self):
        self.offset_x = 640
        self.offset_y = 400

    async def write_crosshair_config(self, offset_x: int, offset_y: int):
        try:
            mangohud_file = None
            for file in os.listdir("/tmp"):
                if file.startswith("mangohud"):
                    mangohud_file = os.path.join("/tmp", file)
                    break

            if not mangohud_file:
                raise FileNotFoundError("MangoHud file not found in /tmp/")

            crosshair_config = f"""
legacy_layout=false
background_alpha=0
alpha=1
background_color=020202
text_color=FF007B
custom_text=-+-
offset_x={offset_x}
offset_y={offset_y}
"""

            with open(mangohud_file, "w") as f:
                f.write(crosshair_config)

            self.offset_x = offset_x
            self.offset_y = offset_y
            decky.logger.info(f"Crosshair configuration written to {mangohud_file}")
        except Exception as e:
            decky.logger.error(f"Error in write_crosshair_config: {str(e)}")
            raise e

    @decky.method
    async def make_800p_crosshair(self):
        self.offset_x = 640
        self.offset_y = 400
        await self.write_crosshair_config(self.offset_x, self.offset_y)

    @decky.method
    async def make_1080p_crosshair(self):
        self.offset_x = 960
        self.offset_y = 540
        await self.write_crosshair_config(self.offset_x, self.offset_y)

    @decky.method
    async def adjust_crosshair(self, delta_x: int, delta_y: int):
        new_x = self.offset_x + delta_x
        new_y = self.offset_y + delta_y
        await self.write_crosshair_config(new_x, new_y)

    @decky.method
    async def get_current_offsets(self) -> dict:
        return {"offset_x": self.offset_x, "offset_y": self.offset_y}

    async def _main(self):
        decky.logger.info("Crosshair Plugin initialized!")

    async def _unload(self):
        decky.logger.info("Crosshair Plugin unloaded!")