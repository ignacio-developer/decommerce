// import { getCsrfToken } from "../utils";

const baseUrl = process.env.APP_URL;

export const getCities = async (city) => {
    try {
        const response = await fetch(`${baseUrl}econt/get_cities?q=${city}`);
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
export const getOffices = async (city_id, search) => {
    try {
        const response = await fetch(
            `${baseUrl}econt/get_offices?q=${search}&econt_city[id]=${city_id}`
        );
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};
export const getStreets = async (city_id,search) => {
    try {
        const response = await fetch(
            `${baseUrl}econt/get_streets?q=${search}&econt_city[id]=${city_id}`
        );
        const result = await response.json();
        return result;
    } catch (error) {
        throw error;
    }
};

export default {
    getCities,
    getOffices,
    getStreets,
};
