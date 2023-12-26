export const fetcher = (url: string, data: any) => {
  return fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...data,
  }).then(res => res.json());
};