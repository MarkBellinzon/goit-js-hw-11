import Notiflix from 'notiflix';
import './style.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImage } from './fetchAxios';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const infitity = document.querySelector('.infitity-scroll');

let page = 1;

form.addEventListener('submit', onSubmit);

async function onSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  const inputValue = input.value;
  const value = inputValue.trim();
  if (!value) {
    Notiflix.Notify.failure('Sorry, blank line. Enter your request!');
    infitity.hidden = true;
    return;
  }
  return await fetchThen(value);
}

// loadMore.hidden = true;

async function fetchThen(value) {
  try {
    const resp = await fetchImage(value);
    const array = resp.data.hits;
    const number = resp.data.totalHits;
    if (array.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images your search query. Please try again'
      );
      infitity.hidden = true;
      return;
    }
    if (number > 0) {
      Notiflix.Notify.info(`Hooray! We found ${number} images.`);
    }
    createMarkup(array, gallery);
    lightbox.refresh();
    infitity.hidden = false;
    if (array.length < 60) {
      infitity.hidden = true;
    }
  } catch (error) {
    console.log(error);
  }
}

// infitity.addEventListener('click', onLoadMoreBtn);
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 300 });

async function onLoadMoreBtn() {
  const valueLoadBtn = input.value;
  let limitAdd = 60;
  page += 1;
  try {
    const resp = await fetchImage(valueLoadBtn, page, limitAdd);
    const hits = resp.data.hits;
    const totalHits = resp.data.totalHits;
    const maxIndex = (page - 1) * limitAdd + hits.length;
    createMarkup(hits, gallery);
    handlerScroll();
    lightbox.refresh();
    if (maxIndex >= totalHits) {
      infitity.hidden = true;
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

function onPageScrolling() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function createMarkup(array) {
  const markup = array
    .map(arr => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = arr;

      return `<div class="photo-card">
        <a class="link" href="${largeImageURL}">
        <img class ="gallary-image"
        src="${webformatURL}"
        alt="${tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item"><b>Likes: ${likes}</b></p>
          <p class="info-item"><b>Views: ${views}</b></p>
          <p class="info-item"><b>Comments: ${comments}</b></p>
          <p class="info-item"><b>Downloads: ${downloads}</b></p>
        </div>
      </div>`;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
}

const btnUp = {
  el: document.querySelector('.btn-up'),
  show() {
    this.el.classList.remove('btn-up_hide');
  },
  hide() {
    this.el.classList.add('btn-up_hide');
  },
  addEventListener() {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      scrollY > 400 ? this.show() : this.hide();
    });
    document.querySelector('.btn-up').onclick = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    };
  },
};
btnUp.addEventListener();

// const elements = {
//   list: document.querySelector('.js-movie-list'),
//   guard: document.querySelector('.js-guard'),
// };
const options = {
  root: null,
  rootMargin: '300px',
};
const observer = new IntersectionObserver(handlerLoadMore, options);
// let page = 1;

fetchImage(page)
  .then(data => {
    infitity.gallery.insertAdjacentHTML(
      'beforeend',
      createMarkup(data.results)
    );
    if (data.hits < data.totalHits) {
      observer.observe(infitity);
    }
  })
  .catch(err => console.log(err));

// function serviceMovie(page = 1) {
//   const BASE_URL = 'https://api.themoviedb.org/3';
//   const END_POINT = '/trending/movie/week';
//   const API_KEY = '345007f9ab440e5b86cef51be6397df1';
//   const params = new URLSearchParams({
//     api_key: API_KEY,
//     page,
//   });

//   return fetch(`${BASE_URL}${END_POINT}?${params}`).then(resp => {
//     if (!resp.ok) {
//       throw new Error(resp.statusText);
//     }
//     return resp.json();
//   });
// }

// function createMarkup(arr) {
//   return arr
//     .map(
//       ({ poster_path, original_title, release_date, vote_average }) => `
//       <li class="movie-card">
//           <img src="https://image.tmdb.org/t/p/w300${poster_path}" loading="lazy" alt="${original_title}">
//           <div class="movie-info">
//           <h2>${original_title}</h2>
//           <p>Release date: ${release_date}</p>
//           <p>Vote Average: ${vote_average}</p>
//           </div>
//       </li>`
//     )
//     .join('');
// }

let counterObserver = 0;
function handlerLoadMore(entries, observer) {
  counterObserver += 1;
  console.log('counterObserver', counterObserver);
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      onLoadMoreBtn(page)
        .then(data => {
          infitity.gallery.insertAdjacentHTML(
            'beforeend',
            createMarkup(data.results)
          );
          if (data.hits >= 500) {
            observer.unobserve(infitity);
          }
        })
        .catch(err => console.log(err));
    }
  });
}

document.addEventListener('scroll', handlerScroll);

let counterScroll = 0;
function handlerScroll() {
  counterScroll += 1;
  console.log('counterScroll', counterScroll);
}
