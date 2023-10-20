import { Auth } from "firebase-admin/auth";

export const createCustomToken = (auth: Auth, uid: string, expires_in: number):Promise<Return> => {
  return new Promise((resolve, reject):void => {
    auth.createCustomToken(uid, {
      expiresAt: Date.now() + (expires_in * 1000),
    }).then((customToken: any) => {
      resolve({
        data: customToken,
        success: true,
      });
    })
    .catch((error: any) => {
      reject({
        data: false,
        success: false,
        error: error,
      });
    });
  })
}
