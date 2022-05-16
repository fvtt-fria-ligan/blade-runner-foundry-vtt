const { get } = require('https');
const { createWriteStream } = require('fs');

/**
 * @param {string} filename How & where to save the file.
 * @param {string} url      Where to download the file.
 */
function download(filename, url) {
  const file = createWriteStream(filename);
  const req = get(url, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf-8');
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`);
    });
    res.on('end', () => {
      req.end();
      console.log('No more data in response.');
    });
    res.pipe(file);
    file.on('finish', () => file.close());
  });

  req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
  });
}

// Downloading Resources
console.log('> Downloading resources...');
console.log('• YZUR: Year Zero Universal Roller');
// eslint-disable-next-line max-len
// download('static/lib/yzur.js', 'https://github.com/Stefouch/foundry-year-zero-roller/releases/download/v4.0.0/yzur.js');
