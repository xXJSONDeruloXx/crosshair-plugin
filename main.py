import os
import decky

class Plugin:
    def __init__(self):
        self.current_offset_x = None
        self.current_offset_y = None

    async def write_crosshair_config(self, custom_text_1: str, custom_text_2: str, custom_text_3: str, offset_x: int, offset_y: int):
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
custom_text={custom_text_1}
custom_text={custom_text_2}
custom_text={custom_text_3}
offset_x={offset_x}
offset_y={offset_y}
"""

            with open(mangohud_file, "w") as f:
                f.write(crosshair_config)

            decky.logger.info(f"Crosshair configuration written to {mangohud_file}")
        except Exception as e:
            decky.logger.error(f"Error in write_crosshair_config: {str(e)}")
            raise e

    async def make_800p_crosshair(self):
        self.current_offset_x = 618
        self.current_offset_y = 380
        await self.write_crosshair_config("-----", "| + |", "-----", self.current_offset_x, self.current_offset_y)

    async def make_1080p_crosshair(self):
        self.current_offset_x = 938
        self.current_offset_y = 520
        await self.write_crosshair_config("-----", "| + |", "-----", self.current_offset_x, self.current_offset_y)

    async def remove_crosshair(self):
        self.current_offset_x = 0
        self.current_offset_y = 0
        await self.write_crosshair_config("", "", "", self.current_offset_x, self.current_offset_y)

    async def adjust_crosshair_offset(self, x_delta: int, y_delta: int):
        if self.current_offset_x is None:
            self.current_offset_x = 640
        if self.current_offset_y is None:
            self.current_offset_y = 400

        self.current_offset_x += x_delta
        self.current_offset_y += y_delta

        await self.write_crosshair_config("-----", "| + |", "-----", self.current_offset_x, self.current_offset_y)

    async def get_current_offsets(self) -> list:
        if self.current_offset_x is None:
            self.current_offset_x = 640
        if self.current_offset_y is None:
            self.current_offset_y = 400
        return [self.current_offset_x, self.current_offset_y]

    async def _main(self):
        decky.logger.info("Crosshair Plugin initialized!")

    async def _unload(self):
        decky.logger.info("Crosshair Plugin unloaded!")