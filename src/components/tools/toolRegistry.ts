import type { ComponentType } from "react";
import {
  ArrowLeftRight,
  Braces,
  CalendarClock,
  Dices,
  KeyRound,
  Regex,
  type LucideProps,
} from "lucide-react";
import EncodeTool from "./EncodeTool";
import GeneratorTool from "./GeneratorTool";
import JsonTool from "./JsonTool";
import JwtTool from "./JwtTool";
import RegexTool from "./RegexTool";
import TimeTool from "./TimeTool";

export type ToolDefinition = {
  id: string;
  name: string;
  icon: ComponentType<LucideProps>;
  component: ComponentType;
};

// To add a new tool: build its screen, then add one line here.
// The page, the menu and the link in the address bar appear on their own.
export const TOOLS: ToolDefinition[] = [
  { id: "json", name: "JSON formatter", icon: Braces, component: JsonTool },
  { id: "encode", name: "Base64 and URL", icon: ArrowLeftRight, component: EncodeTool },
  { id: "jwt", name: "JWT decoder", icon: KeyRound, component: JwtTool },
  { id: "time", name: "Timestamps", icon: CalendarClock, component: TimeTool },
  { id: "generate", name: "UUID and password", icon: Dices, component: GeneratorTool },
  { id: "regex", name: "Regex tester", icon: Regex, component: RegexTool },
];
