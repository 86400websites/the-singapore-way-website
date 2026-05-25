export function getSafeRedirectPath(value: string | string[] | null | undefined) {
  const path = Array.isArray(value) ? value[0] : value

  if (path && path.startsWith('/') && !path.startsWith('//')) {
    return path
  }

  return '/account'
}
