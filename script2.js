const imageContainer = document.getElementById('image-container')
const loader = document.getElementById('loader')

let ready = false
let imagesLoaded = 0
let totalImages = 0
let photosArray = []

// Unsplash API
let count = 5
const query = 'architecture'
const apiKey = 'U29Fq-xjUJg2aO9vKCRaG8webPhl6gWgiPUm2N5IkGg'
let apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}&query=${query}`

//проверяет для каждого фото загрузилось ли оно
function imageLoaded() {
  imagesLoaded++
  if (imagesLoaded === totalImages) {
    ready = true
    loader.hidden = true
    count = 30
    apiUrl = `https://api.unsplash.com/photos/random?client_id=${apiKey}&count=${count}&query=${query}`
  }
}

// Helper Function to Set Attributes on DOM Elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key])
  }
}

//Создание элементов для ссылок и фото, и добавление в DOM
function displayPhotos() {
  imagesLoaded = 0
  totalImages = photosArray.length

  photosArray.forEach((photo) => {

    const item = document.createElement('a')
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank',
    })

    const img = document.createElement('img')
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    })

    img.addEventListener('load', imageLoaded)
    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img)
    imageContainer.appendChild(item)
  })
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl)
    photosArray = await response.json()
    displayPhotos()
  } catch (error) {
    console.log('whoops', err)
  }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos();
