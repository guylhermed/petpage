import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configurações do Firebase para PROD e DEV
const firebaseConfigProd = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseConfigDev = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_DEV_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_DEV_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_DEV_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_DEV_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_DEV_APP_ID,
};

// Função para selecionar o config baseado no ambiente
export function firebaseConfigSelector() {
  const envFirebase = process.env.NEXT_PUBLIC_FIREBASE_ENV;
  const isDevEnv = envFirebase === 'dev' || process.env.NODE_ENV === 'development';

  console.log('🧪 Firebase ENV:', envFirebase);
  console.log('🧪 NODE_ENV:', process.env.NODE_ENV);
  console.log('🔥 Firebase config selecionado:', isDevEnv ? 'DEV' : 'PROD');

  const firebaseConfig = isDevEnv ? firebaseConfigDev : firebaseConfigProd;

  for (const key in firebaseConfig) {
    if (!firebaseConfig[key]) {
      throw new Error(`Missing Firebase config variable: ${key}`);
    }
  }

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  return { db, storage };
}
