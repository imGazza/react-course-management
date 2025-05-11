
export function avatarFallback(firstName: string, lastName: string) {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
}

export function createSkeletonArray(length: number) {
  return [...Array(length)]
}

export function skeletonUniqueId(): string{
  return `skeleton-row-${crypto.randomUUID()}`
}
