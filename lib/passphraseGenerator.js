const fs = require('fs')

function loadWordSetFromFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error(`Error reading file ${filePath}: ${error.message}`)
        return [];
    }
}

function passphraseGenerator(count) {
    const getRandomElement = (array) => array[Math.floor(Math.random() * array.length)]

    const nounSet = loadWordSetFromFile('../words/noun.json')
    const verbSet = loadWordSetFromFile('../words/verb.json')
    const adjectiveSet = loadWordSetFromFile('../words/adjective.json')

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