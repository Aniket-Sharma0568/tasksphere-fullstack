import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://tasksphere1.onrender.com";

const api = axios.create({
    baseURL: `${API_BASE_URL}/api`,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
    withCredentials: false,
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            if (!window.location.pathname.includes("/login") &&
                !window.location.pathname.includes("/register")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

// Utility function to clean parameters
const cleanParams = (params) => {
    if (!params) return {};

    const cleaned = {};
    Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== "" && value !== null && value !== undefined) {
            cleaned[key] = value;
        }
    });
    return cleaned;
};

// Auth API
export const authAPI = {
    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        return response;
    },

    register: async (userData) => {
        if (!userData.name || !userData.email || !userData.password || !userData.dateOfBirth) {
            throw new Error("All fields are required: name, email, password, dateOfBirth");
        }

        const payload = {
            name: userData.name.trim(),
            email: userData.email.toLowerCase().trim(),
            password: userData.password,
            dateOfBirth: userData.dateOfBirth,
        };

        const response = await api.post("/auth/register", payload);
        return response;
    },

    getMe: async () => {
        const response = await api.get("/auth/me");
        return response;
    },

    setToken: (token) => {
        if (token) {
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
        } else {
            delete api.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    },

    removeToken: () => {
        delete api.defaults.headers.common["Authorization"];
        localStorage.removeItem("token");
    },
};

// Tasks API
export const tasksAPI = {
    getAll: async (params = {}) => {
        const cleanedParams = cleanParams(params);
        const response = await api.get("/tasks", { params: cleanedParams });
        return response;
    },

    getById: async (id) => {
        const response = await api.get(`/tasks/${id}`);
        return response;
    },

    create: async (taskData) => {
        const response = await api.post("/tasks", taskData);
        return response;
    },

    update: async (id, taskData) => {
        const response = await api.put(`/tasks/${id}`, taskData);
        return response;
    },

    delete: async (id) => {
        const response = await api.delete(`/tasks/${id}`);
        return response;
    },
};

// Password API
export const passwordAPI = {
    forgot: async (data) => {
        const response = await api.post("/password/forgot", data);
        return response;
    },

    reset: async (data) => {
        const response = await api.put("/password/reset", data);
        return response;
    },

    verifyDOB: async (data) => {
        const response = await api.post("/password/verify-dob", data);
        return response;
    },
};

// Users API
export const usersAPI = {
    getProfile: async () => {
        const response = await api.get("/users/profile");
        return response;
    },

    updateProfile: async (userData) => {
        const response = await api.put("/users/profile", userData);
        return response;
    },
};

// Test backend connectivity
export const testConnection = async () => {
    try {
        const reachable = await testBackendReachable();
        if (!reachable.success) {
            return reachable;
        }

        try {
            const response = await api.get("/health");
            return {
                success: true,
                data: response.data,
                status: response.status,
            };
        } catch (error) {
            if (error.response?.status === 404) {
                try {
                    await authAPI.getMe();
                    return {
                        success: true,
                        message: "Backend reachable via auth endpoint",
                    };
                } catch (authError) {
                    return {
                        success: true,
                        message: "Backend reachable but no standard endpoints found",
                    };
                }
            }
            throw error;
        }
    } catch (error) {
        return {
            success: false,
            error: error.message,
            status: error.response?.status,
        };
    }
};

// Test if backend domain is reachable
export const testBackendReachable = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(API_BASE_URL, {
            method: 'HEAD',
            cache: 'no-cache',
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return {
            success: true,
            status: response.status,
            reachable: true,
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            reachable: false,
        };
    }
};

// Test CORS configuration
export const testCORS = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/test`, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            return { success: true, status: response.status, data };
        } else {
            return { success: false, status: response.status };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Test authentication
export const testAuth = async () => {
    try {
        const response = await authAPI.getMe();
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            details: error.response?.data,
        };
    }
};

// Test tasks API
export const testTasksAPI = async () => {
    try {
        const response = await tasksAPI.getAll({ limit: 1 });
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            details: error.response?.data,
        };
    }
};

// Test registration directly
export const testRegistration = async (userData) => {
    try {
        const response = await api.post("/auth/register", userData);
        return { success: true, data: response.data };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            response: error.response?.data,
            status: error.response?.status,
        };
    }
};

// Initialize token from localStorage on app start
export const initializeAuth = () => {
    const token = localStorage.getItem("token");
    if (token) {
        authAPI.setToken(token);
    }
    return token;
};

export default api;
