export const handle_error: Function = async (error:Throw_Error) => {
  switch(error.severity) {
    case 1:
      // SEND TO SENTRY
      console.error(error)
      console.error(`${error.code}: ${error.message}`);
      break;
    case 2:
      console.error(`${error.code}: ${error.message}`);
      break;
    case 3:
      console.warn(`${error.code}: ${error.message}`);
      break;
    case 4:
      console.warn(`${error.code}: ${error.message}`);
      break;
  }
}