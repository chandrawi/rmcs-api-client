/**
 * Convert base64 string to UUID hex representation
 * @param {string} str 
 * @returns {string}
 */
export function base64_to_uuid_hex(str) {
    const raw = atob(str);
    let result = '';
    let dashPos = [3, 5, 7, 9];
    for (let i = 0; i < raw.length; i++) {
      const hex = raw.charCodeAt(i).toString(16);
      result += (hex.length === 2 ? hex : '0' + hex);
      if (dashPos.includes(i)) {
        result += '-'
      }
    }
    return result.toUpperCase();
}

/**
 * Convert UUID hex representation to base64 string
 * @param {string} uuid 
 * @returns {string}
 */
export function uuid_hex_to_base64(uuid) {
    if (typeof uuid == "string") {
        uuid = uuid.replace(/-/g, '')
        if (/^[0-9a-fA-F]{32}$/.test(uuid)) {
            return btoa(uuid.match(/\w{2}/g).map((a) => {
                return String.fromCharCode(parseInt(a, 16));
            }).join(""));
        }
    }
    return ""
}
