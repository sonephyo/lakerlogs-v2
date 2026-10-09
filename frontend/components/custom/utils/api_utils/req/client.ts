import axios from "axios";
import { getDefaultStore } from "jotai";
import { tokenAtom } from "../../context/state";
import { env } from "next-runtime-env";
import { isDemoSession } from "@/lib/demo/store";
import { createDemoAdapter } from "@/lib/demo/adapter";

const store = getDefaultStore();

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

function processQueue(error: any, token: string | null) {
  refreshQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  refreshQueue = [];
}

export function createClient(baseURL: string, service: "auth" | "worklog" = "auth") {
  const client = axios.create({ baseURL, withCredentials: true });
  const demoRequests = new WeakSet<object>();

  client.interceptors.request.use((config) => {
    if (isDemoSession()) {
      demoRequests.add(config);
      config.adapter = createDemoAdapter(service);
      config.headers.delete("Authorization");
      config.withCredentials = false;
      return config;
    }
    var token = localStorage.getItem("csc_480_token");

    if (token) {
      token = token.replace(/^"(.*)"$/, "$1");
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (isDemoSession() || (error.config && demoRequests.has(error.config))) return Promise.reject(error);
      const originalRequest = error.config;

      if (
        (error.response?.status === 401 || error.response?.status === 403) &&
        !originalRequest._retry
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            refreshQueue.push({ resolve, reject });
          }).then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return client(originalRequest);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const AUTH_URL =
            env("NEXT_PUBLIC_AUTH_API_URL") || "http://localhost:9084/auth/api";
          const res = await axios.post(
            `${AUTH_URL}/auth/refresh`,
            {},
            { withCredentials: true },
          );
          const newToken = res.data.token;

          localStorage.setItem("csc_480_token", JSON.stringify(newToken));
          store.set(tokenAtom, newToken);
          document.cookie = `token=${newToken}; path=/;`;

          processQueue(null, newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          localStorage.removeItem("csc_480_token");
          store.set(tokenAtom, null);
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/signup";

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
}
