export const fetcher = (url: string, data: any) => {
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...data,
    credentials: 'include',
  }).then(res => res.json());
};