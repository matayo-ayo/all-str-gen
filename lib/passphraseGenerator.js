const fs = require('fs')
const path = require('path')

function loadWordSetFromFile(filePath) {
    try {
        const absolutePath = path.join(__dirname, `../words/${filePath}`);
        const data = fs.readFileSync(absolutePath, 'utf-8');
        return JSON.parse(data)
    } catch (err) {
        console.error(err.message)
        return [];
    }
}

function passphraseGenerator(count) {
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)]
    const nounSet = loadWordSetFromFile('noun.json')
    const verbSet = loadWordSetFromFile('verb.json')
    const adjectiveSet = loadWordSetFromFile('adjective.json')

    const wordSets = {
        noun: nounSet,
        verb: verbSet,
        adjective: adjectiveSet
    };

    let sentence = '';
    for (let i = 0; i < count; i++) {
        const wordType = getRandomElement(Object.keys(wordSets))
        const wordSelected = getRandomElement(wordSets[wordType])
        sentence += `${wordSelected} `
    }
    return sentence.trim()
}

module.exports = { passphraseGenerator }