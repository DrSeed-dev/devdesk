import { useState } from "react";
import SegmentedControl from "../ui/SegmentedControl";
import ClockPanel from "./clock/ClockPanel";
import AlarmPanel from "./clock/AlarmPanel";

type ClockTab = "clock" | "alarm";

const TABS: { id: ClockTab; label: string }[] = [
  { id: "clock", label: "Clock" },
  { id: "alarm", label: "Alarm" },
];

function ClockWidget() {
  const [activeTab, setActiveTab] = useState<ClockTab>("clock");

  return (
    <div>
      <div className="flex justify-center">
        <SegmentedControl
          items={TABS}
          activeId={activeTab}
          onChange={setActiveTab}
        />
      </div>

      <div className="mt-4 flex min-h-0 flex-1 flex-col">
        {activeTab === "clock" ? <ClockPanel /> : <AlarmPanel />}
      </div>
    </div>
  );
}

export default ClockWidget;
