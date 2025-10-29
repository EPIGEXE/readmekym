// 아래에서 위로 fade in 애니메이션
// 0.6초 동안 커스텀 easing
export const fadeInUpCustom = {
    initial: { opacity: 0, y: 20 }, 
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}

// 아래에서 위로 fade in 애니메이션
// 0.4초 동안 커스텀 easing
export const fadeInUpEaseOut = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }, 
};

// 자식 순차 애니메이션
// 자식 요소들의 애니메이션을 0.1초 간격으로 순차 실행
export const staggerContainer = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}