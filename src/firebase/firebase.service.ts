import { Injectable } from "@nestjs/common";
import * as firebase from "firebase-admin";

@Injectable()
export class FirebaseService {
    private firebaseApp: firebase.app.App;

    constructor() {
        if (!firebase.apps.length) {
            this.firebaseApp = firebase.initializeApp({
                credential: firebase.credential.cert({
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY,
                }),
                databaseURL: process.env.FIREBASE_DATABASE_URL
            });
        }
        else {
            this.firebaseApp = firebase.apps[0];
        }
    }
    getAuth = (): firebase.auth.Auth => {
        return this.firebaseApp.auth();
    }
}
