import { AuthStorage, type UserCredentials } from "./authStorage";

type MobileSessionExchangeParams = {
  mtoken: string;
  baseUrl: string;
};

type MobileSessionPayload = {
  email?: string;
};

type EmailLoginResponse = {
  user_credentials?: UserCredentials;
};

export async function exchangeMobileSession({
  mtoken,
  baseUrl,
}: MobileSessionExchangeParams): Promise<{ email: string | null }> {
  const response = await fetch(`${baseUrl}/abs-plus/mobile-session/${mtoken}`);
  const json = (await response.json()) as {
    success?: boolean;
    data?: MobileSessionPayload;
  };

  const email = json?.data?.email?.trim().toLowerCase() ?? "";
  if (!json?.success || !email) {
    throw new Error("Unable to recover your mobile account");
  }

  AuthStorage.clearAuth();

  const loginResponse = await fetch(`${baseUrl}/auth/google/success-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({
      email,
      userDeviceToken: "no-token",
    }),
  });

  const loginJson = (await loginResponse.json()) as EmailLoginResponse & {
    message?: string;
  };

  if (!loginResponse.ok || !loginJson?.user_credentials?.token) {
    throw new Error(loginJson?.message || "Unable to switch to your mobile account");
  }

  AuthStorage.setAuthData(loginJson.user_credentials);

  return { email };
}
