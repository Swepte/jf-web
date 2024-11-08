import axios from "axios";

export const i = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL });
i.interceptors.request.use(async (request) => {
  return request;
});

export async function get(url: string) {
  const res = await i.get(url);

  return res;
}

export async function patch(url: string, data?: unknown) {
  const res = await i.patch(url, data);

  return res;
}

export async function put(url: string, data?: unknown) {
  const res = await i.put(url, data);

  return res;
}

export async function del(url: string, data?: unknown) {
  const res = await i.delete(url, { data });
  return res;
}

export async function post<T>(url: string, data: unknown) {
  const res = await i.post<T>(url, data);
  return res;
}

export async function postForm<T>(url: string, data: unknown) {
  const res = await i.post<T>(url, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
  });
  return res;
}
