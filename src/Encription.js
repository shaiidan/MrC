import CryptoJS from 'crypto-js';

class Encription{
    static encrypt(message, key){
        if(key !== '' & key !== undefined){
            var messageEncrypt = CryptoJS.AES.encrypt(message, key);
            return messageEncrypt.toString();
        }
        return null;
    }
    static decrypt(message, key){
        if(key !== '' & key !== undefined){
            var code = CryptoJS.AES.decrypt(message, key);
            var decryptedMessage = code.toString(CryptoJS.enc.Utf8);
            return decryptedMessage;
        }
        return null;
    }
}
export default Encription;