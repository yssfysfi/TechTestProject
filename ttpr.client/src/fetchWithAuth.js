export async function fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem("accessToken");

    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        console.warn("Unauthorized, token may have expired");
    }

    return response;
}