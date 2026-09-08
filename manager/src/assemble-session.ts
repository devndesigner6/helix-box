export interface AssembleSessionSnapshot {
  code: string;
  expiresAt: number;
  paidUntil: number;
  password: string | null;
  appWs: unknown | null;
  cliWs: unknown | null;
}

export interface AssembleSessionStatus {
  code: string;
  exists: true;
  paid: boolean;
  paidUntil: number;
  expiresAt: number;
  appConnected: boolean;
  cliConnected: boolean;
}

export function buildAssembleSessionStatus(
  session: AssembleSessionSnapshot,
  now = Date.now(),
): AssembleSessionStatus {
  return {
    code: session.code,
    exists: true,
    paid: session.paidUntil > now && session.expiresAt > now,
    paidUntil: session.paidUntil,
    expiresAt: session.expiresAt,
    appConnected: Boolean(session.appWs),
    cliConnected: Boolean(session.cliWs),
  };
}

export function createAssembledPayload(
  session: AssembleSessionSnapshot,
): string | null {
  if (!session.password) return null;
  return JSON.stringify({
    type: "assembled",
    code: session.code,
    password: session.password,
  });
}
