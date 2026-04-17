import * as admin from "firebase-admin";
import serviceAccount from "./firebase-admin.json";

export const initFirebase = () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
  }
};

export { admin };