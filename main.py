import os
import decky

class Plugin:
    def __init__(self):
        self.current_offset_x = None
        self.current_offset_y = None

    def find_mangohud_config_path(self):
        """Find the active MangoHUD config file path by looking for mangoapp process"""
        try:
            # Scan /proc for running processes
            for proc_dir in os.listdir("/proc"):
                if not proc_dir.isdigit():
                    continue
                
                proc_path = f"/proc/{proc_dir}"
                
                try:
                    # Read command line to find mangoapp process
                    with open(f"{proc_path}/cmdline", "r") as f:
                        cmdline = f.read()
                    
                    if "mangoapp" in cmdline:
                        # Found mangoapp process, now get its environment variables
                        with open(f"{proc_path}/environ", "r") as f:
                            environ = f.read()
                        
                        # Look for MANGOHUD_CONFIGFILE environment variable
                        for env_var in environ.split("\0"):
                            if env_var.startswith("MANGOHUD_CONFIGFILE="):
                                config_path = env_var.split("=", 1)[1]
                                decky.logger.info(f"Found MangoHUD config file: {config_path}")
                                return config_path
                
                except (FileNotFoundError, PermissionError, IOError):
                    # Skip processes we can't read
                    continue
            
            # If no mangoapp process found, try common config locations
            common_paths = [
                os.path.expanduser("~/.config/MangoHud/MangoHud.conf"),
                "/tmp/mangohud.conf",
                "/tmp/MangoHud.conf"
            ]
            
            for path in common_paths:
                if os.path.exists(path):
                    decky.logger.info(f"Using fallback MangoHUD config: {path}")
                    return path
            
            # Create a default config if none exists
            default_path = "/tmp/mangohud_crosshair.conf"
            decky.logger.info(f"No MangoHUD config found, creating default: {default_path}")
            return default_path
            
        except Exception as e:
            decky.logger.error(f"Error finding MangoHUD config: {str(e)}")
            # Fallback to default location
            return "/tmp/mangohud_crosshair.conf"

    async def write_crosshair_config(self, custom_text_1: str, custom_text_2: str, custom_text_3: str, offset_x: int, offset_y: int):
        try:
            # Always find the current MangoHUD config path - don't cache it
            config_path = self.find_mangohud_config_path()

            # Build crosshair config - ONLY crosshair settings, nothing else
            crosshair_config = f"""legacy_layout=false
background_alpha=0
alpha=1
background_color=020202
text_color=FF007B
custom_text={custom_text_1}
custom_text={custom_text_2}
custom_text={custom_text_3}
offset_x={offset_x}
offset_y={offset_y}"""

            # Write ONLY the crosshair config, overwriting the entire file
            with open(config_path, "w") as f:
                f.write(crosshair_config)

            decky.logger.info(f"Crosshair configuration written to {config_path}")
            
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