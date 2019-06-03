import { Base64 } from 'js-base64';
export const hashObject = async obj => {
    let encoder = new TextEncoder();
    let data = encoder.encode(JSON.stringify(obj));
    let digest = await window.crypto.subtle.digest('SHA-1', data);
    return Base64.encode(new Uint32Array(digest));
};

