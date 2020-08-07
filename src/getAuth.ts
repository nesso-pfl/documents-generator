import { google } from "googleapis";
import readline from "readline";
import fs from "fs";
import credential from "./credential.json";
import token from "./token.json";

const { client_secret, client_id, redirect_uris } = credential.installed;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

type OAuth2Client = typeof oAuth2Client;

export default async (): Promise<OAuth2Client> => {
  const { refresh_token } = token;
  oAuth2Client.setCredentials({ refresh_token });
  const res = await oAuth2Client.refreshAccessToken();
  oAuth2Client.setCredentials({ access_token: res.credentials.access_token });
  /*
  await fs.readFile("./src/token.json", (err, token) => {
    if (err) {
      console.error(err);
      return getNewToken();
    }
    oAuth2Client.setCredentials(JSON.parse(token.toString()));
    return oAuth2Client;
  });
  */

  return oAuth2Client;
};

function getNewToken() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/spreadsheets",
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error(err);
      if (token) oAuth2Client.setCredentials(token);
      fs.writeFile("./src/token.json", JSON.stringify(token), (err) => {
        if (err) return console.error(err);
      });
    });
  });
}
