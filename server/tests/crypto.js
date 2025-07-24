const crypto = require('crypto');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const key = process.env.ACCESS_TOKEN_KEY;
const text = "kdsjh4898__dhfds89fhds#89@^bkdsfh9s8d89f(D*f9";

const encryptSymmetric = (key, plaintext) => {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(key, 'base64'),
    iv
  );
  let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
  ciphertext += cipher.final('base64');
  const tag = cipher.getAuthTag();

  const encrypted = `${iv.toString('base64')}:${tag.toString('base64')}:${ciphertext}`;
  return encrypted;
};

const decryptSymmetric = (key, encryptedString) => {
  const [ivB64, tagB64, ciphertext] = encryptedString.split(':');

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm", 
    Buffer.from(key, 'base64'),
    Buffer.from(ivB64, 'base64')
  );
  
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));

  let plaintext = decipher.update(ciphertext, 'base64', 'utf8');
  plaintext += decipher.final('utf8');

  return plaintext;
};

console.log("Text:", text);
const encryptedString = encryptSymmetric(key, text);
console.log("Encrypted string:", encryptedString);

const decryptedText = decryptSymmetric(key, encryptedString);
console.log("Decrypted text:", decryptedText);