interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  jti: string;
}

type CachedResponse = AccessTokenResponse & {
  expires_at: Date
}

let lastResponse: CachedResponse | null = null;

export default async function getBearerToken(): Promise<string> {
  if (lastResponse != null && lastResponse.expires_at > new Date()) {
    return lastResponse.access_token;
  }

  const headers = new Headers();
  headers.set('Authorization', 'Basic ' + base64Encode(process.env.CF_AUTH_CLIENT_ID + ":" + process.env.CF_AUTH_CLIENT_SECRET));

  const url = `${process.env.CF_AUTH_HOST}/oauth/token?grant_type=client_credentials&response_type=token`;
  const now = new Date();
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  const accessToken = await response.json();
  lastResponse = {
    ...accessToken,
    expires_at: new Date(+now + (accessToken.expires_in * 1_000))
  };

  return accessToken.access_token;
}

function base64Encode(str: string) {
  return Buffer.from(str).toString('base64')
}