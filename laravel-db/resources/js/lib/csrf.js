export function getCsrfHeaders() {
  const xsrfCookie = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith('XSRF-TOKEN='));

  if (!xsrfCookie) {
    throw new Error('Token CSRF tidak ditemukan. Muat ulang halaman lalu coba kembali.');
  }

  return {
    'X-XSRF-TOKEN': decodeURIComponent(xsrfCookie.slice('XSRF-TOKEN='.length)),
  };
}
