export default defineNuxtPlugin(() => {
  const { SESSION_ID_COOKIE_NAME } = useRuntimeConfig().public

  const odin_sid = useCookie(SESSION_ID_COOKIE_NAME);
  if (odin_sid.value === undefined || odin_sid.value === '') {
    const time = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    odin_sid.value = `${random.toString(16)}${time.toString(32)}`
  }
})
