import { z } from "zod";
import { toast } from "react-toastify";

export const THREADS_PER_PAGE = 5;

export const getAllThreadsByUserPaginated = async function (page, data) {
    // console.log(data);
    const start = page * THREADS_PER_PAGE;
    const end = start + THREADS_PER_PAGE;

    if (start > data.length) {
        throw new Error(`Invalid page ${page}`)
    }

    const nextPage = end < data.length ? page + 1 : null;
    // console.log(data.slice(start, end));

    return {
        nextPage,
        data: data.slice(start, end),
    }
}

const zObject = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must contain at least 8 characters'),
});

const toastConfig = {
    position: "top-center",
    autoClose: 6000, // Close after 6 seconds
};

export const validateData = (payload) => {
    try {
        zObject.parse(payload);
        return true;
    } catch (error) {
        error.errors.forEach(err => {
            toast.error(err.message, toastConfig);
        });
        return false;
    }
}

export const extractFirstFourWords = function (str) {
    // Split the string by whitespace
    const words = str.split(/\s+/);
  
    // Slice the first four words and join them back into a string
    const firstFourWords = words.slice(0, 4).join(' ');
  
    return firstFourWords;
}