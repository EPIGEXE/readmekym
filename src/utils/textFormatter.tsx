import React, { useEffect, useRef, useState } from 'react';

// 강조 텍스트 포맷팅
// {{text}} 형식의 텍스트를 강조 텍스트로 포맷팅
// 뷰포트에 들어오면 밑줄이 왼쪽에서 오른쪽으로 그려지는 애니메이션 적용
export function formatWithEmphasis(text: string): React.ReactNode {
    const parts = text.split(/({{.*?}})/g);
    return parts.map((part, index) => {
        if (part.startsWith('{{') && part.endsWith('}}')) {
            const content = part.slice(2, -2);
            return <EmphasisText key={index} content={content} />;
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
}

// 개별 강조 텍스트 컴포넌트 (Intersection Observer 적용)
// eslint-disable-next-line react-refresh/only-export-components
function EmphasisText({ content }: { content: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current; // ref 값을 변수로 캡처

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    // 한번 보이면 observer 해제 (재실행 방지)
                    if (element) {
                        observer.unobserve(element);
                    }
                }
            },
            {
                threshold: 0.8, // 80% 이상 보여야 트리거 (확실히 뷰포트 안에)
                rootMargin: '0px', // 여백 없이 정확한 뷰포트 기준
            }
        );

        if (element) {
            observer.observe(element);
        }

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, []);

    return (
        <span
            ref={ref}
            className="font-medium text-gray-900"
            style={{
                backgroundImage: 'linear-gradient(to right, rgb(251, 113, 133), rgb(251, 113, 133))',
                backgroundSize: isVisible ? '100% 2px' : '0% 2px',
                backgroundPosition: 'left bottom',
                backgroundRepeat: 'no-repeat',
                transition: 'background-size 0.7s ease-out',
                paddingBottom: '2px',
            }}
        >
            {content}
        </span>
    );
}