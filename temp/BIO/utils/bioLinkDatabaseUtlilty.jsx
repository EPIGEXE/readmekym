import { DropDownList } from '@progress/kendo-react-dropdowns';
import linkedReaderKeyRenderer from '../components/common/LinkedReaderkeyRenderer';


// ===========================================
// 생체 장치 관리 - 테이블 값의 속성 정의
// ===========================================


// 숫자 논리 값
export const NumberBoolean = {
    FALSE: 0,
    TRUE: 1,
};

// 인증 스케줄
export const AuthSchedule = {
    BIOMETRIC_ONLY: 0, // 생체정보
    BIOMETRIC_PIN: 1, // 생체정보 + PIN번호
    CARD_ONLY: 2, // 카드번호
    CARD_BIOMETRIC: 3, // 카드번호 + 생체정보
    CARD_PIN: 4, // 카드번호 + PIN번호
    CARD_BIOMETRIC_OR_PIN: 5, // 카드번호 + 생체정보 or PIN번호
    CARD_BIOMETRIC_PIN: 6, // 카드번호 + 생체정보 + PIN번호
    ID_BIOMETRIC: 7, // ID + 생체정보
    ID_PIN: 8, // ID + PIN번호
    ID_BIOMETRIC_OR_PIN: 9, // ID + 생체정보 or PIN번호
    ID_BIOMETRIC_PIN: 10, // ID + 생체정보 + PIN번호

    toLabel: (mode) =>
        ({
            0: '생체정보',
            1: '생체정보 + PIN번호',
            2: '카드번호',
            3: '카드번호 + 생체정보',
            4: '카드번호 + PIN번호',
            5: '카드번호 + 생체정보 or PIN번호',
            6: '카드번호 + 생체정보 + PIN번호',
            7: 'ID + 생체정보',
            8: 'ID + PIN번호',
            9: 'ID + 생체정보 or PIN번호',
            10: 'ID + 생체정보 + PIN번호',
        }[mode] || '알 수 없는 인증 모드'),

    // 인증 요소 체크 유틸리티 함수들
    usesBiometric: (mode) => {
        return [0, 1, 3, 5, 6, 7, 9, 10].includes(mode);
    },
    usesPin: (mode) => {
        return [1, 4, 5, 6, 8, 9, 10].includes(mode);
    },
    usesCard: (mode) => {
        return [2, 3, 4, 5, 6].includes(mode);
    },
    usesId: (mode) => {
        return [7, 8, 9, 10].includes(mode);
    },
};

// 전역 APB 실패 처리
export const GlobalAPBFailAction = {
    NONE: 0,
    SOFT: 1,
    HARD: 2,
    toLabel: (value) =>
        ({
            0: 'APB 검사 안함',
            1: 'APB 검사 실패 시 소프트 처리',
            2: 'APB 검사 실패 시 하드 처리',
        }[value] || '알 수 없음'),
};

// 얼굴 검출 레벨
export const FaceDetectionLevel = {
    None: 0,
    Normal: 1,
    Strict: 2,
    toLabel: (value) =>
        ({
            0: '얼굴 검출 없음',
            1: '얼굴 검출 기본',
            2: '얼굴 검출 엄격',
        }[value] || '알 수 없음'),
};

// CardConfig 바이트 순서
export const ByteOrder = {
    MSB: 0,
    LSB: 1,
    toLabel: (value) =>
        ({
            0: 'MSB',
            1: 'LSB',
        }[value] || '알 수 없음'),
};

// CardConfig 데이터 타입
export const CardDataType = {
    BINARY: 0,
    ASCII: 1,
    UTF16: 2,
    BCD: 3,
    toLabel: (value) =>
        ({
            0: '이진',
            1: 'ASCII',
            2: 'UTF-16',
            3: 'BCD',
        }[value] || '알 수 없음'),
};

// Desfire 암호화 타입
export const DesfireEncryptionType = {
    DES_3DES: 0,
    AES: 1,
    toLabel: (value) =>
        ({
            0: 'DES/3DES',
            1: 'AES',
        }[value] || '알 수 없음'),
};

// FaceConfig 보안 레벨
export const SecurityLevel = {
    Basic: 0,
    High: 1,
    VeryHigh: 2,
    toLabel: (value) =>
        ({
            0: '기본',
            1: '높음',
            2: '매우 높음',
        }[value] || '알 수 없음'),
};

// FaceConfig 조명 조건
export const LightCondition = {
    Indoor: 0,
    Outdoor: 1,
    Auto: 3,
    None: 4,
    toLabel: (value) =>
        ({
            0: '실내',
            1: '실외',
            3: '자동',
            4: '사용 안함',
        }[value] || '알 수 없음'),
};

// FaceConfig 등록 임계치
export const EnrollThreshold = {
    Threshold0: 0,
    Threshold1: 1,
    Threshold2: 2,
    Threshold3: 3,
    Threshold4: 4,
    Threshold5: 5,
    Threshold6: 6,
    Threshold7: 7,
    Threshold8: 8,
    Threshold9: 9,
    toLabel: (value) =>
        ({
            0: '0(엄격)',
            1: '1',
            2: '2',
            3: '3',
            4: '4(기본)',
            5: '5',
            6: '6',
            7: '7',
            8: '8',
            9: '9(느슨)',
        }[value] || '알 수 없음'),
};

// FaceConfig 감지 민감도
export const DetectSensitivity = {
    None: 0,
    Low: 1,
    Medium: 2,
    High: 3,
    toLabel: (value) =>
        ({
            0: '사용 안함',
            1: '낮음',
            2: '중간',
            3: '높음',
        }[value] || '알 수 없음'),
};

// FaceConfig 등록 타임아웃
export const EnrollTimeout = {
    TimeoutMin: 30,
    TimeoutMax: 60,
    TimeoutDefault: 60,
    toLabel: (value) =>
        ({
            30: '30초',
            60: '60초',
        }[value] || '알 수 없음'),
};

// FaceConfig 얼굴 위조 방지 레벨
export const lfdLevel = {
    None: 0,
    Low: 1,
    Medium: 2,
    High: 3,
    toLabel: (value) =>
        ({
            0: '사용 안함',
            1: '민감도 낮음',
            2: '민감도 중간',
            3: '민감도 높음',
        }[value] || '알 수 없음'),
};

// FaceConfig 빠른 등록 옵션
export const PreviewOption = {
    None: 0,
    Half: 1,
    Full: 2,
    toLabel: (value) =>
        ({
            0: '사용 안함',
            1: '1/2 지점에서 표시',
            2: '전 구간 표시',
        }[value] || '알 수 없음'),
};

// FaceConfig 동작 모드
export const OperationMode = {
    FusionMode: 0,
    VisualMode: 1,
    Visual_IRMode: 2,
    toLabel: (value) =>
        ({
            0: 'Fusion 모드',
            1: 'Visual 모드',
            2: 'Visual_IR 모드',
        }[value] || '알 수 없음'),
};

// FaceConfig 최대 회전 각도
export const MaxRotation = {
    Default: 15,
    Angle15: 15,
    Angle30: 30,
    Angle45: 45,
    Angle60: 60,
    Angle75: 75,
    Angle90: 90,
    AngleMax: 90,
    toLabel: (value) =>
        ({
            15: '15도',
            30: '30도',
            45: '45도',
            60: '60도',
            75: '75도',
            90: '90도',
        }[value] || '알 수 없음'),
};

// FaceConfig 얼굴 너비 픽셀
export const FaceWidth = {
    FSF2: { min: 66, max: 250 },
    BS3: { min: 130, max: 350 },
    BEW3: { min: 130, max: 350 },
};

// FaceConfig 검색 범위
export const SearchRange = {
    FSF2: { x: 144, width: 432 },
    BS3: { x: 90, width: 540 },
    BEW3: { x: 90, width: 540 },
};

// FaceConfig 검출 거리
export const DetectDistance = {
    FSF2: {
        min_min: 30,
        min_max: 130,
        min_default: 40,
        max_min: 130,
        max_max: 255,
        max_default: 130,
    },
    BS3: {
        min_min: 30,
        min_max: 100,
        min_default: 40,
        max_min: 100,
        max_max: 255,
        max_default: 100,
    },
    BEW3: {
        min_min: 30,
        min_max: 100,
        min_default: 40,
        max_min: 100,
        max_max: 255,
        max_default: 100,
    },
};

// FaceConfiExt 열화상 감지 모드
export const ThermalCheckMode = {
    None: 0,
    Hard: 1,
    Soft: 2,
    toLabel: (value) =>
        ({
            0: '열화상 감지 사용 안함',
            1: '열화상 감지 사용(HARD)',
            2: '열화상 감지 사용(SOFT)',
        }[value] || '알 수 없음'),
};

// FaceConfigExt 마스크 감지 모드
export const MaskCheckMode = {
    None: 0,
    Hard: 1,
    Soft: 2,
    MaskForbidden: 3,
    toLabel: (value) =>
        ({
            0: '마스크 감지 사용 안함',
            1: '마스크 감지 사용(HARD)',
            2: '마스크 감지 사용(SOFT)',
            3: '마스크 착용 금지',
        }[value] || '알 수 없음'),
};

// FaceConfigExt 열화상 포맷
export const ThermalFormat = {
    Fahrenheit: 0,
    Celsius: 1,
    toLabel: (value) =>
        ({
            0: '화씨',
            1: '섭씨',
        }[value] || '알 수 없음'),
};

// FaceConfigExt 마스크 감지 레벨
export const MaskDetectionLevel = {
    None: 0,
    Medium: 1,
    High: 2,
    VeryHigh: 3,
    toLabel: (value) =>
        ({
            0: '마스크 감지 레벨 없음',
            1: '마스크 감지 레벨 중간',
            2: '마스크 감지 레벨 높음',
            3: '마스크 감지 레벨 매우 높음',
        }[value] || '알 수 없음'),
};

// FaceConfigExt 발열 및 마스크 착용 인증 순서
export const FaceCheckOrder = {
    ThermalFirst: 0,
    MaskFirst: 1,
    ThermalOnly: 2,
    toLabel: (value) =>
        ({
            0: '인증 후 발열 측정 및 마스크 착용 감지',
            1: '발열 측정 및 마스크 착용 감지 후 인증',
            2: '인증 절차 생략, 발열 검사 및 마스크 착용 감지만 수행',
        }[value] || '알 수 없음'),
};

// FingerprintConfig Fast 모드
export const FastMode = {
    Auto: 0,
    Basic: 1,
    Fast: 2,
    VeryFast: 3,
    toLabel: (value) =>
        ({
            0: '자동',
            1: '기본',
            2: '빠름',
            3: '매우 빠름',
        }[value] || '알 수 없음'),
};

// FingerprintConfig 민감도
export const Sensitivity = {
    Sensitivity0: 0,
    Sensitivity1: 1,
    Sensitivity2: 2,
    Sensitivity3: 3,
    Sensitivity4: 4,
    Sensitivity5: 5,
    Sensitivity6: 6,
    Sensitivity7: 7,
    toLabel: (value) =>
        ({
            0: '0',
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
            6: '6',
            7: '7',
        }[value] || '알 수 없음'),
};

// FingerprintConfig 센서 포맷
export const TemplateFormat = {
    Suprema: 0,
    Global: 1,
    Ansi: 2,
    toLabel: (value) =>
        ({
            0: 'Suprema 포맷',
            1: '국제 포맷',
            2: 'Ansi 포맷',
        }[value] || '알 수 없음'),
};

// WiegandConfig 모드
export const Mode = {
    input: 0,
    output: 1,
    inputOutput: 2,
    toLabel: (value) =>
        ({
            0: '입력 전용',
            1: '출력 전용',
            2: '입출력 전용',
        }[value] || '알 수 없음'),
};

// WiegandConfig Bypass 코드
export const WiegandBypassCode = {
    Auth: 0,
    NoneAuth: 1,
    toLabel: (value) =>
        ({
            0: '인증되면 출력',
            1: '인증 없이 출력',
        }[value] || '알 수 없음'),
};

// WiegandConfig 사용자 ID 출력
export const UseWiegandUserId = {
    CardId: 1,
    UserId: 2,
    toLabel: (value) =>
        ({
            1: '카드 ID',
            2: '사용자 ID',
        }[value] || '알 수 없음'),
};



// ===========================================
// 스키마 및 기본 값
// ===========================================
export const bioLinkDatabaseSchema = {
    BS2AuthConfig: {
        id: 0,
        deviceId: 0,
        authSchedule: AuthSchedule.BIOMETRIC_ONLY,
        useGlobalAPB: NumberBoolean.FALSE,
        globalAPBFailAction: GlobalAPBFailAction.NONE,
        useGroupMatching: NumberBoolean.FALSE,
        reserved: 0,
        reserved2: '',
        usePrivateAuth: NumberBoolean.FALSE,
        faceDetectionLevel: FaceDetectionLevel.None,
        userServerMatching: NumberBoolean.FALSE,
        useFullAccess: 0,
        matchTimeout: 5,
        authTimeout: 5,
        numOperators: 1,
        reserved3: '',
    },
    BS2AuchConfigExt: {
        id: 0,
        deviceId: 0,
        authSchedule: AuthSchedule.BIOMETRIC_ONLY,
        useGlobalAPB: NumberBoolean.FALSE,
        globalAPBFailAction: GlobalAPBFailAction.NONE,
        useGroupMatching: NumberBoolean.FALSE,
        reserved: 0,
        reserved2: '',
        usePrivateAuth: NumberBoolean.FALSE,
        faceDetectionLevel: FaceDetectionLevel.None,
        userServerMatching: NumberBoolean.FALSE,
        useFullAccess: 0,
        matchTimeout: 5,
        authTimeout: 5,
        numOperators: 1,
        reserved3: '',
    },
    BS2BlackList: {
        id: 0,
        deviceId: 0,
        cardId: 0,
        issueCount: 0,
    },
    BS2CardConfig: {
        id: 0,
        deviceId: 0,
        byteOrder: ByteOrder.MSB,
        useWiegandFormat: NumberBoolean.FALSE,
        dataType: CardDataType.BINARY,
        useSecondaryKey: NumberBoolean.FALSE,
        formatId: 0,
        cipher: NumberBoolean.FALSE,
        reserved2: '',
        mifare_primaryKey: '',
        mifare_reserved1: '',
        mifare_secondaryKey: '',
        mifare_reserved2: '',
        mifare_startBlockIndex: 0,
        mifare_reserved: '',
        iclass_primaryKey: '',
        iclass_secondaryKey: '',
        iclass_startBlockIndex: 0,
        iclass_reserved: '',
        desfire_primaryKey: '',
        desfire_secondaryKey: '',
        desfire_appId: '',
        desfire_fileId: 0,
        desfire_encryptionType: DesfireEncryptionType.DES_3DES,
        desfire_operationMode: 0,
        desfire_reserved: '',
    },
    BS2FaceConfig: {
        id: 0,
        deviceId: 0,
        securityLevel: SecurityLevel.Basic,
        lightCondition: LightCondition.Auto,
        enrollThreshold: EnrollThreshold.Threshold4,
        detectSensitivity: DetectSensitivity.None,
        enrollTimeout: EnrollTimeout.TimeoutDefault,
        lfdLevel: lfdLevel.None,
        quickEnrollment: NumberBoolean.FALSE,
        previewOption: PreviewOption.None,
        checkDuplicate: NumberBoolean.FALSE,
        operationMode: OperationMode.FusionMode,
        maxRotation: MaxRotation.Default,
        faceWidthMin: FaceWidth.FSF2.min,
        faceWidthMax: FaceWidth.FSF2.max,
        searchRangeX: SearchRange.FSF2.x,
        searchRangeY: SearchRange.FSF2.width,
        reserved2: '',
        detectDistanceMin: DetectDistance.FSF2.min_default,
        detectDistanceMax: DetectDistance.FSF2.max_default,
        wideSearch: NumberBoolean.FALSE,
    },
    BS2FaceConfigExt: {
        id: 0,
        deviceId: 0,
        thermalCheckMode: ThermalCheckMode.None,
        maskCheckMode: MaskCheckMode.None,
        reserved: '',
        thermalFormat: ThermalFormat.Fahrenheit,
        reserved2: 0,
        thermalThresholdLow: 3200,
        thermalThresholdHigh: 3800,
        maskDetectionLevel: MaskDetectionLevel.None,
        auditTemperature: NumberBoolean.FALSE,
        useRejectSound: NumberBoolean.FALSE,
        useOverlapThermal: NumberBoolean.FALSE,
        useDynamicROI: NumberBoolean.FALSE,
        faceCheckOrder: FaceCheckOrder.ThermalFirst,
    },
    BS2FactoryConfig: {
        id: 0,
        deviceId: 0,
        macAddr: '',
        reserved: '',
        modelName: '',
        boardVerMajor: 0,
        boardVerMinor: 0,
        boardVerExt: 0,
        boardVerReserved: '',
        kernelVerMajor: 0,
        kernelVerMinor: 0,
        kernelVerExt: 0,
        kernelVerReserved: '',
        bscoreVerMajor: 0,
        bscoreVerMinor: 0,
        bscoreVerExt: 0,
        bscoreVerReserved: '',
        firmwareVerMajor: 0,
        firmwareVerMinor: 0,
        firmwareVerExt: 0,
        firmwareVerReserved: '',
        kernelRev: '',
        bscoreRev: '',
        firmwareRev: '',
        reserved2: '',
    },
    BS2FingerprintConfig: {
        id: 0,
        deviceId: 0,
        securiryLevel: SecurityLevel.Basic,
        fastMode: FastMode.Auto,
        sensitivity: Sensitivity.Sensitivity0,
        sensorMode: 0,
        templateFormat: TemplateFormat.Ansi,
        scanTimeout: 10,
        successiveScan: 0,
        advancedEnrollment: NumberBoolean.FALSE,
        showImage: NumberBoolean.FALSE,
        lfdLevel: lfdLevel.None,
        checkDuplicate: NumberBoolean.FALSE,
        reserved3: '',
    },
    BS2IpConfig: {
        id: 0,
        deviceId: 0,
        connectionMode: 0,
        useDhcp: NumberBoolean.FALSE,
        useDns: NumberBoolean.FALSE,
        reserved: '',
        ipAddress: '',
        gateway: '',
        serverAddr: '',
        port: 0,
        serverPort: 0,
        mtuSize: 0,
        baseband: 0,
        reserved2: '',
        sslServerPort: 0,
        reserved3: '',
    },
    BS2Operators: {
        id: 0,
        userId: 0,
        level: 0,
        reserved: '',
    },
    BS2SystemConfig: {
        id: 0,
        deviceId: 0,
        timezone: 0,
        syncTime: 0,
        serverSync: 0,
        deviceLocked: 0,
        useInterphone: NumberBoolean.FALSE,
        useUSBConnection: NumberBoolean.FALSE,
        keyEncrypted: NumberBoolean.FALSE,
        useJobCode: NumberBoolean.FALSE,
        useAlphanumericId: NumberBoolean.FALSE,
        cameraFrequency: 0,
        secureTamper: NumberBoolean.FALSE,
        reserved0: 0,
        reserved: '',
        useCardOperatonMask: NumberBoolean.FALSE,
        reserved2: '',
    },
    BS2WiegandConfig: {
        id: 0,
        deviceId: 0,
        mode: Mode.input,
        useWiegandBypass: WiegandBypassCode.Auth,
        useFailCode: NumberBoolean.FALSE,
        failCode: 0,
        outPulseWidth: 0,
        outPulseInterval: 0,
        formatId: 0,
        formatLength: 0,
        idFields0: '',
        idFields1: '',
        idFields2: '',
        idFields3: '',
        parityFields0_parityField3: '',
        parityType0_parityType3: 0,
        parityPos0_parityPos3: 0,
        wiegandInputMask: 0,
        wiegandCardMask: 0,
        wiegandCsnIndex: 0,
        useWiegandUserId: UseWiegandUserId.CardId,
        reserved: '',
    },
    BioDevice: {
        id: 0,
        facilityId: 0,
        description: '',
        vendor: 0,
        deviceId: '',
        deviceIp: '',
        OpId: 0,
        modified: '',
        LinkedReaderkey: '',
        LinkedAcSystem: 0,
    },
};



//==========================================
// 생체 장치 관리 - 관리자 설정 셀 렌더러
//==========================================

// 불리언 타입 셀 렌더러(사용/사용 안함)
const booleanCellRenderer =
    (field, trueLabel = '사용 (1)', falseLabel = '사용 안함 (0)') =>
    (props) => {
        const options = [
            { text: trueLabel, value: NumberBoolean.TRUE },
            { text: falseLabel, value: NumberBoolean.FALSE },
        ];

        return (
            <td>
                <DropDownList
                    data={options}
                    textField="text"
                    dataItemKey="value"
                    value={options?.find((item) => item.value === props.dataItem[field])}
                    onChange={(e) => {
                        props.onChange({
                            dataItem: props.dataItem,
                            field: field,
                            value: e.target.value.value,
                        });
                    }}
                    style={{ width: '100%' }}
                />
            </td>
        );
    };

// 열거형 값 셀 렌더러(APB 실패 동작, 얼굴 인식 레벨 등)
const enumCellRenderer = (field, enumObj) => (props) => {
    const options = createOptionsFromEnum(enumObj);
    return (
        <td>
            <DropDownList
                data={options}
                textField="text"
                dataItemKey="value"
                value={options?.find((item) => item.value === props.dataItem[field])}
                onChange={(e) => {
                    props.onChange({
                        dataItem: props.dataItem,
                        field: field,
                        value: e.target.value.value,
                    });
                }}
                style={{ width: '100%' }}
            />
        </td>
    );
};

// 복합 객체 셀 렌더러
const complexObjectCellRenderer = (field, objMap, objKey) => (props) => {
    const value = props.dataItem[field];

    // 옵션 생성 - 기기 타입과 값을 함께 표시
    const options = Object.keys(objMap).map((deviceType) => ({
        text: `${deviceType} (${objMap[deviceType][objKey]})`,  // "FSF2 (66)" 형식으로 표시
        value: objMap[deviceType][objKey],
    }));

    // 현재 값과 일치하는 옵션 찾기
    const selectedOption = options.find((item) => item.value === value) || options[0];

    return (
        <td>
            <DropDownList
                data={options}
                textField="text"
                dataItemKey="value"
                value={selectedOption}
                onChange={(e) => {
                    props.onChange({
                        dataItem: props.dataItem,
                        field: field,
                        value: e.target.value.value,
                    });
                }}
                style={{ width: '100%' }}
            />
        </td>
    );
};

// 열거형에서 옵션 배열 자동 생성 함수
const createOptionsFromEnum = (enumObj) => {
    // 값만 추출 (toLabel과 같은 함수 제외)
    const values = Object.keys(enumObj)
        .filter(key => typeof enumObj[key] === 'number')
        .map(key => enumObj[key]);

    // 값에서 옵션 배열 생성 - 텍스트에 값도 포함
    return values.map((value) => ({
        text: `${enumObj.toLabel(value)} (${value})`, // "APB 검사 안함 (0)" 형식으로 표시
        value: value,
    }));
};


//==========================================
// 생체 장치 관리 - 관리자 설정 테이블 컬럼 정의
//==========================================

export const bioLinkDatabaseColumns = {
    BS2AuthConfig: {
        device_id: {
            title: '디바이스 ID',
            editable: false,
        },
        auth_schedule: {
            title: '인증 스케줄',
            editor: 'numeric',
        },
        use_global_apb: {
            title: 'APB 사용',
            cell: booleanCellRenderer('use_global_apb'),
        },
        global_apbfail_action: {
            title: '글로벌 APB 실패 동작',
            width: '300px',
            cell: enumCellRenderer('global_apbfail_action', GlobalAPBFailAction),
        },
        use_group_matching: {
            title: '그룹 매칭 사용',
            cell: booleanCellRenderer('use_group_matching'),
        },
        use_private_auth: {
            title: '사용자 인증 사용',
            cell: booleanCellRenderer('use_private_auth'),
        },
        face_detection_level: {
            title: '얼굴 인식 레벨',
            width: '180px',
            cell: enumCellRenderer('face_detection_level', FaceDetectionLevel),
        },
        use_server_matching: {
            title: '사용자 서버 매칭 사용',
            width: '180px',
            cell: booleanCellRenderer('use_server_matching'),
        },
        use_full_access: {
            title: '전체 접근 사용',
            editor: 'numeric',
        },
        match_timeout: {
            title: '매칭 타임아웃',
            editor: 'numeric',
        },
        auth_timeout: {
            title: '인증 타임아웃',
            editor: 'numeric',
        },
        num_operators: {
            title: '운영자 수',
            editor: 'numeric',
        },
    },
    BS2AuthConfigExt: {
        device_id: {
            title: '디바이스 ID',
            editable: false,
        },
        ext_auth_schedule: {
            title: '인증 스케줄',
            editor: 'numeric',
        },
        use_global_apb: {
            title: 'APB 사용',
            cell: booleanCellRenderer('use_global_apb'),
        },
        global_apbfail_action: {
            title: '글로벌 APB 실패 동작',
            width: '300px',
            cell: enumCellRenderer('global_apbfail_action', GlobalAPBFailAction),
        },
        use_group_matching: {
            title: '그룹 매칭 사용',
            cell: booleanCellRenderer('use_group_matching'),
        },
        use_private_auth: {
            title: '사용자 인증 사용',
            cell: booleanCellRenderer('use_private_auth'),
        },
        face_detection_level: {
            title: '얼굴 인식 레벨',
            width: '180px',
            cell: enumCellRenderer('face_detection_level', FaceDetectionLevel),
        },
        use_server_matching: {
            title: '사용자 서버 매칭 사용',
            width: '180px',
            cell: booleanCellRenderer('use_server_matching'),
        },
        use_full_access: {
            title: '전체 접근 사용',
            editor: 'numeric',
        },
        match_timeout: {
            title: '매칭 타임아웃',
            editor: 'numeric',
        },
        auth_timeout: {
            title: '인증 타임아웃',
            editor: 'numeric',
        },
        num_operators: {
            title: '운영자 수',
            editor: 'numeric',
        },
    },
    BS2CardConfig: {
        device_id: {
            title: '디바이스 ID',
            editable: false,
        },
        byte_order: {
            title: '바이트 순서',
            width: '180px',
            cell: enumCellRenderer('byte_order', ByteOrder),
        },
        use_wiegand_format: {
            title: 'Wiegand 포맷 사용',
            cell: booleanCellRenderer('use_wiegand_format'),
        },
        data_type: {
            title: '데이터 타입',
            width: '180px',
            cell: enumCellRenderer('data_type', CardDataType),
        },
        use_secondary_key: {
            title: '2차 키 사용',
            cell: booleanCellRenderer('use_secondary_key'),
        },
        format_id: {
            title: '포맷 ID',
            editor: 'numeric',
        },
        cipher: {
            title: '암호화 사용',
            cell: booleanCellRenderer('cipher'),
        },
        mifare_primary_key: {
            title: 'Mifare 1차 키',
        },
        mifare_secondary_key: {
            title: 'Mifare 2차 키',
        },
        mifare_start_block_index: {
            title: 'Mifare 시작 블록 인덱스',
            editor: 'numeric',
        },
        iclass_primary_key: {
            title: 'iclass 1차 키',
        },
        iclass_secondary_key: {
            title: 'iclass 2차 키',
        },
        iclass_start_block_index: {
            title: 'iclass 시작 블록 인덱스',
            editor: 'numeric',
        },
        desfire_primary_key: {
            title: 'Desfire 1차 키',
        },
        desfire_secondary_key: {
            title: 'Desfire 2차 키',
        },
        desfire_app_id: {
            title: 'Desfire 애플리케이션 ID',
        },
        desfire_file_id: {
            title: 'Desfire 파일 ID',
            editor: 'numeric',
        },
        desfire_encryption_type: {
            title: 'Desfire 암호화 타입',
            width: '180px',
            cell: enumCellRenderer('desfire_encryption_type', DesfireEncryptionType),
        },
        desfire_operation_mode: {
            title: 'Desfire 운영 모드',
            editor: 'numeric',
        },
    },
    BS2FaceConfig: {
        device_id: {
            title: '디바이스 ID',
            editable: false,
        },
        security_level: {
            title: '보안 레벨',
            width: '180px',
            cell: enumCellRenderer('security_level', SecurityLevel),
        },
        light_condition: {
            title: '햇빛 조건',
            width: '180px',
            cell: enumCellRenderer('light_condition', LightCondition),
        },
        enroll_threshold: {
            title: '등록 임계치',
            width: '180px',
            cell: enumCellRenderer('enroll_threshold', EnrollThreshold),
        },
        detect_sensitivity: {
            title: '감지 민감도',
            width: '180px',
            cell: enumCellRenderer('detect_sensitivity', DetectSensitivity),
        },
        enroll_timeout: {
            title: '등록 타임아웃',
            width: '180px',
            cell: enumCellRenderer('enroll_timeout', EnrollTimeout),
        },
        lfd_level: {
            title: 'LFD 레벨',
            width: '180px',
            cell: enumCellRenderer('lfd_level', lfdLevel),
        },
        quick_enrollment: {
            title: '빠른 등록',
            cell: booleanCellRenderer('quick_enrollment'),
        },
        preview_option: {
            title: '미리보기 옵션',
            width: '180px',
            cell: enumCellRenderer('preview_option', PreviewOption),
        },
        check_duplicate: {
            title: '중복 확인',
            cell: booleanCellRenderer('check_duplicate'),
        },
        operation_mode: {
            title: '운영 모드',
            width: '180px',
            cell: enumCellRenderer('operation_mode', OperationMode),
        },
        max_rotation: {
            title: '최대 회전',
            width: '180px',
            cell: enumCellRenderer('max_rotation', MaxRotation),
        },
        face_width_min: {
            title: '얼굴 너비 최소',
            cell: complexObjectCellRenderer('face_width_min', FaceWidth, 'min'),
        },
        face_width_max: {
            title: '얼굴 너비 최대',
            cell: complexObjectCellRenderer('face_width_max', FaceWidth, 'max'),
        },
        search_range_x: {
            title: '검색 범위 X',
            cell: complexObjectCellRenderer('search_range_x', SearchRange, 'x'),
        },
        search_range_y: {
            title: '검색 범위 Y',
            cell: complexObjectCellRenderer('search_range_y', SearchRange, 'width'),
        },
        detect_distance_min: {
            title: '감지 거리 최소',
            cell: complexObjectCellRenderer('detect_distance_min', DetectDistance, 'min_default'),
        },
        detect_distance_max: {
            title: '감지 거리 최대',
            cell: complexObjectCellRenderer('detect_distance_max', DetectDistance, 'max_default'),
        },
        wide_search: {
            title: '넓은 검색',
            cell: booleanCellRenderer('wide_search'),
        },
    },
    BS2FaceConfigExt: {
        device_id: {
            title: '디바이스 ID',
            editable: false,
        },
        thermal_check_mode: {
            title: '열 검사 모드',
            width: '180px',
            cell: enumCellRenderer('thermal_check_mode', ThermalCheckMode),
        },
        mask_check_mode: {    
            title: '마스크 검사 모드',
            width: '180px',
            cell: enumCellRenderer('mask_check_mode', MaskCheckMode),
        },
        thermal_format: {
            title: '열 형식',
            width: '180px',
            cell: enumCellRenderer('thermal_format', ThermalFormat),
        },
        thermal_threshold_low: {
            title: '열 임계치 최소',
            editor: 'numeric',
        },
        thermal_threshold_high: {
            title: '열 임계치 최대',
            editor: 'numeric',
        },
        mask_detection_level: {
            title: '마스크 검사 레벨',
            width: '180px',
            cell: enumCellRenderer('mask_detection_level', MaskDetectionLevel),
        },
        audit_temperature: {
            title: '온도 검사 사용',
            cell: booleanCellRenderer('audit_temperature'),
        },  
        use_reject_sound: {
            title: '거절 소리 사용',
            cell: booleanCellRenderer('use_reject_sound'),
        },
        use_overlap_thermal: {
            title: '중첩 열 검사 사용',
            cell: booleanCellRenderer('use_overlap_thermal'),
        },
        use_dynamic_roi: {
            title: '동적 ROI 사용',
            cell: booleanCellRenderer('use_dynamic_roi'),
        },
        face_check_order: {
            title: '얼굴 검사 순서',
            width: '180px',
            cell: enumCellRenderer('face_check_order', FaceCheckOrder),
        },
    },
    BS2FactoryConfig: {
        device_id: {
            title: '디바이스 ID',
            editable: false,
        },
        mac_addr: {
            title: 'MAC 주소',
        },
        model_name: {
            title: '모델 이름', 
        },
        board_ver_major: {
            title: '보드 버전 주',
            editor: 'numeric',
        },
        board_ver_minor: {
            title: '보드 버전 부',
            editor: 'numeric',
        },
        board_ver_ext: {
            title: '보드 버전 확장',
            editor: 'numeric',
        },
        kernel_ver_major: {
            title: '커널 버전 주',
            editor: 'numeric',
        },
        kernel_ver_minor: {
            title: '커널 버전 부',
            editor: 'numeric',
        },
        kernel_ver_ext: {
            title: '커널 버전 확장',
            editor: 'numeric',
        },
        bscore_ver_major: {
            title: 'bscore 버전 주',
            editor: 'numeric',
        },
        bscore_ver_minor: {
            title: 'bscore 버전 부',
            editor: 'numeric',
        },
        bscore_ver_ext: {
            title: 'bscore 버전 확장',
            editor: 'numeric',
        },
        firmware_ver_major: {
            title: '펌웨어 버전 주',
            editor: 'numeric',
        },
        firmware_ver_minor: {
            title: '펌웨어 버전 부',
            editor: 'numeric',
        },
        firmware_ver_ext: {
            title: '펌웨어 버전 확장',
            editor: 'numeric',
        },
        kernel_rev: {
            title: '커널 리버전',
        },
        bscore_rev: {
            title: 'bscore 리버전',
        },
        firmware_rev: {
            title: '펌웨어 리버전',
        },
    },
    BS2FingerprintConfig: {
        device_id: {
            title: '디바이스 ID',
            editable: false,
        },
        security_level: {
            title: '보안 레벨',
            width: '180px',
            cell: enumCellRenderer('security_level', SecurityLevel),
        },
        fast_mode: { 
            title: '빠른 모드',
            width: '180px',
            cell: enumCellRenderer('fast_mode', FastMode),
        },
        sensitivity: {
            title: '민감도',
            width: '180px',
            cell: enumCellRenderer('sensitivity', Sensitivity),
        },
        sensor_mode: {
            title: '센서 모드',
            editor: 'numeric',
        },
        template_format: {
            title: '템플릿 포맷',
            width: '180px',
            cell: enumCellRenderer('template_format', TemplateFormat),
        },
        scan_timeout: {
            title: '스캔 대기시간',
            editor: 'numeric',
        },
        successive_scan: {
            title: '연속 스캔',
            editor: 'numeric',
        },
        advanced_enrollment: {
            title: '고급 등록',
            cell: booleanCellRenderer('advanced_enrollment'),
        },
        show_image: {
            title: '이미지 표시',
            cell: booleanCellRenderer('show_image'),
        },
        lfd_level: {
            title: 'LFD 레벨',
            width: '180px',
            cell: enumCellRenderer('lfd_level', lfdLevel),
        },
        check_duplicate: {
            title: '중복 확인',
            cell: booleanCellRenderer('check_duplicate'),
        },
    },
    BS2IpConfig: {
        device_id: {
            title: '디바이스 ID',
            editable: false,
        },
        connection_mode: {
            title: '연결 모드',
            editor: 'numeric',
        },
        use_dhcp: {
            title: 'DHCP 사용',
            cell: booleanCellRenderer('use_dhcp'),
        },
        use_dns: {
            title: 'DNS 사용',
            cell: booleanCellRenderer('use_dns'),
        },
        ip_address: {
            title: 'IP 주소',
        },
        gateway: {
            title: '게이트웨이',
        },
        server_addr: {
            title: '서버 주소',
        },
        port: {
            title: '포트',
            editor: 'numeric',
        },
        server_port: {
            title: '서버 포트',
            editor: 'numeric',
        },
        mtu_size: {
            title: 'MTU 크기',
            editor: 'numeric',
        },
        baseband: {
            title: '베이스밴드',
            editor: 'numeric',
        },
        ssl_server_port: {
            title: 'SSL 서버 포트',
            editor: 'numeric',
        },
    },
    BS2SystemConfig: {
        device_id: {
            title: '디바이스 ID',
            editable: false,
        },
        timezone: {
            title: '시간대',
            editor: 'numeric',
        },
        sync_time: {
            title: '시간 동기화',
            editor: 'numeric',
        },
        server_sync: {
            title: '서버 동기화',
            editor: 'numeric',
        },
        device_locked: {
            title: '장치 잠금',
            editor: 'numeric',
        },
        use_interphone: {
            title: '인터폰 사용',
            cell: booleanCellRenderer('use_interphone'),
        },
        use_usbconnection: {
            title: 'USB 연결 사용',
            cell: booleanCellRenderer('use_usbconnection'),
        },
        key_encrypted: {
            title: '키 암호화',
            cell: booleanCellRenderer('key_encrypted'),
        },
        use_job_code: {
            title: '작업 코드 사용',
            cell: booleanCellRenderer('use_job_code'),
        },
        use_alphanumeric_id: {
            title: '숫자 알파벳 ID 사용',
            cell: booleanCellRenderer('use_alphanumeric_id'),
        },
        camera_frequency: {
            title: '카메라 주파수',
            editor: 'numeric',
        },
        secure_tamper: {
            title: '보안 탐지',
            cell: booleanCellRenderer('secure_tamper'),
        },
        use_card_operation_mask: {
            title: '카드 연산 마스크 사용',
        },
    },
    BS2WiegandConfig: {
        device_id: {
            title: '디바이스 ID',
            editable: false,
        },
        mode: {
            title: '모드',
            cell: enumCellRenderer('mode', Mode),
        },
        use_wiegand_bypass: {
            title: 'Wiegand 바이패스 사용',
            cell: enumCellRenderer('use_wiegand_bypass', WiegandBypassCode),
        },
        use_fail_code: {
            title: '실패 코드 사용',
            cell: booleanCellRenderer('use_fail_code'),
        },
        fail_code: {
            title: '실패 코드',
            editor: 'numeric',
        },
        out_pulse_width: {
            title: '출력 펄스 너비',
            editor: 'numeric',
        },
        out_pulse_interval: {
            title: '출력 펄스 간격',
            editor: 'numeric',
        },
        format_id: {
            title: '포맷 ID',
            editor: 'numeric',
        },
        format_length: {
            title: '포맷 길이',
            editor: 'numeric',
        },
        id_fields0: {
            title: 'ID 필드 0',
        },
        id_fields1: {
            title: 'ID 필드 1',
        },
        id_fields2: {
            title: 'ID 필드 2',
        },
        id_fields3: {
            title: 'ID 필드 3',
        },
        parity_fields0: {
            title: '패리티 필드 0',
        },
        parity_fields1: {
            title: '패리티 필드 1',
        },
        parity_fields2: {
            title: '패리티 필드 2',
        },
        parity_fields3: {
            title: '패리티 필드 3',
        },
        parity_pos0: {
            title: '패리티 위치 0',
            editor: 'numeric',
        },
        parity_pos1: {
            title: '패리티 위치 1',
            editor: 'numeric',
        },
        parity_pos2: {
            title: '패리티 위치 2',
            editor: 'numeric',
        },
        parity_pos3: {
            title: '패리티 위치 3',
            editor: 'numeric',
        },
        parity_type0: {
            title: '패리티 타입 0',
            editor: 'numeric',
        },
        parity_type1: {
            title: '패리티 타입 1',
            editor: 'numeric',
        },
        parity_type2: {
            title: '패리티 타입 2',
            editor: 'numeric',
        },
        parity_type3: {
            title: '패리티 타입 3',
            editor: 'numeric',
        },
        wiegand_input_mask: {
            title: 'Wiegand 입력 마스크',
            editor: 'numeric',
        },
        wiegand_card_mask: {
            title: 'Wiegand 카드 마스크',
            editor: 'numeric',
        },
        wiegand_csnindex: {
            title: 'Wiegand CSN 인덱스',
            editor: 'numeric',
        },
        use_wiegand_user_id: {
            title: 'Wiegand 사용자 ID 사용',
            cell: enumCellRenderer('use_wiegand_user_id', UseWiegandUserId),
        },
    },
    BioDevice: {
        device_id: {
            title: '디바이스 ID',
            editable: false,
        },
        facility_id: {
            title: '시설 ID',
            editor: 'numeric',
        },
        description: {
            title: '설명',
        },
        vendor: {
            title: '제조사',
            editor: 'numeric',
        },
        device_ip: {
            title: '디바이스 IP',
        },
        linked_reader_key: {
            title: '연결된 리더 키',
            cell: linkedReaderKeyRenderer('linked_reader_key'),
        },
        linked_acsystem: {
            title: '연결된 AC 시스템',
            editor: 'numeric',
        },
        op_id: {
            title: 'OP ID',
            editor: 'numeric',
        },
    }
};

// 드롭다운 리스트 전환 함수
export const convertToDropdownData = (enumObject) => {
    return Object.entries(enumObject)
        .filter(([key]) => typeof enumObject[key] === 'number')
        .map(([key, value]) => ({
            text: enumObject.toLabel ? enumObject.toLabel(value) : key,
            value: value
        }));
};