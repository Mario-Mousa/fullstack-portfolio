export type OwnerAccount = {
  email: string | null;
  role: string;
};

export function normalizeOwnerEmail(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

export function resolveOwnerOpenId(
  persistedOpenId: string | null | undefined,
  configuredOpenId: string | null | undefined,
) {
  return persistedOpenId?.trim() || configuredOpenId?.trim() || "";
}

export function isOwnerAccount(account: OwnerAccount, ownerEmail: string | null | undefined) {
  const normalizedOwnerEmail = normalizeOwnerEmail(ownerEmail);
  return account.role === "admin" && Boolean(normalizedOwnerEmail) && normalizeOwnerEmail(account.email) === normalizedOwnerEmail;
}
