import api from '../api';

const unwrap = (response) => {
  const body = response.data;
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    return body.data;
  }
  return body;
};

export const listerAppVersions = async () => {
  const response = await api.get('/admin/app-version');
  return unwrap(response);
};

export const creerAppVersion = async (payload) => {
  const response = await api.post('/admin/app-version', payload);
  return unwrap(response);
};

export const modifierAppVersion = async (id, payload) => {
  const response = await api.put(`/admin/app-version/${id}`, payload);
  return unwrap(response);
};

export const supprimerAppVersion = async (id) => {
  const response = await api.delete(`/admin/app-version/${id}`);
  return unwrap(response);
};
