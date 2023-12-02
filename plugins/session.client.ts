export default defineNuxtPlugin(() => {
  const { SESSION_ID_COOKIE_NAME, ENVIRONMENT } = useRuntimeConfig().public
  const odin_sid = useInternalCookie(SESSION_ID_COOKIE_NAME, {});
  if (odin_sid.value === undefined || odin_sid.value === '') {
    const id = createSessionID();
    odin_sid.value = id;
  }
})

export const createSessionID = ():string => {
  const time = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  return `${random.toString(16)}${time.toString(32)}`
}
