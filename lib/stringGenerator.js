function stringGenerator(count, uppercase, lowcase, numbers, symbols) {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+[]{}|;:,.<>?';

    let validChars = '';
    if (uppercase) validChars += uppercaseChars;
    if (lowcase) validChars += lowercaseChars;
    if (numbers) validChars += numberChars;
    if (symbols) validChars += symbolChars;

    let string = '';
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * validChars.length);
        string += validChars.charAt(randomIndex);
    }

    return string;
}

module.exports = { stringGenerator }