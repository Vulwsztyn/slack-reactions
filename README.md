# slack-reactions

## How to use

1. Get a token as instructed here https://stackoverflow.com/a/67795540/7195666
2. Create `.env` file with `TOKEN=your-token`
3. `npm install`
4. `node index.js <channel-id> <string> <text of reactions>`

string: should be a string that appears in the message you want to react to and no later message.

## Prerequisites

This code assumes you have 2 letter emoji packs `alphabet-${colour}-${reaction}` for colours `white` and `yellow` and reaction being letters.

TODO: more alphabets
