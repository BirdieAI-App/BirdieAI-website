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