/**
 * Creates a response for the API.
 *
 * @param {boolean} success - The success status of the API response.
 * @param {object | null} payload - The payload of the API response.
 * @return {object} - The success response object.
 */
const apiResponse = (success: boolean, payload: object | null): object => {
    return {
        success,
        payload,
    };
};

export default apiResponse;
