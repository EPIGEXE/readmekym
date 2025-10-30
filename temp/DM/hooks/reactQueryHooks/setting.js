export const BACKEND_URL = `${process.env.REACT_APP_BACK_END_API_URL}/api/acsmng/v1`;
export const BACKEND_BASE_API_URL = `${process.env.REACT_APP_BACK_END_API_URL}/api/base/v1`;

export const handleApiResponse = (response) => {

    if (response.code !== "0000") {
        console.error(`API 오류 : ${response.code}`);
    }

    return response.data;
}