import type {
  ApiResponse,
  Avatar,
  ElementEntity,
  MapDefaultElement,
  Space,
  SpaceDetails,
} from './types';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1';
export const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface RequestOptions {
  method?: Method;
  token?: string;
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}) {
  const { method = 'GET', token, body } = options;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let parsed: ApiResponse<T>;
  try {
    parsed = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error(`Invalid response (${response.status})`);
  }

  if (!response.ok || parsed.status !== 1) {
    throw new Error(parsed.message || `Request failed (${response.status})`);
  }

  return parsed;
}

export const api = {
  register(username: string, password: string, type: 'Admin' | 'User') {
    return request<{ id: string }>('/auth/register', {
      method: 'POST',
      body: { username, password, type },
    });
  },
  login(username: string, password: string) {
    return request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: { username, password },
    });
  },
  createElement(
    token: string,
    payload: { imageUrl: string; width: number; height: number; static?: boolean },
  ) {
    return request<{ id: string }>('/admin/element', {
      method: 'POST',
      token,
      body: payload,
    });
  },
  updateElement(token: string, elementId: string, imageUrl: string) {
    return request<{ id: string }>(`/admin/element/${elementId}`, {
      method: 'PUT',
      token,
      body: { imageUrl },
    });
  },
  createAvatar(token: string, payload: { imageUrl: string; name: string }) {
    return request<{ avatarId: string }>('/admin/avatar', {
      method: 'POST',
      token,
      body: payload,
    });
  },
  createMap(
    token: string,
    payload: {
      thumbnail?: string;
      name: string;
      dimensions: string;
      defaultElements: MapDefaultElement[];
    },
  ) {
    return request<{ id: string }>('/admin/map', {
      method: 'POST',
      token,
      body: payload,
    });
  },
  updateMetadata(token: string, avatarId: string) {
    return request<null>('/user/metadata', {
      method: 'POST',
      token,
      body: { avatarId },
    });
  },
  getAvatars(token: string) {
    return request<{ avatars: Avatar[] }>('/user/avatars', { token });
  },
  getAvatarBulk(token: string, ids: string) {
    return request<{ avatars: Avatar[] }>(`/user/metadata/bulk/${ids}`, { token });
  },
  createSpace(
    token: string,
    payload: { name: string; dimensions: string; mapId: string },
  ) {
    return request<{ spaceId: string }>('/space', {
      method: 'POST',
      token,
      body: payload,
    });
  },
  deleteSpace(token: string, spaceId: string) {
    return request<null>(`/space/${spaceId}`, {
      method: 'DELETE',
      token,
    });
  },
  getMySpaces(token: string) {
    return request<{ spaces: Space[] }>('/space/all', { token });
  },
  getElements(token: string) {
    return request<{ elements: ElementEntity[] }>('/arena/elements', { token });
  },
  getSpace(token: string, spaceId: string) {
    return request<{ space: SpaceDetails }>(`/arena/${spaceId}`, { token });
  },
  addElement(
    token: string,
    payload: { elementId: string; spaceId: string; x: number; y: number },
  ) {
    return request<{ elementId: string }>('/arena/element', {
      method: 'POST',
      token,
      body: payload,
    });
  },
  deleteElement(token: string, elementId: string) {
    return request<null>('/arena/element', {
      method: 'DELETE',
      token,
      body: { elementId },
    });
  },
};
