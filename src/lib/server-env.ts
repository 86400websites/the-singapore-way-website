export class MissingServerEnvError extends Error {
  constructor(public readonly keys: string[]) {
    super(`Missing server environment variables: ${keys.join(', ')}`)
    this.name = 'MissingServerEnvError'
  }
}

export function requireServerEnv(keys: string[]) {
  const missing = keys.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new MissingServerEnvError(missing)
  }

  return Object.fromEntries(keys.map((key) => [key, process.env[key] as string]))
}
