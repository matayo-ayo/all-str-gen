function stringGenerator(count, cap, low, num, sym) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let validChars = '';
    if (cap) validChars += uppercaseChars;
    if (low) validChars += lowercaseChars;
    if (num) validChars += numberChars;
    if (sym) validChars += symbolChars;

    let string = '';
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * validChars.length);
        string += validChars.charAt(randomIndex);
    }

    return string;
}

module.exports = { stringGenerator }