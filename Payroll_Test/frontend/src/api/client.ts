import axios from 'axios';
import type { Employee, Lookups, Paged } from '../types';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL',
});

/** turn a Nest error response into one readable message */
export function errorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const msg = err.response?.data?.message;
    if (Array.isArray(msg)) return msg.join(', ');
    if (typeof msg === 'string') return msg;
    if (!err.response) return 'Cannot reach the server. Is the backend running?';
  }
  return 'Something went wrong';
}

export const api = {
  lookups: () => http.get<Lookups>('/lookups').then((r) => r.data),
  list: (search: string, page: number, limit = 10) =>
    http.get<Paged<Employee>>('/employees', { params: { search, page, limit } }).then((r) => r.data),
  get: (id: number) => http.get<Employee>(`/employees/${id}`).then((r) => r.data),
  create: (body: Record<string, unknown>) => http.post<Employee>('/employees', body).then((r) => r.data),
  update: (id: number, body: Record<string, unknown>) =>
    http.put<Employee>(`/employees/${id}`, body).then((r) => r.data),
  remove: (id: number) => http.delete(`/employees/${id}`).then((r) => r.data),
};
