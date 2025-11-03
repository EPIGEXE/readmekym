import * as Dialog from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Lightbox from "yet-another-react-lightbox";
import { Philosophy01Content } from "../modalContent/Philosophy01Content";
import { Philosophy02Content } from "../modalContent/Philosophy02Content";
import { Philosophy03Content } from "../modalContent/Philosophy03Content";

interface PhilosophyModalProps {
    isOpen: boolean; // 모달 열림 여부
    onClose: () => void; // 모달 닫기 함수
    philosophyData: {
        id: string;
        number: string;
        title: string;
        description: string;
        color: string;
    } | null; // Philosophy 데이터
}

export function PhilosophyModal({ isOpen, onClose, philosophyData }: PhilosophyModalProps) {
    // ============================ 상태 관리 ============================
    const [isMobile, setIsMobile] = useState(false); // 모바일 여부
    const [lightboxOpen, setLightboxOpen] = useState(false); // 라이트박스 열림 여부
    const [lightboxIndex, setLightboxIndex] = useState(0); // 라이트박스 인덱스
    const [lightboxImages, setLightboxImages] = useState<string[]>([]); // 라이트박스 이미지

    // ============================ useEffect ============================
    // 모바일 여부 감지
    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const checkMobile = () => {
            setIsMobile(mediaQuery.matches);
        };
        checkMobile();
        mediaQuery.addEventListener("change", checkMobile);
        return () => mediaQuery.removeEventListener("change", checkMobile);
    }, []);

    // ============================ 핸들러 ============================
    // 이미지 클릭 함수
    const handleImageClick = (images: string[], index: number) => {
        setLightboxImages(images);
        setLightboxIndex(index);
        setLightboxOpen(true);
    };

    if (!philosophyData) return null;

    // 컨텐츠 1,2,3
    const content = (
        <>
            {philosophyData.id === "01" && <Philosophy01Content onImageClick={handleImageClick} />}
            {philosophyData.id === "02" && <Philosophy02Content />}
            {philosophyData.id === "03" && <Philosophy03Content onImageClick={handleImageClick} />}
        </>
    );

    // 모바일: 바텀 시트로 나옴
    if (isMobile) {
        return (
            <>
                <Drawer.Root
                    open={isOpen}
                    onOpenChange={(open) => {
                        // 라이트박스가 열려있으면 모달 닫기 무시
                        if (!open && lightboxOpen) {
                            return;
                        }
                        onClose();
                    }}
                >
                    <Drawer.Portal>
                        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40" />
                        <Drawer.Content className="bg-white flex flex-col rounded-t-[20px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50">
                            {/* Handle */}
                            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mt-4 mb-4" />

                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-start justify-between">
                                <div>
                                    <span className={`text-2xl font-light ${philosophyData.color} block mb-1`}>
                                        {philosophyData.number}
                                    </span>
                                    <Drawer.Title className="text-lg font-semibold text-gray-900 font-cafe24-gowoonbam">
                                        {philosophyData.title}
                                    </Drawer.Title>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-4 py-6 overflow-y-auto flex-1">
                                <Drawer.Description asChild>
                                    <div>{content}</div>
                                </Drawer.Description>
                            </div>
                        </Drawer.Content>
                    </Drawer.Portal>
                </Drawer.Root>

                {/* Lightbox - Drawer 외부에 렌더링 */}
                <Lightbox
                    open={lightboxOpen}
                    close={() => setLightboxOpen(false)}
                    index={lightboxIndex}
                    slides={lightboxImages.map((image) => ({ src: image }))}
                    styles={{
                        container: {
                            pointerEvents: "auto",
                        },
                    }}
                />
            </>
        );
    }

    // Desktop: Modal
    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(open) => {
                // 라이트박스가 열려있으면 모달 닫기 무시
                if (!open && lightboxOpen) {
                    return;
                }
                onClose();
            }}
        >
            <Dialog.Portal>
                {/* Backdrop */}
                <Dialog.Overlay asChild>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0 bg-black/50 z-40"
                    />
                </Dialog.Overlay>

                {/* Modal Content */}
                <Dialog.Content asChild>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] bg-white rounded-lg shadow-2xl max-w-6xl w-[95vw] max-h-[90vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-start justify-between">
                            <div>
                                <span className={`text-4xl font-light ${philosophyData.color} block mb-2`}>
                                    {philosophyData.number}
                                </span>
                                <Dialog.Title className="text-2xl font-semibold text-gray-900 font-cafe24-gowoonbam">
                                    {philosophyData.title}
                                </Dialog.Title>
                            </div>
                            <Dialog.Close asChild>
                                <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
                                    <X className="w-6 h-6" />
                                    <span className="sr-only">Close</span>
                                </button>
                            </Dialog.Close>
                        </div>

                        {/* Content - 스크롤 영역 */}
                        <div className="px-8 py-8 overflow-y-auto max-h-[calc(90vh-140px)]">
                            <Dialog.Description asChild>
                                <div>{content}</div>
                            </Dialog.Description>
                        </div>
                    </motion.div>
                </Dialog.Content>
            </Dialog.Portal>

            {/* Lightbox - Dialog 외부에 렌더링 */}
            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={lightboxImages.map((image) => ({ src: image }))}
                styles={{
                    container: {
                        pointerEvents: "auto",
                    },
                }}
            />
        </Dialog.Root>
    );
}
