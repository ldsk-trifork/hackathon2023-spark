interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  jti: string;
}

export default async function getBearerToken(): Promise<AccessTokenResponse> {
  let headers = new Headers();
  const username = 'sb-hack23-s4-notifications-invokerscf-hack23-team3!t8513';
  const password = 'H/+UuW8L2SYYttqLSB2fcmj3xaY=';
  headers.set('Authorization', 'Basic ' + base64Encode(username + ":" + password));

  const url = "https://invokerscf.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials&response_type=token";
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });

  return response.json();
}

function base64Encode(str: string) {
  return Buffer.from(str).toString('base64')
}