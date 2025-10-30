class WiegandFormat {
    constructor(size, wiegandFormatString) {
        this.size = size;
        this.data = new Array(size).fill(0);

        if (wiegandFormatString) {
            // 16진수 문자열을 2진수로 변환
            const longValue = BigInt(`0x${wiegandFormatString}`);
            const bitString = longValue.toString(2).padStart(size, "0");

            // 2진수 문자열을 비트맵으로 변환
            for (let i = 0; i < size; i++) {
                this.data[i] = parseInt(bitString[i], 2);
            }
        }
    }

    // Field 입력
    setField(start, end) {
        for (let i = 0; i < this.size; i++) {
            if (i >= start && i <= end) {
                this.data[i] = 1;
            }
        }
    }

    // Field 조회
    getFields() {
        const fields = [];
        let isStart = false;
        let start = 0;

        for (let i = 0; i < this.size; i++) {
            if (!isStart) {
                // start 찾기
                if (this.data[i] === 1) {
                    start = i;
                    isStart = true;
                }
            } else {
                // end 찾기
                if (this.data[i] === 0) {
                    fields.push({
                        start: start,
                        end: i - 1,
                    });
                    isStart = false;
                }
            }
        }

        // 마지막 필드 처리
        if (isStart) {
            fields.push({
                start: start,
                end: this.size - 1,
            });
        }

        return fields;
    }
}

export function convertRowToSchema(rowData) {
    // ID 필드 변환
    const idFields = [];
    let globalIdIndex = 1;

    for (let i = 0; i < 4; i++) {
        const fieldKey = `id_fields${i}`;
        if (
            rowData[fieldKey] &&
            rowData[fieldKey] !==
                "0000000000000000000000000000000000000000000000000000000000000000"
        ) {
            const wiegandFormat = new WiegandFormat(
                rowData.format_length,
                rowData[fieldKey]
            );
            const fields = wiegandFormat.getFields();

            // fields 배열을 순회하면서 ID 필드 추가
            for (const field of fields) {
                idFields.push({
                    id: globalIdIndex++,
                    startBit: field.start,
                    endBit: field.end,
                    length: field.end - field.start + 1,
                });
            }
        }
    }

    // 패리티 필드 변환
    const parityFields = [];
    for (let i = 0; i < 4; i++) {
        const fieldKey = `parity_fields${i}`;
        const typeKey = `parity_type${i}`;
        const posKey = `parity_pos${i}`;

        if (
            rowData[fieldKey] &&
            rowData[fieldKey] !==
                "0000000000000000000000000000000000000000000000000000000000000000"
        ) {
            const wiegandFormat = new WiegandFormat(
                rowData.format_length,
                rowData[fieldKey]
            );
            const fields = wiegandFormat.getFields();
            fields.forEach((field, index) => {
                parityFields.push({
                    id: i * 4 + index,
                    location: rowData[posKey],
                    type:
                        rowData[typeKey] === 1
                            ? "odd"
                            : rowData[typeKey] === 2
                            ? "even"
                            : null,
                    startBit: field.start,
                    endBit: field.end,
                    length: field.end - field.start + 1,
                });
            });
        }
    }

    return {
        id: rowData.id,
        description: rowData.description,
        format_id: rowData.format_id,
        totalBits: rowData.format_length,
        idFields,
        parityFields,
    };
}

export function convertSchemaToRow(schema) {
    const rowData = {
        id: schema.id,
        description: schema.description,
        format_id: schema.format_id,
        format_length: schema.totalBits,
    };

    // ID 필드 복원
    const idFieldGroups = [[], [], [], []];
    schema.idFields.forEach((field) => {
        const groupIndex = field.id - 1;
        idFieldGroups[groupIndex].push(field);
    });

    for (let i = 0; i < 4; i++) {
        const wiegandFormat = new WiegandFormat(schema.totalBits);
        idFieldGroups[i].forEach((field) => {
            wiegandFormat.setField(field.startBit, field.endBit);
        });

        const bitString = wiegandFormat.data.join("");
        const hexString = BigInt(`0b${bitString}`)
            .toString(16)
            .toUpperCase()
            .padStart(64, "0");
        rowData[`id_fields${i}`] = hexString;
    }

    // 패리티 필드 복원
    const parityFieldGroups = [[], [], [], []];
    const parityTypes = [null, null, null, null];
    const parityPos = [null, null, null, null];

    // location과 type 조합으로 그룹 매핑
    const locationTypeGroups = new Map();
    let nextGroupIndex = 0;

    schema.parityFields.forEach((field) => {
        const key = `${field.location}-${field.type}`; // 👈 location과 type 조합

        if (!locationTypeGroups.has(key)) {
            locationTypeGroups.set(key, nextGroupIndex++);
        }

        const groupIndex = locationTypeGroups.get(key);
        parityFieldGroups[groupIndex].push(field);
        parityTypes[groupIndex] =
            field.type === "odd" ? 1 : field.type === "even" ? 2 : 0;
        parityPos[groupIndex] = field.location;
    });

    for (let i = 0; i < 4; i++) {
        const wiegandFormat = new WiegandFormat(schema.totalBits);
        parityFieldGroups[i].forEach((field) => {
            wiegandFormat.setField(field.startBit, field.endBit);
        });

        const bitString = wiegandFormat.data.join("");
        const hexString = BigInt(`0b${bitString}`)
            .toString(16)
            .toUpperCase()
            .padStart(64, "0");
        rowData[`parity_fields${i}`] = hexString;
        rowData[`parity_type${i}`] = parityTypes[i] ?? 0;
        rowData[`parity_pos${i}`] = parityPos[i] ?? 0;
    }

    return rowData;
}
