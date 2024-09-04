const apiResponse = (success: boolean, payload: object | null): object => {
    return {
        success,
        payload,
    };
};

export default apiResponse;
