import React from 'react';

/**
 * Parse text with custom emphasis tags {{text}} and render with emphasis style
 * @param text - Text containing {{emphasized}} content
 * @returns JSX elements with emphasized parts styled
 */

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