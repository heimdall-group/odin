import {
  getAuth,
  signInWithCustomToken,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { useStore } from '~/stores/main';

export const firebase_initialize_authentication: Function = async ():Promise<void> => {
  const store = useStore();
  const auth = getAuth();
  try {
    const subscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const { claims } = await user.getIdTokenResult()
          const { expiresAt } = claims;
          const remainingTime = expiresAt - new Date().getTime();
          const { ENVIRONMENT } = useRuntimeConfig().public;
          if (remainingTime < 0 && ENVIRONMENT.toString().trim() !== 'app') {
            signOut(auth);
          } else {
            finalize_signin(user as Auth_User);

            if (ENVIRONMENT.toString().trim() !== 'app') {
              if (720000 > remainingTime) {
                console.log(remainingTime)
                console.log('less then 12 hours left')
                setTimeout(() => {signOut(auth);store.setGlobalLoading(false)}, remainingTime)
              } else {
                console.log('more left then 12 hours')
              }
            }
          }
        } else {
          store.setGlobalLoading(false);
        }
        subscribe();
    });
  } catch(err) {
    console.error(err)
    store.setGlobalLoading(false)
  }
}

export const firebase_initialize_user: Function = async (data: any):Promise<void> => {
  try {
    if (data.value === undefined || data.value === null) {
      throw {
        message: 'Authentication fetch failed',
        code: 'firebase_initialize_user/authentication-fetch-failed',
        severity: 3,
        type: 'client',
      }
    }

    if (!data.value.success) {
      throw {
        message: 'Authentication fetch failed',
        code: 'firebase_initialize_user/authentication-fetch-failed',
        severity: 3,
        type: 'client',
      }
    }
    const result = data.value;

    if (!result.success) {
      throw {
        message: 'Authentication fetch failed',
        code: 'firebase_initialize_user/authentication-fetch-failed',
        severity: 3,
        type: 'client',
      }
    }

    const auth = getAuth();
    const { user } = await signInWithCustomToken(auth ,result.data.token)
    finalize_signin(user as Auth_User, true)
  } catch(error) {
    console.log(error)
  }
}

const finalize_signin = async (user: Auth_User):Promise<void> => {
  const store = useStore();
  const router = useRouter();
  const token = await user.getIdToken();
  const result:Server_Return = await useInternalFetch(`/api/v1/user/${token}`)
  if (result.success) {
    store.setUser(user);
    store.addUserDocument(result.data)
    store.setGlobalLoading(false);
  } else {
    store.setGlobalLoading(false);
  }
}

export const firebase_signout = async () => {
  return new Promise((resolve, reject) => {
    const store = useStore();
    const router = useRouter();
    const auth = getAuth();
    signOut(auth).then(() => {
      router.push('/app/login')
      store.setUser({} as Auth_User)
      resolve(true)
    }).catch(() => {
      reject(false)
    })
  })

}
