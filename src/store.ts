export const url = new URL(location.href)
export const params = url.searchParams

export const age = parseInt(params.get('age') ?? '14')
export const name = params.get('name') ?? 'Unknown'
export const msg = params.get('msg') ?? ''
