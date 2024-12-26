export const getURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? // Your site URL in production
    process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
    'http://localhost:3000/'
  
  // Make sure to include `https://` when not localhost
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include trailing `/`
  url = url.endsWith('/') ? url : `${url}/`
  return url
}
