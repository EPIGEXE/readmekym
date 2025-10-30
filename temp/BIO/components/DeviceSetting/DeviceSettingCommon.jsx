
// 장치 설정 폼 필드 
export const FormField = ({ label, children }) => (
    <div className="flex items-center mb-3">
        <label className="w-40 text-left pr-3 font-medium">
            {label}
        </label>
        <div className="flex-1">{children}</div>
    </div>
);

// 장치 설정 섹션 타이틀
export const SectionTitle = ({ title, actions }) => (
    <div className="flex justify-between items-center mb-4 pb-1 border-b border-gray-200">
        <div className="flex items-center">
            <div className="w-1 h-5 bg-[var(--kendo-color-primary)] mr-2 rounded-sm"></div>
            <h3 className="text-base font-semibold text-lg text-[var(--kendo-color-primary)]">{title}</h3>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
    </div>
);

// 장치 설정 구분선
export const Divider = () => (
    <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
        </div>
    </div>
);

// 장치 설정 섹션
export const Section = ({ children, className = "" }) => (
    <div className={`mb-10 ${className}`}>
        <div className="pl-4">
            {children}
        </div>
    </div>
);

//읽기 전용 필드에 적용할 스타일
export const readOnlyStyle = {
    backgroundColor: 'var(--kendo-color-base-subtle)',
    color: 'var(--kendo-color-base-on-subtle)',
    cursor: 'not-allowed',
    border: '1px solid var(--kendo-color-border)',
    borderRadius: '4px',
};
