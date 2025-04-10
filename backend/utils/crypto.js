const crypto = require('crypto');

const ALGORITHM = 'aes-256-cbc';
const SECRET_KEY = process.env.SECRET_KEY ||'12345678901234567890123456789012';

// Encrypt
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Decrypt
function decrypt(encrypted) {
  try {
    const [ivHex, encryptedText] = encrypted.split(':');

    if (!ivHex || !encryptedText || ivHex.length !== 32) {
      throw new Error('Invalid IV or format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('Decryption failed:', encrypted);
    console.error(err.message);
    return '[DECRYPTION_ERROR]'; // Or null if you prefer
  }
}


module.exports = { encrypt, decrypt };
