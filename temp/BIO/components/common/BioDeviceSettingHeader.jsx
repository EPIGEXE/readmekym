import { ChevronLeft } from "lucide-react";
import { memo } from "react";

const BioDeviceSettingHeader = memo(({ onBack, title }) => {
    return (
        <div className="flex items-center gap-2">
            <div
                onClick={onBack}
                className="hover:bg-[var(--kendo-color-base-subtle)] p-1 rounded-full transition-colors"
            >
                <ChevronLeft className="w-7 h-7 text-[var(--kendo-color-primary)]" />
            </div>
            <div className="text-2xl font-bold">{title}</div>
        </div>
    );
});

export default BioDeviceSettingHeader;
