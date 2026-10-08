// IBM final-project Task 10.
// These four methods use Axios + async/await to call the REST API.
const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

async function getAllBooks() {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
}

async function getBooksByISBN(isbn) {
  const response = await axios.get(`${BASE_URL}/isbn/${encodeURIComponent(isbn)}`);
  return response.data;
}

async function getBooksByAuthor(author) {
  const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
  return response.data;
}

async function getBooksByTitle(title) {
  const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
  return response.data;
}

module.exports = { getAllBooks, getBooksByISBN, getBooksByAuthor, getBooksByTitle };

// Optional CLI for easy testing.
if (require.main === module) {
  (async () => {
    const [command, value] = process.argv.slice(2);
    try {
      let result;
      if (command === 'all') result = await getAllBooks();
      else if (command === 'isbn') result = await getBooksByISBN(value);
      else if (command === 'author') result = await getBooksByAuthor(value);
      else if (command === 'title') result = await getBooksByTitle(value);
      else throw new Error('Usage: node general.js all | isbn <isbn> | author <author> | title <title>');
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error(error.response?.data || error.message);
      process.exitCode = 1;
    }
  })();
}
