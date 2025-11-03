import React from 'react';

// 강조 텍스트 포맷팅
// {{text}} 형식의 텍스트를 강조 텍스트로 포맷팅
// 굵은 글씨와 밑줄 효과 적용
export function formatWithEmphasis(text: string): React.ReactNode {
    const parts = text.split(/({{.*?}})/g);
    return parts.map((part, index) => {
        if (part.startsWith('{{') && part.endsWith('}}')) {
            const content = part.slice(2, -2);
            return (
                <span
                    key={index}
                    className="border-b-2 border-rose-400 font-medium text-gray-900"
                >
                    {content}
                </span>
            );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
}