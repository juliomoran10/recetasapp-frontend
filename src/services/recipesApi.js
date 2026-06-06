import { request } from './apiClient';

export function listRecipesApi({ groupId, search, mine } = {}) {
  const params = new URLSearchParams();

  if (groupId) {
    params.set('groupId', groupId);
  }

  if (search) {
    params.set('search', search);
  }

  if (mine) {
    params.set('mine', 'true');
  }

  const query = params.toString();
  const path = query ? `/recipes?${query}` : '/recipes';

  return request(path, { auth: true });
}

export function getRecipeApi(id) {
  return request(`/recipes/${id}`, { auth: true });
}

export function createRecipeApi(payload) {
  return request('/recipes', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export function updateRecipeApi(id, payload) {
  return request(`/recipes/${id}`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(payload)
  });
}

export function deleteRecipeApi(id) {
  return request(`/recipes/${id}`, {
    method: 'DELETE',
    auth: true
  });
}
