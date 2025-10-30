/**
 * deviceSettingsOptions.js
 * 
 * 장치 설정 탭에서 사용하는 모든 드롭다운 옵션과 선택 옵션을 정의합니다.
 * 각 드롭다운에 필요한 옵션 배열을 내보냅니다.
 */

// 마스크 옵션
export const maskOptions = [
  { text: '필수', value: 'required' },
  { text: '선택', value: 'optional' },
  { text: '사용 안함', value: 'disabled' }
];

// 날짜 포맷 옵션
export const dateFormatOptions = [
  { text: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
  { text: 'MM-DD-YYYY', value: 'MM-DD-YYYY' },
  { text: 'DD-MM-YYYY', value: 'DD-MM-YYYY' }
];

// 장치 유형 옵션
export const deviceTypeOptions = [
  { text: '얼굴인식기', value: 'FACE' },
  { text: '지문인식기', value: 'FINGER' },
  { text: '복합인식기', value: 'MULTI' }
];

// 리더 유형 옵션
export const readerTypeOptions = [
  { text: '출입 리더', value: 'access' },
  { text: '등록 리더', value: 'enrollment' },
  { text: '복합 리더', value: 'both' }
];

// 암호화 레벨 옵션
export const encryptionLevelOptions = [
  { text: '낮음', value: 'low' },
  { text: '중간', value: 'medium' },
  { text: '높음', value: 'high' }
];

// 얼굴 감지 레벨 옵션
export const faceDetectionLevelOptions = [
  { text: '얼굴 검출하지 않음', value: 0 },
  { text: 'Normal mode', value: 1 },
  { text: 'Strict mode', value: 2 }
];

export const deviceAuthModeOptionsBasic = [
  { text: '생체', value: 0 },
  { text: '생체 + PIN 번호', value: 1 },
  { text: '카드', value: 2 },
  { text: '카드 + 생체', value: 3 },
  { text: '카드 + PIN 번호', value: 4 },
  { text: '카드 + 생체 or PIN 번호', value: 5 },
  { text: '카드 + 생체 + PIN 번호', value: 6 },
  { text: 'ID + 생체', value: 7 },
  { text: 'ID + PIN 번호', value: 8 },
  { text: 'ID + 생체 or PIN 번호', value: 9 },
  { text: 'ID + 생체 + PIN 번호', value: 10 },
];

export const deviceAuthModeOptionsExt = [
  { text: '얼굴', value: 11 },
  { text: '얼굴 + 지문', value: 12 },
  { text: '얼굴 + PIN 번호', value: 13 },
  { text: '얼굴 + 지문 or PIN 번호', value: 14 },
  { text: '얼굴 + 지문 + PIN 번호', value: 15 },
  { text: '지문', value: 16 },
  { text: '지문 + 얼굴', value: 17 },
  { text: '지문 + PIN 번호', value: 18 },
  { text: '지문 + 얼굴 or PIN 번호', value: 19 },
  { text: '지문 + 얼굴 + PIN 번호', value: 20 },
  { text: '카드', value: 21 },
  { text: '카드 + 얼굴', value: 22 },
  { text: '카드 + 지문', value: 23 },
  { text: '카드 + PIN 번호', value: 24 },
  { text: '카드 + 얼굴 or 지문', value: 25 },
  { text: '카드 + 얼굴 or PIN 번호', value: 26 },
  { text: '카드 + 지문 or PIN 번호', value: 27 },
  { text: '카드 + 얼굴 or 지문 or PIN 번호', value: 28 },
  { text: '카드 + 얼굴 + 지문', value: 29 },
  { text: '카드 + 얼굴 + PIN 번호', value: 30 },
  { text: '카드 + 지문 + 얼굴', value: 31 },
  { text: '카드 + 지문 + PIN 번호', value: 32 },
  { text: '카드 + 얼굴 or 지문 + PIN 번호', value: 33 },
  { text: '카드 + 얼굴 + 지문 or PIN 번호', value: 34 },
  { text: '카드 + 지문 + 얼굴 or PIN 번호', value: 35 },
  { text: 'ID + 얼굴', value: 36 },
  { text: 'ID + 지문', value: 37 },
  { text: 'ID + PIN 번호', value: 38 },
  { text: 'ID + 얼굴 or 지문', value: 39 },
  { text: 'ID + 얼굴 or PIN 번호', value: 40 },
  { text: 'ID + 지문 or PIN 번호', value: 41 },
  { text: 'ID + 얼굴 or 지문 or PIN 번호', value: 42 },
  { text: 'ID + 얼굴 + 지문', value: 43 },
  { text: 'ID + 얼굴 + PIN 번호', value: 44 },
  { text: 'ID + 지문 + 얼굴', value: 45 },
  { text: 'ID + 지문 + PIN 번호', value: 46 },
  { text: 'ID + 얼굴 or 지문 + PIN 번호', value: 47 },
  { text: 'ID + 얼굴 + 지문 or PIN 번호', value: 48 },
  { text: 'ID + 지문 + 얼굴 or PIN 번호', value: 49 },
];

// 보안 레벨 옵션
export const securityLevelOptions = [
  { text: '기본', value: 0 },
  { text: '보안 레벨 높음', value: 1 },
  { text: '보안 레벨 매우 높음', value: 2 },
];

// 지문 인증 속도 옵션
export const fingerprintAuthSpeedOptions = [
  { text: '자동', value: 0 },
  { text: '기본 인증 속도', value: 1 },
  { text: '인증 속도 빠름', value: 2 },
  { text: '인증 속도 매우 빠름', value: 3 }
];

// 지문 센서 모드 옵션
export const fingerprintSensorModeOptions = [
  { text: '항상 켜짐', value: 0 },
  { text: '근접 시 켜짐', value: 1 },
];

// 지문 센서 감도 옵션
export const fingerprintSensitivityOptions = [
  { text: '1 (가장 낮음)', value: 1 },
  { text: '2', value: 2 },
  { text: '3', value: 3 },
  { text: '4', value: 4 },
  { text: '5', value: 5 },
  { text: '6', value: 6 },
  { text: '7', value: 7 },
  { text: '8', value: 8 },
  { text: '9', value: 9 },
  { text: '10 (가장 높음)', value: 10 }
];

// 지문 템플릿 옵션
export const fingerprintTemplateOptions = [
  { text: '표준', value: 'standard' },
  { text: 'ISO', value: 'iso' },
  { text: 'ANSI', value: 'ansi' }
];

// 지문 라이브 감지 옵션
export const fingerprintLiveDetectionOptions = [
  { text: '사용', value: true },
  { text: '사용 안함', value: false }
];

// 지문 스캔 타임아웃 옵션
export const fingerprintScanTimeoutOptions = [
  { text: '3초', value: 3 },
  { text: '5초', value: 5 },
  { text: '10초', value: 10 },
  { text: '15초', value: 15 },
  { text: '무제한', value: 0 }
];

// 얼굴 작동 모드 옵션
export const faceOperationModeOptions = [
  { text: '일반', value: 'normal' },
  { text: '성능 중심', value: 'performance' },
  { text: '정확도 중심', value: 'accuracy' }
];

// 얼굴 등록 품질 옵션
export const faceRegistrationQualityOptions = [
  { text: '낮음', value: 'low' },
  { text: '중간', value: 'medium' },
  { text: '높음', value: 'high' }
];

// 얼굴 센서 감도 옵션
export const faceSensorSensitivityOptions = [
  { text: '낮음', value: 'low' },
  { text: '중간', value: 'medium' },
  { text: '높음', value: 'high' }
];

// 얼굴 조명 조건 옵션
export const faceLightingConditionOptions = [
  { text: '자동', value: 'auto' },
  { text: '실내', value: 'indoor' },
  { text: '실외', value: 'outdoor' }
];

// 얼굴 라이브 감지 옵션
export const faceLiveDetectionOptions = [
  { text: '낮음', value: 'low' },
  { text: '중간', value: 'medium' },
  { text: '높음', value: 'high' },
  { text: '매우 높음', value: 'veryHigh' }
];

// 얼굴 감지 방향 옵션
export const faceDetectionDirectionOptions = [
  { text: '정면', value: 'front' },
  { text: '전방위', value: 'all' }
];

// 얼굴 스캔 타임아웃 옵션
export const faceScanTimeoutOptions = [
  { text: '3초', value: 3 },
  { text: '5초', value: 5 },
  { text: '10초', value: 10 },
  { text: '15초', value: 15 },
  { text: '무제한', value: 0 }
];

// 카드 데이터 저장 옵션
export const cardDataStorageOptions = [
  { text: 'ID 매칭', value: 'idMatching' },
  { text: '카드 데이터', value: 'cardData' }
];

// 카드 데이터 유형 옵션
export const cardDataTypeOptions = [
  { text: 'CSN', value: 'csn' },
  { text: 'Wiegand', value: 'wiegand' },
  { text: 'HID', value: 'hid' }
];

// 키패드 활성화 옵션
export const keypadActivationOptions = [
  { text: '사용', value: 'enabled' },
  { text: '사용 안함', value: 'disabled' }
];

// Wiegand 옵션
export const wiegandDataStorageOptions = [
  { text: 'ID 매칭', value: 'idMatching' },
  { text: '카드 데이터', value: 'cardData' },
  { text: '사용자 ID', value: 'userId' }
];

// IP 연결 모드 옵션
export const ipConnectionModeOptions = [
  { text: 'direct mode', value: 0 },
  { text: 'server mode', value: 1 }
];

export const wiegandOutputOptions = [
  { text: '기본', value: 'default' },
  { text: '커스텀', value: 'custom' },
  { text: '표준', value: 'standard' }
];

export const wiegandCardDataTypeOptions = [
  { text: 'CSN', value: 'csn' },
  { text: 'Wiegand', value: 'wiegand' },
  { text: 'HID', value: 'hid' }
];

export const wiegandOutProcessingOptions = [
  { text: '모든 인증', value: 'allAuth' },
  { text: '성공한 인증만', value: 'successOnly' },
  { text: '실패한 인증만', value: 'failOnly' }
];

export const failCodeTypeOptions = [
  { text: '기본값', value: 'default' },
  { text: '커스텀', value: 'custom' }
]; 