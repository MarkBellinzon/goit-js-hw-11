import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40207022-3419c72a3f77a39584f0c1b04';

async function fetchImage(name, page = 1, limit = 60) {
  try {
    const resp = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${limit}`
    );
    console.log(resp);
    return resp;
  } catch (error) {
    console.log(error);
  }
}

export { fetchImage };
