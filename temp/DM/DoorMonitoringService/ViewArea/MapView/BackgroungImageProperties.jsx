import { Button } from "@progress/kendo-react-buttons";
import { Slider, NumericTextBox, Checkbox } from "@progress/kendo-react-inputs";
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from "@progress/kendo-react-layout";
import { Label } from "@progress/kendo-react-labels";
import { useRef, useState, useEffect } from "react";

/**
 * 배경 이미지 속성 컴포넌트
 * @param {Object} backgroundImage - 배경 이미지 정보
 * @param {function} onImageUpload - 이미지 업로드 함수
 * @param {function} onDeleteImage - 이미지 삭제 함수
 * @param {function} onImageResize - 이미지 크기 조절 함수
 *
 * 맵 뷰에서 배경 이미지 속성을 설정하는 컴포넌트
 */
export const BackgroundImageProperties = ({ backgroundImage, onImageUpload, onDeleteImage, onImageResize }) => {
    // ============================== useRef & useState ==============================
    const fileInputRef = useRef(null); // 파일 업로드 인풋 참조

    // ============================== 핸들러 ==============================
    // 이미지 업로드 핸들러
    const handleImageUpload = (e) => {
        onImageUpload(e);
        // 파일 선택 후 input value 초기화 (같은 파일 재선택 가능하게)
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // 크기 조절 핸들러 (비율 유지 기능 포함)
    const handleSizeChange = (dimension, value) => {
        if (!onImageResize) return;

        // 입력값 범위 제한
        let clampedValue = value;
        if (dimension === "width") {
            clampedValue = Math.max(100, Math.min(2000, value));
        } else if (dimension === "height") {
            clampedValue = Math.max(100, Math.min(1500, value));
        }

        onImageResize(dimension, clampedValue);
    };

    return (
        <>
            <style>
                {`
                    .slider-thumb::-webkit-slider-thumb {
                        appearance: none;
                        width: 18px;
                        height: 18px;
                        background: var(--kendo-color-primary);
                        cursor: pointer;
                        border-radius: 50%;
                        border: 2px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    .slider-thumb::-moz-range-thumb {
                        width: 18px;
                        height: 18px;
                        background: var(--kendo-color-primary);
                        cursor: pointer;
                        border-radius: 50%;
                        border: 2px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                `}
            </style>
            <Card
                style={{
                    width: "320px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                <CardHeader>
                    <div className="k-hbox k-justify-content-between k-align-items-center">
                        <div className="k-hbox k-gap-2 k-align-items-center">
                            <span className="k-icon k-i-image" />
                            <div>
                                <CardTitle className="text-base font-semibold">배경 이미지</CardTitle>
                                <CardSubtitle className="text-sm">
                                    {backgroundImage?.image ? "" : "이미지를 선택해주세요"}
                                </CardSubtitle>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardBody>
                    <div className="k-vbox k-gap-4">
                        {/* 이미지 업로드 영역 */}
                        <div className="k-vbox k-gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: "none" }}
                                id="background-image-upload"
                            />
                            <Button
                                themeColor={backgroundImage ? "base" : "primary"}
                                fillMode={backgroundImage ? "flat" : "solid"}
                                rounded="medium"
                                className="k-w-full"
                                onClick={() => document.getElementById("background-image-upload")?.click()}
                            >
                                이미지 {backgroundImage ? "변경하기" : "선택하기"}
                            </Button>
                        </div>

                        {backgroundImage && (
                            <div className="k-vbox k-gap-4">
                                {/* 이미지 크기 조절 */}
                                <div className="space-y-4 pb-4">
                                    <h4 className="text-sm font-semibold">이미지 크기 조절</h4>

                                    {/* 가로 크기 */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">가로 크기</span>
                                            <span className="text-sm font-bold text-[var(--kendo-color-primary)]">
                                                {Math.round(backgroundImage?.width || 0)}px
                                            </span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="range"
                                                    min={100}
                                                    max={2000}
                                                    step={10}
                                                    value={backgroundImage?.width || 0}
                                                    onChange={(e) =>
                                                        handleSizeChange("width", parseInt(e.target.value))
                                                    }
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                                    style={{
                                                        background: `linear-gradient(to right, var(--kendo-color-primary) 0%, var(--kendo-color-primary) ${
                                                            (((backgroundImage?.width || 0) - 100) / (2000 - 100)) * 100
                                                        }%, #e5e7eb ${
                                                            (((backgroundImage?.width || 0) - 100) / (2000 - 100)) * 100
                                                        }%, #e5e7eb 100%)`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 세로 크기 */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm">세로 크기</span>
                                            <span className="text-sm font-bold text-[var(--kendo-color-primary)]">
                                                {Math.round(backgroundImage?.height || 0)}px
                                            </span>
                                        </div>
                                        <div className="flex gap-2 items-center">
                                            <div className="flex-1 relative">
                                                <input
                                                    type="range"
                                                    min={100}
                                                    max={1500}
                                                    step={10}
                                                    value={backgroundImage?.height || 0}
                                                    onChange={(e) =>
                                                        handleSizeChange("height", parseInt(e.target.value))
                                                    }
                                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                                    style={{
                                                        background: `linear-gradient(to right, var(--kendo-color-primary) 0%, var(--kendo-color-primary) ${
                                                            (((backgroundImage?.height || 0) - 100) / (1500 - 100)) *
                                                            100
                                                        }%, #e5e7eb ${
                                                            (((backgroundImage?.height || 0) - 100) / (1500 - 100)) *
                                                            100
                                                        }%, #e5e7eb 100%)`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 이미지 삭제 버튼 */}
                                <Button
                                    themeColor="error"
                                    fillMode="outline"
                                    size="medium"
                                    rounded="medium"
                                    className="k-w-full"
                                    onClick={onDeleteImage}
                                    icon="trash"
                                >
                                    이미지 삭제
                                </Button>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </>
    );
};
