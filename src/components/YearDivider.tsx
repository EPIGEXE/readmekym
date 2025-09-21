import React from 'react'

interface YearDividerProps {
    totalHeight: number
    monthHeight: number
    yearsArray: number[]
}

export const YearDivider: React.FC<YearDividerProps> = ({ totalHeight, monthHeight, yearsArray }) => {
    return (
        <div
            className="absolute left-0 right-0 top-0 pointer-events-none"
            style={{
                height: `${totalHeight}px`,
                zIndex: 0
            }}
        >
            {yearsArray.slice(1).map((year, index) => (
                <div
                    key={`year-divider-${year}`}
                    className="w-full bg-gray-300"
                    style={{
                        position: 'absolute',
                        top: `${(index + 1) * monthHeight * 12 - (8 * monthHeight)}px`,
                        height: '1px',
                        left: '0',
                        right: '0'
                    }}
                />
            ))}
        </div>
    )
}