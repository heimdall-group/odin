import { scrypt, createCipheriv, scryptSync, createDecipheriv } from 'node:crypto';

const { ENCRYPTION_SECRET, ENCRYPTION_ALGORITHM, ENCRYPTION_BYTES } = useRuntimeConfig();

export const prepareDocument = async (object: {[key: string]: any;}): Promise<{[key: string]: any;}> => {
  const obj: {[key: string]: any;} = {}
  const encryptTarget = async (target: any): Promise<{[key: string]: any;}> => {
    for (const key in target) {
      const element = target[key];
      if (typeof element === 'object') {
        obj[key] = await writeEncryption(JSON.stringify(element))
      } else {
        obj[key] = await writeEncryption(element.toString());
      }
    }

    return obj
  };
  
  return await encryptTarget(object)
};

export const readDocument = async (object: {[key: string]: any;}): Promise<{[key: string]: any;}> => {
    const obj: {[key: string]: any;} = {}
    const decryptTarget = async (target: any): Promise<{[key: string]: any;}> => {
      for (const key in target) {
        const element = target[key];
        const decryption =  await readEncryption(element.toString());        

        obj[key] = parseDecryption(decryption)
      }

      return obj
    };
    
    return await decryptTarget(object)
};

export const writeEncryption = async (string: string): Promise<string> => {
  return new Promise<string> ((resolve, reject) => {
    scrypt(ENCRYPTION_SECRET, 'salt', parseInt(ENCRYPTION_BYTES), (err, key) => {
      if (err) {
        throw err;
      }
      const iv = Buffer.alloc(16, 0);
      // Once we have the key and iv, we can create and use the cipher...
      const cipher = createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

      let encrypted = '';
      cipher.setEncoding('hex');

      cipher.on('data', (chunk) => (encrypted += chunk));
      cipher.on('end', () => resolve(encrypted));

      cipher.write(string);
      cipher.end();
    });
  })
};

export const readEncryption = async (string: string): Promise<string> => {
  return new Promise<string> ((resolve, reject) => {
    const key = scryptSync(ENCRYPTION_SECRET, 'salt', parseInt(ENCRYPTION_BYTES));
    const iv = Buffer.alloc(16, 0);
    
    const decipher = createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);
  
    let decoded = decipher.update(string, 'hex', 'utf8');
    decoded += decipher.final('utf8');

    resolve(decoded)
  })
};

export const parseDecryption = (target: string): {[key: string]: any;} | Array<any> | string => {
  try {
    const object = JSON.parse(target)
    if (object && typeof object === "object") {
      return object;
  } else {
    return target
  }
  } catch(error: any) {
    return target
  }
}
