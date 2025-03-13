import md5 from "./js-md5.js"; // Import the module used for the md5 hash

const publicKey = <PUBLIC API KEY>; // Marvel api public key
const privateKey = <PRIVATE API KEY>; // Marvel api private key
const url = "http://gateway.marvel.com/v1/public/characters"; // Marvel api base character url


export async function getCharacterByName(characterName, imageType) {
    const timestamp = new Date().getTime(); // Get current time for md5 hash
    const hash = md5(timestamp + privateKey + publicKey); // Create md5 hash using the time stamp and both api keys
    const queryParams = new URLSearchParams({ // Create the query parameters ready for the fetch query
        ts: timestamp,
        apikey: publicKey,
        hash: hash,
        name: characterName,
    });

    try {
        const response = await fetch(`${url}?${queryParams.toString()}`); // Create request to marvel api requesting the character supplied to the function
        
        // Check if the response was okay
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`); // Throw the error supplied if it applies
        }

        const data = await response.json(); // If the response is okay format it in json

        if (data.data.results.length > 0) {
            const character = data.data.results[0];
            return { // If the json isn't empty return the query data
                name: character.name,
                description: character.description, // Return the character description and keep it empty if there isnt one
                imageURL: `${character.thumbnail.path}/${imageType}.${character.thumbnail.extension}`, // Concatenate the thumbnail path, image size and file extension
            };
        } else {
            return false; // If the json is empty return false
        }
    } catch (error) {
        return false;  // Return false to indicate failure
    }
}
