import { Button } from "@progress/kendo-react-buttons";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import { Upload } from "@progress/kendo-react-upload";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { playIcon, stopIcon, trashIcon } from "@progress/kendo-svg-icons";
import { useState, useRef } from "react";
import { useAlertAudioList, useDeleteAlertAudio } from "../../../hooks/reactQueryHooks/useAlertAudioApi";
import { useQueryClient } from "@tanstack/react-query";

const saveUrl = `${process.env.REACT_APP_BACK_END_API_URL}/api/base/v1/resource/upload`;

/**
 * 알람음 설정 컴포넌트
 *
 * 알람음 설정 컴포넌트
 * 1. 알람음 파일 업로드
 * 2. 알람음 파일 목록 표시
 * 3. 알람음 파일 재생
 * 4. 알람음 파일 삭제
 */
const AlarmSoundSettings = ({ messages }) => {
    // 업로드 후 리스트 갱신용
    const queryClient = useQueryClient();

    // ============================= 상태 관리 =============================
    const [isPlaying, setIsPlaying] = useState(null); // 재생 중인 파일 상태
    const [uploadFiles, setUploadFiles] = useState([]); // 업로드 중인 파일 목록
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // 삭제 확인 다이얼로그
    const [fileToDelete, setFileToDelete] = useState(null); // 삭제할 파일명

    // ============================= useRef =============================
    const audioRef = useRef(null); // 오디오 요소 참조 - 오디오 재생을 위한 참조

    // ============================= 쿼리 훅 =============================
    const { data: audioFiles = [], isLoading } = useAlertAudioList(); // 알람음 파일 목록
    const { mutate: deleteAlertAudio, isPending: isDeleting } = useDeleteAlertAudio(); // 알람음 파일 삭제

    // ============================= 개별 변수 =============================
    // 문자열 배열을 객체 배열로 변환
    const gridData = audioFiles.map((fileName, index) => ({
        id: index,
        name: fileName,
    }));

    // ============================= 핸들러 =============================
    // 오디오 재생 정지
    const handlePlayTest = (audioFile) => {
        if (isPlaying === audioFile) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            setIsPlaying(null);
        } else {
            if (audioRef.current) {
                // 파일명을 URL에 맞게 인코딩하고, PUBLIC_URL을 사용하여 정확한 경로를 지정합니다.
                const encodedFileName = encodeURIComponent(audioFile);
                audioRef.current.src = `${process.env.PUBLIC_URL}/front_resource/DM-Audio/${encodedFileName}`;

                audioRef.current
                    .play()
                    .then(() => {
                        setIsPlaying(audioFile);
                    })
                    .catch((error) => {
                        console.error("오디오 재생 실패:", error);
                        alert(
                            "오디오 재생에 실패했습니다. 파일이 public/front_resource/DM-Audio 폴더에 있는지 확인해주세요."
                        );
                    });
            }
        }
    };

    // 오디오 재생 완료 시
    const handleAudioEnded = () => {
        setIsPlaying(null);
    };

    // 업로드 상태 변경 핸들러
    const handleStatusChange = (event) => {
        // 업로드 완료된 경우
        if (event.response?.response?.code === "0000") {
            setUploadFiles([]); // 파일 목록 초기화
            queryClient.invalidateQueries(["alertAudioList"]); // 목록 갱신
        }
        // 실패한 경우
        else if (event.affectedFiles[0]?.status === 4 && event.response?.response?.code !== "0000") {
            setUploadFiles([]); // 실패한 파일도 목록에서 제거
            alert("파일 업로드에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 파일 제거 핸들러
    const handleRemove = (event) => {
        setUploadFiles(event.newState);
    };

    // 오디오 파일 삭제 핸들러
    const handleDeleteAudio = (fileName) => {
        setFileToDelete(fileName);
        setDeleteDialogOpen(true);
    };

    // 삭제 확인 핸들러
    const handleConfirmDelete = () => {
        if (fileToDelete) {
            // 재생 중인 파일이면 재생 정지
            if (isPlaying === fileToDelete) {
                if (audioRef.current) {
                    audioRef.current.pause();
                    audioRef.current.currentTime = 0;
                }
                setIsPlaying(null);
            }
            
            // 삭제 API 호출 (배열 형태로 전달)
            deleteAlertAudio([fileToDelete]);
        }
        
        // 다이얼로그 닫기
        setDeleteDialogOpen(false);
        setFileToDelete(null);
    };

    // 삭제 취소 핸들러
    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setFileToDelete(null);
    };

    // ============================= 렌더러 =============================
    // 액션 셀 렌더러
    const ActionCell = ({ dataItem }) => (
        <td className="k-command-cell">
            <div className="flex gap-1">
                <Button
                    size="small"
                    look="outline"
                    svgIcon={isPlaying === dataItem ? stopIcon : playIcon}
                    onClick={() => handlePlayTest(dataItem)}
                    title={isPlaying === dataItem ? "재생 정지" : "재생"}
                />
                <Button
                    size="small"
                    look="outline"
                    themeColor="error"
                    svgIcon={trashIcon}
                    onClick={() => handleDeleteAudio(dataItem)}
                    title="삭제"
                    disabled={isDeleting}
                />
            </div>
        </td>
    );

    return (
        <div className="flex flex-col h-full bg-[var(--kendo-color-app-surface)]">
            {/* 업로드 영역 */}
            <div className="p-4 border-b border-[var(--kendo-color-border)]">
                <div className="mb-3 flex items-center gap-2">
                    <span className="font-medium">{messages.settingsPanel.alarmSound.newAudioUpload}</span>
                </div>

                <Upload
                    batch={false}
                    multiple={true}
                    withCredentials={false}
                    saveUrl={saveUrl}
                    saveHeaders={{
                        "Cx-Upload-Path": "DM-Audio",
                        Authorization: `Bearer ${localStorage.getItem("AXISTATIONX_ACCESS_TOKEN")}`,
                    }}
                    autoUpload={true}
                    files={uploadFiles}
                    onAdd={(event) => setUploadFiles(event.newState)}
                    onRemove={handleRemove}
                    onStatusChange={handleStatusChange}
                    restrictions={{
                        allowedExtensions: [".mp3", ".wav", ".ogg"],
                        maxFileSize: 5242880,
                    }}
                />
            </div>

            {/* 파일 목록 */}
            <div className="flex-1 overflow-hidden p-4">
                <div className="mb-3 flex items-center gap-2">
                    <span className="font-medium">
                        {messages.settingsPanel.alarmSound.registeredAudio} ({audioFiles?.length || 0}{" "}
                        {messages.settingsPanel.alarmSound.selectedCount})
                    </span>
                </div>

                {audioFiles && audioFiles.length > 0 ? (
                    <Grid
                        data={gridData}
                        scrollable="scrollable"
                        style={{
                            border: "1px solid var(--kendo-color-border)",
                            height: "calc(100% - 4rem)",
                        }}
                    >
                        <GridColumn
                            title="파일명"
                            width="300px"
                            cells={{
                                data: ({ dataItem }) => (
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{dataItem.name}</span>
                                            {isPlaying === dataItem.name && (
                                                <span className="text-xs bg-[var(--kendo-color-primary)] text-white px-2 py-0.5 rounded">
                                                    재생 중
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                ),
                            }}
                        />
                        <GridColumn
                            title="작업"
                            cells={{
                                data: ({ dataItem }) => <ActionCell dataItem={dataItem.name} />,
                            }}
                        />
                    </Grid>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {isLoading
                            ? messages.settingsPanel.alarmSound.loading
                            : messages.settingsPanel.alarmSound.noAudio}
                    </div>
                )}
            </div>

            <audio ref={audioRef} onEnded={handleAudioEnded} style={{ display: "none" }} />
            
            {/* 삭제 확인 다이얼로그 */}
            {deleteDialogOpen && (
                <Dialog 
                    title="파일 삭제"
                    onClose={handleCancelDelete}
                    width={400}
                >
                    <div style={{ padding: "20px", minHeight: "60px" }}>
                        다음 파일을 삭제하시겠습니까? <br />
                        <strong>({fileToDelete})</strong>
                    </div>
                    <DialogActionsBar>
                        <Button 
                            themeColor="error" 
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "삭제 중..." : "삭제"}
                        </Button>
                        <Button onClick={handleCancelDelete} disabled={isDeleting}>
                            취소
                        </Button>
                    </DialogActionsBar>
                </Dialog>
            )}
        </div>
    );
};

export default AlarmSoundSettings;
