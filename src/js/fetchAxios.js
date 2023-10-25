import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '40207022-3419c72a3f77a39584f0c1b04';

async function fetchImage(name, page = 1, limit = 40) {
  try {
    const data = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${limit}`
    );

    return data;
  } catch (error) {
    console.log(error);
  }
}

export { fetchImage };
// async function fetchImage(name, page = 1, limit = 40) {
//   const searchParams = new URLSearchParams({
//     key: `${API_KEY}`,
//     q: `${name}`,
//     image_type: 'photo',
//     orientation: 'horizontal',
//     safesearch: true,
//     page: `${page}`,
//     per_page: `${limit}`,
//   });

//   const { data } = await axios.get(`${BASE_URL}?${searchParams}`);
//   return data;
// }

// axios({
//   method: 'GET',
//   url: `${BASE_URL}`,
//   key: `${API_KEY}`,
//   q: `${name}`,
//   image_type: `photo`,
//   orientation: `horizontal`,
//   safesearch: `true`,
//   page: `${page}`,
//   per_page: `${limit}`,
// });

// return (resp = axios({
//   method: 'GET',
//   url: `${BASE_URL}'
//       key: '${API_KEY}'
//       q: '${name}'
//       image_type: 'photo'
//       orientation: 'horizontal'
//       safesearch: 'true'
//       page: '${page}'
//       per_page: '${limit}`,
// }));
