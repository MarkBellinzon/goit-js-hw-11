import Notiflix from 'notiflix';
import './style.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImage } from './fetchAxios';

const form = document.querySelector('.search-form');
const input = document.querySelector('.search-input');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

let page = 1;

form.addEventListener('submit', onSubmit);

loadMore.addEventListener('click', onLoadMoreBtn);
const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 300 });

async function onSubmit(evt) {
  evt.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  const inputValue = input.value;
  const value = inputValue.trim();
  if (!value) {
    Notiflix.Notify.failure('Sorry, blank line. Enter your request!');
    loadMore.hidden = true;
    return;
  }
  return await fetchThen(value);
}

loadMore.hidden = true;

async function fetchThen(value) {
  try {
    const resp = await fetchImage(value);
    const array = resp.data.hits;
    const number = resp.data.totalHits;
    if (array.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images your search query. Please try again'
      );
      loadMore.hidden = true;
      return;
    }
    if (number > 0) {
      Notiflix.Notify.info(`Hooray! We found ${number} images.`);
    }
    createMarkup(array, gallery);
    lightbox.refresh();
    loadMore.hidden = false;
    if (array.length < 60) {
      loadMore.hidden = true;
    }
  } catch (error) {
    console.log(error);
  }
}

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
    onPageScrolling();
    lightbox.refresh();
    if (maxIndex >= totalHits) {
      loadMore.hidden = true;
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

function createMarkup(arr) {
  const markup = arr
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
