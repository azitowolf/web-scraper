// Imports the Google Cloud client library
const Translate = require('@google-cloud/translate');

// Your Google Cloud Platform project ID
const projectId = 'livwell-177808';

// Instantiates a client
const translateClient = Translate({
  projectId: projectId
});

// The text to translate
const text = 'Hello, world!';
// The target language
const target = 'ru';

// Translates some text into Russian
translateClient.translate(text, target)
  .then((results) => {
    const translation = results[0];

    console.log(`Text: ${text}`);
    console.log(`Translation: ${translation}`);
  })
  .catch((err) => {
    console.error('ERROR:', err);
  });