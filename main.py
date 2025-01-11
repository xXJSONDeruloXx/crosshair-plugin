import os
import asyncio
import decky

class Plugin:
    def __init__(self):
        self.offset_x = 960
        self.offset_y = 540
        self.lock = asyncio.Lock()  # Prevent concurrent writes

    async def write_crosshair_config(self):
        try:
            mangohud_file = "/tmp/mangohud.conf"
            
            # Ensure the file exists
            if not os.path.exists(mangohud_file):
                with open(mangohud_file, "w") as f:
                    f.write("")  # Create an empty file
            
            # Define the crosshair configuration
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
            # Write to the MangoHud file
            with open(mangohud_file, "w") as f:
                f.write(crosshair_config)

            decky.logger.info(f"[write_crosshair_config] Crosshair configuration written to {mangohud_file}")
        except Exception as e:
            decky.logger.error(f"[write_crosshair_config] Error: {str(e)}")
            raise e

    async def adjust_offset(self, axis: str, delta: int):
        async with self.lock:
            try:
                if axis == "x":
                    self.offset_x += delta
                elif axis == "y":
                    self.offset_y += delta
                else:
                    raise ValueError("Invalid axis specified. Must be 'x' or 'y'.")

                await self.write_crosshair_config()
                decky.logger.info(f"[adjust_offset] Offset adjusted: {axis}={delta}")
            except Exception as e:
                decky.logger.error(f"[adjust_offset] Error: {str(e)}")

    async def set_800p_crosshair(self):
        async with self.lock:
            self.offset_x = 640
            self.offset_y = 400
            await self.write_crosshair_config()

    async def set_1080p_crosshair(self):
        async with self.lock:
            self.offset_x = 960
            self.offset_y = 540
            await self.write_crosshair_config()

    async def _main(self):
        decky.logger.info("[_main] Crosshair Plugin initialized!")

    async def _unload(self):
        decky.logger.info("[_unload] Crosshair Plugin unloaded!")