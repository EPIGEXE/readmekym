import { Button } from "@progress/kendo-react-buttons";
import { Dialog } from "@progress/kendo-react-dialogs";
import { GridLayout, GridLayoutItem } from "@progress/kendo-react-layout";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useState } from "react";
import BasicInfoSection from "./BasicInfoSection";
import IdBitSection from "./IdBitSection";
import ParityBitSection from "./ParityBitSection";
import ValidationSection from "./ValidationSection";
import { Loader2 } from "lucide-react";

import { useGlobalConfigStore } from "v2/libs";
import { getMessages } from "../../../transMessages";
import {
    useAddWiegandFormat,
    useUpdateWiegandFormat,
} from "../../../hooks/reactQueryHooks/useWiegandFormatApi";
import {
    convertRowToSchema,
    convertSchemaToRow,
} from "../../../utils/wiegandFormatUtiltiy";

// !IMPORTANT : 원래 BioLink에는 식별 코드라는 필드로 ID 필드 중 첫번째 값을 식별 코드로 사용할 지 결정하는 설정이 있었으나
// Wiegand 포맷 구조체에는 식별 코드 필드가 없어서 식별 코드 구분 없이 모두 ID 필드로 처리함

// ReadOnly 항목
const ReadOnlyWiegandFormat = [1, 2, 3, 4, 5];

// ===========================================
// Wiegand 포맷 스키마 정의
// ===========================================

// ID 필드 스키마
const IdFieldSchema = z.object({
    id: z.number(),
    startBit: z.number(),
    endBit: z.number(),
    length: z.number(),
});

// 패리티 필드 스키마
const ParityFieldSchema = z.object({
    id: z.number(),
    location: z.number(),
    type: z.enum(["even", "odd"]),
    startBit: z.number(),
    endBit: z.number(),
    length: z.number(),
});

const createWiegandFormatSchema = (messages) => {
    return (
        z
            .object({
                id: z.number().optional(),
                format_id: z.number().optional(),
                description: z
                    .string()
                    .max(
                        200,
                        messages.wiegandFormatDialog.validationMessages
                            .totalDescription
                    )
                    .optional(),
                totalBits: z
                    .number()
                    .min(
                        1,
                        messages.wiegandFormatDialog.validationMessages
                            .totalBits
                    )
                    .max(
                        64,
                        messages.wiegandFormatDialog.validationMessages
                            .totalBitsMax
                    ),
                idFields: z.array(IdFieldSchema),
                parityFields: z.array(ParityFieldSchema),
            }) // 1. 비트 범위 검증 - 모든 필드가 1부터 총 비트 수 이내에 있어야 함
            .refine(
                (data) => {
                    // 필드 비트 위치 검증 - 총 비트 수 초과 여부
                    const totalBits = data.totalBits;

                    // ID 필드 검증
                    for (const field of data.idFields) {
                        if (field.startBit < 0 || field.endBit > totalBits) {
                            return false;
                        }
                    }

                    // 패리티 필드 검증
                    for (const field of data.parityFields) {
                        if (field.startBit < 1 || field.endBit > totalBits) {
                            return false;
                        }
                    }

                    return true;
                },
                {
                    message:
                        messages.wiegandFormatDialog.validationMessages
                            .bitRangeError,
                    path: ["bitRangeError"],
                }
            )
            // 2. 시작 비트가 종료 비트보다 작거나 같아야 함
            .refine(
                (data) => {
                    // ID 필드 검증
                    for (const field of data.idFields) {
                        if (field.startBit > field.endBit) {
                            return false;
                        }
                    }

                    // 패리티 필드 검증
                    for (const field of data.parityFields) {
                        if (field.startBit > field.endBit) {
                            return false;
                        }
                    }

                    return true;
                },
                {
                    message:
                        messages.wiegandFormatDialog.validationMessages
                            .bitOrderError,
                    path: ["bitOrderError"],
                }
            )
            // 3. 서로 다른 필드 간 비트 중복을 체크하지만, 패리티 비트는 특별 처리
            .refine(
                (data) => {
                    // 필드 간 비트 중복 검증 (패리티 필드는 제외)
                    const bitPositions = new Array(data.totalBits + 1).fill(
                        false
                    );

                    // ID 필드 비트 체크
                    for (const field of data.idFields) {
                        for (let i = field.startBit; i <= field.endBit; i++) {
                            if (bitPositions[i]) return false;
                            bitPositions[i] = true;
                        }
                    }

                    // 패리티 필드 비트 범위 체크 (중복 검사 제거, 범위만 체크)
                    for (const field of data.parityFields) {
                        // startBit과 endBit이 totalBits 범위를 넘는지만 체크
                        if (
                            field.startBit < 0 ||
                            field.startBit > data.totalBits ||
                            field.endBit < 0 ||
                            field.endBit > data.totalBits ||
                            field.startBit > field.endBit
                        ) {
                            return false;
                        }
                    }

                    return true;
                },
                {
                    message:
                        messages.wiegandFormatDialog.validationMessages
                            .bitOverlapError,
                    path: ["bitOverlapError"],
                }
            )
            // 4. ID 필드와 시설 코드 필드가 할당되었는지 확인 (패리티 필드 제외)
            .refine(
                (data) => {
                    // 최소한 하나의 ID 필드가 있어야 함
                    if (data.idFields.length === 0) return false;

                    // ID 필드와 시설 코드 필드로 모든 비트가 할당되었는지 확인
                    return true;
                },
                {
                    message:
                        messages.wiegandFormatDialog.validationMessages
                            .idFieldRequired,
                    path: ["idFieldRequired"],
                }
            )
    );
};

const WiegandFormatDialog = ({
    isOpen,
    mode = "create",
    initialData,
    onClose,
}) => {
    const {
        mutateAsync: addWiegandFormat,
        isPending: isAddWiegandFormatPending,
    } = useAddWiegandFormat();
    const {
        mutateAsync: updateWiegandFormat,
        isPending: isUpdateWiegandFormatPending,
    } = useUpdateWiegandFormat();

    const { globalConfig } = useGlobalConfigStore();
    const messages = getMessages(globalConfig?.languageId);

    const WiegandFormatSchema = useMemo(
        () => createWiegandFormatSchema(messages),
        [messages]
    );

    const isCreateMode = mode === "create";
    const dialogTitle = isCreateMode
        ? messages.wiegandFormatDialog.createTitle
        : messages.wiegandFormatDialog.editTitle;
    const isReadOnly = ReadOnlyWiegandFormat.includes(initialData?.id);
    const isPending = isAddWiegandFormatPending || isUpdateWiegandFormatPending;
    const isDisabled = isPending || isReadOnly;

    // React Hook Form 설정
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid },
        setValue,
        trigger,
        reset,
    } = useForm({
        resolver: zodResolver(WiegandFormatSchema),
        defaultValues: {
            description: "",
            format_id: initialData?.format_id || 0,
            totalBits: 26,
            idFields: [],
            parityFields: [],
        },
        mode: "onChange",
    });

    // ID 비트와 패리티 비트 상태 관리
    const [idFields, setIdFields] = useState([]);
    const [parityFields, setParityFields] = useState([]);

    // 폼 값 감시
    const values = watch();

    // 비트 필드 변경 시 폼 값 업데이트
    useEffect(() => {
        if (initialData) {
            const wiegandFormat = convertRowToSchema(initialData);
            Object.entries(wiegandFormat).forEach(([key, value]) => {
                setValue(key, value);
            });
            setIdFields(wiegandFormat.idFields || []);
            setParityFields(wiegandFormat.parityFields || []);
        } else {
            // create 모드일 때 format_id가 설정되어 있으면 폼에 설정
            if (initialData?.format_id) {
                setValue("format_id", initialData.format_id);
            }
        }
    }, [initialData, setValue]);

    // 비트 필드 변경 시 폼 값 업데이트
    useEffect(() => {
        setValue("idFields", idFields);
        setValue("parityFields", parityFields);
        trigger(); // 전체 폼 유효성 재검증
    }, [idFields, parityFields, setValue, trigger]);

    const handleInputChange = useCallback(
        (field) => (e) => {
            setValue(field, e.value, { shouldValidate: true });
            trigger();
        },
        [setValue, trigger]
    );

    // 기본 정보 유효성 검증 오류 - 기본 정보 섹션 리랜더링 방지로 오류를 분리
    const basicInfoErrors = useMemo(
        () => ({
            description: errors.description,
            totalBits: errors.totalBits,
        }),
        [errors.description, errors.totalBits]
    );

    // ===========================================
    // ID 비트 관련 로직
    // ===========================================

    // ID 비트 추가
    const handleAddIdField = useCallback(() => {
        const maxId = Math.max(0, ...idFields.map((item) => item.id));
        const newField = {
            id: maxId + 1,
            startBit: 1,
            endBit: 1,
            length: 1,
            inEdit: true,
            isNew: true,
        };

        setIdFields([...idFields, newField]);
    }, [idFields]);

    const handleIdFieldEdit = useCallback(
        (dataItem) => {
            setIdFields(
                idFields.map((item) =>
                    item.id === dataItem.id ? { ...item, inEdit: true } : item
                )
            );
        },
        [idFields]
    );

    const handleIdFieldSave = useCallback(
        (dataItem) => {
            try {
                const { inEdit, ...fieldData } = dataItem;
                // 길이 자동 계산
                fieldData.length = fieldData.endBit - fieldData.startBit + 1;

                setIdFields(
                    idFields.map((item) =>
                        item.id === fieldData.id ? fieldData : item
                    )
                );
            } catch (error) {
                console.error("ID 필드 저장 오류:", error);
            }
        },
        [idFields]
    );

    const handleIdFieldCancel = useCallback(
        (dataItem) => {
            if (dataItem.isNew) {
                // 새로 추가된 항목이면 목록에서 제거
                setIdFields(idFields.filter((item) => item.id !== dataItem.id));
            } else {
                // 기존 항목이면 편집 모드만 취소
                setIdFields(
                    idFields.map((item) =>
                        item.id === dataItem.id
                            ? { ...item, inEdit: false }
                            : item
                    )
                );
            }
        },
        [idFields]
    );

    // ===========================================
    // 패리티 비트 관련 로직
    // ===========================================

    // 패리티 비트 추가
    const handleAddParityField = useCallback(() => {
        const maxId = Math.max(0, ...parityFields.map((item) => item.id));
        const newField = {
            id: maxId + 1,
            location: 0,
            type: "even",
            startBit: 1,
            endBit: 1,
            length: 1,
            inEdit: true,
            isNew: true,
        };

        setParityFields([...parityFields, newField]);
    }, [parityFields]);

    const handleParityFieldEdit = useCallback(
        (dataItem) => {
            setParityFields(
                parityFields.map((item) =>
                    item.id === dataItem.id ? { ...item, inEdit: true } : item
                )
            );
        },
        [parityFields]
    );

    const handleParityFieldSave = useCallback(
        (dataItem) => {
            const { inEdit, ...fieldData } = dataItem;
            // 길이와 위치 자동 계산
            fieldData.length = fieldData.endBit - fieldData.startBit + 1;

            setParityFields(
                parityFields.map((item) =>
                    item.id === fieldData.id ? fieldData : item
                )
            );
        },
        [parityFields]
    );

    const handleParityFieldCancel = useCallback(
        (dataItem) => {
            if (dataItem.isNew) {
                setParityFields(
                    parityFields.filter((item) => item.id !== dataItem.id)
                );
            } else {
                setParityFields(
                    parityFields.map((item) =>
                        item.id === dataItem.id
                            ? { ...item, inEdit: false }
                            : item
                    )
                );
            }
        },
        [parityFields]
    );

    const onSave = async (data) => {
        const row = convertSchemaToRow(data);
        await addWiegandFormat(row);
    };

    const onEdit = async (data) => {
        const row = convertSchemaToRow(data);
        await updateWiegandFormat(row);
    };

    // ===========================================
    // 폼 제출 처리
    // ===========================================
    const onSubmit = async (data) => {
        console.log(data);
        try {
            const completeData = {
                ...data,
                idFields: idFields,
                parityFields: parityFields,
            };

            // 제출 전 최종 유효성 검증
            const validatedData = WiegandFormatSchema.parse(completeData);

            if (isCreateMode) {
                await onSave(validatedData);
            } else {
                await onEdit(validatedData);
            }
            reset(); // 폼 초기화
            setIdFields([]); // ID 비트 초기화
            setParityFields([]); // 패리티 비트 초기화
            onClose();
        } catch (error) {
            console.error("폼 제출 오류:", error);
        }
    };

    // 취소 버튼 핸들러 수정
    const handleCancel = () => {
        reset(); // 폼 초기화
        setIdFields([]); // ID 비트 초기화
        setParityFields([]); // 패리티 비트 초기화
        onClose();
    };

    if (!isOpen) return null;

    // 동적으로 행 구성
    const gridRows = [
        { height: "auto" }, // 기본 정보
    ];

    gridRows.push({ height: "300px" }); // ID 비트
    gridRows.push({ height: "300px" }); // 패리티 비트 (항상 마지막)

    return (
        <Dialog title={dialogTitle} onClose={onClose} width={1200}>
            <div className="p-3 max-h-[700px] overflow-y-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <GridLayout
                        gap={{ rows: 20, cols: 0 }}
                        cols={[{ width: "1fr" }]}
                        rows={gridRows}
                    >
                        {/* 기본 정보 섹션 */}
                        <GridLayoutItem row={1} col={1}>
                            <BasicInfoSection
                                isReadOnly={isDisabled}
                                description={values.description}
                                totalBits={values.totalBits}
                                errors={basicInfoErrors}
                                handleInputChange={handleInputChange}
                                control={control}
                            />
                        </GridLayoutItem>

                        {/* ID 비트 섹션 */}
                        <GridLayoutItem row={2} col={1}>
                            <IdBitSection
                                isReadOnly={isDisabled}
                                idFields={idFields}
                                setIdFields={setIdFields}
                                handleAddIdField={handleAddIdField}
                                handleIdFieldSave={handleIdFieldSave}
                                handleIdFieldCancel={handleIdFieldCancel}
                                handleIdFieldEdit={handleIdFieldEdit}
                            />
                        </GridLayoutItem>

                        {/* 패리티 비트 섹션 */}
                        <GridLayoutItem row={3} col={1}>
                            <ParityBitSection
                                isReadOnly={isDisabled}
                                parityFields={parityFields}
                                setParityFields={setParityFields}
                                handleAddParityField={handleAddParityField}
                                handleParityFieldSave={handleParityFieldSave}
                                handleParityFieldCancel={
                                    handleParityFieldCancel
                                }
                                handleParityFieldEdit={handleParityFieldEdit}
                            />
                        </GridLayoutItem>
                    </GridLayout>

                    <ValidationSection errors={errors} />

                    {/* 하단 버튼 */}
                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            look="flat"
                            themeColor="primary"
                            type="submit"
                            disabled={!isValid || isDisabled}
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>
                                        {mode !== "create"
                                            ? messages.common.editing
                                            : messages.common.adding}
                                    </span>
                                </div>
                            ) : mode !== "create" ? (
                                messages.common.edit
                            ) : (
                                messages.common.add
                            )}
                        </Button>
                        <Button
                            look="outline"
                            onClick={handleCancel}
                            type="button"
                            disabled={isPending}
                        >
                            {messages.common.cancel}
                        </Button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
};

export default WiegandFormatDialog;
