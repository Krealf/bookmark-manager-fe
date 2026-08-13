export function getToken() {
  const token = localStorage.getItem('token');

  return token && token !== 'undefined' ? token : null;
}

export function setToken(newToken: string) {
  if (!newToken) {
    removeToken();
    return;
  }

  return localStorage.setItem('token', newToken);
}

export function removeToken() {
  return localStorage.removeItem('token');
}
