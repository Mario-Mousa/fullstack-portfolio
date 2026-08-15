export type OwnerAccount = {
  email: string | null;
  loginMethod: string | null;
  role: string;
};

type AccountRole = "admin" | "user";

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
  return account.loginMethod === "dashboard-password" && Boolean(normalizedOwnerEmail) && normalizeOwnerEmail(account.email) === normalizedOwnerEmail;
}

export function resolveRoleWrite(
  requestedRole: AccountRole | undefined,
  openId: string,
  configuredOwnerOpenId: string | null | undefined,
) {
  const role = requestedRole ?? (openId === configuredOwnerOpenId ? "admin" : "user");
  return { role, shouldUpdateExistingRole: requestedRole !== undefined };
}
