export const BACKEND_URL = `${process.env.REACT_APP_BACK_END_API_URL}/api/acsmng/v1`;


export const handleApiResponse = (apiUrl, responseData) => {
    if (responseData.code !== "0000") {
        console.error(
            `API 오류: ${apiUrl} : ${responseData.code} : ${responseData.message}`
        );
    }

    return responseData.data;
};