import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import { Moon, Sun } from "lucide-react";
import { Theme } from "@/06-providers/theme/theme-context";
import { useTheme } from "@/04-hooks/use-theme";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

	return (
    <ToggleGroup
      type="single"
      value={theme}
      onValueChange={(value) => {
        if (value) setTheme(value as Theme);
      }}
      className="border rounded-[0.5rem] h-6 p-0.5 gap-0.5"
    >
      <ToggleGroupItem value="light" aria-label="Light mode" className="h-[18px] w-[20px] rounded-[6px] px-[2px]">
        <Sun className="size-3" />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark" aria-label="Dark mode" className="h-[18px] w-[20px] rounded-[6px] px-[2px]">
        <Moon className="size-3" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}