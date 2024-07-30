// Ensure CryptoJS and jwt are available globally
const { CryptoJS, jwt } = window;

export const decryptItem = (item, secret, isNotTransform = false) => {
  let decrypted;

  const options = {
    keySize: 128 / 8,
    iv: CryptoJS.enc.Hex.parse(secret), // Ensure the IV is correctly parsed
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };

  if (isNotTransform) {
    decrypted = CryptoJS.AES.decrypt(item, secret, options);
    return decrypted.toString(CryptoJS.enc.Utf8);
  } else {
    decrypted = CryptoJS.AES.decrypt(item, secret, options);
    return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted));
  }
};

export const encryptItem = (item, secret, isJson = true, isStore = false, key = null) => {
  const itemValue = isJson ? JSON.stringify(item) : item;
  const options = {
    keySize: 128 / 8,
    iv: CryptoJS.enc.Hex.parse(secret), // Ensure the IV is correctly parsed
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  };

  const encrypted = CryptoJS.AES.encrypt(itemValue, secret, options);
  const encryptedString = encrypted.toString();
  if (isStore && key !== null) {
    setItem(key, encryptedString);
  }

  return encryptedString;
};

export const jwtVerifyItem = (key, item, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(item, secret, (err, decoded) => {
      if (err) {
        reject(null);
      } else {
        resolve(decoded[key]);
      }
    });
  });
};

export const jwtSignItem = (key, value, secret, isStore = false) => {
  return new Promise((resolve, reject) => {
    jwt.sign({ [key]: value }, secret, { algorithm: 'HS256', expiresIn: '24h' }, (err, token) => {
      if (err) {
        reject(err);
      } else {
        if (isStore) {
          setItem(key, token);
        }
        resolve(token);
      }
    });
  });
};

// Helper function to store items, define it according to your storage method
const setItem = (key, value) => {
  // For example, using localStorage
  localStorage.setItem(key, value);
};

export const excludeFromModel = (arr = [], keys = []) => {
  if (!Array.isArray(arr) || !Array.isArray(keys)) {
    throw new TypeError('Both parameters should be arrays.');
  }
  for (const obj of arr) {
    if (typeof obj === 'object' && obj !== null) {
      for (const key of keys) {
        delete obj[key];
      }
    }
  }
};

export const isArray(str) {
  return Object.prototype.toString.call(str) == '[object Array]';
}

export const withDecimal = (num, decimalPlace = 2, locale = 'en-US') => {
  const number = parseFloat(num);
  if (isNaN(number)) {
    throw new TypeError('The first parameter must be a valid number.');
  }
  return number.toLocaleString(locale, { minimumFractionDigits: decimalPlace, maximumFractionDigits: decimalPlace });
};
