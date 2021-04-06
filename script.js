const imageContainer = document.getElementById('image-container')
const loader = document.getElementById('loader')

let isInitialLoad = true
let isReady = false
let imagesLoaded = 0
let totalImages = 0
let photosArray = []

// Unsplash API
let initialCount = 5
const apiKey = 'U29Fq-xjUJg2aO9vKCRaG8webPhl6gWgiPUm2N5IkGg'
const query = 'architecture'
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}&query=${query}`

// обновляем URL для API
function updateAPIUrlWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${picCount}&query=${query}`
}

// Проверяет для каждого фото загрузилось ли оно
function imageLoaded() {
  imagesLoaded++
  if (imagesLoaded === totalImages) {
    isReady = true
    loader.hidden = true
  }
}

// Вспомогательная функция для установки атрибутов в элементы DOM
function setAttributes(elem, attributes) {
  for (let key in attributes) {
    elem.setAttribute(key, attributes[key])
  }
}

// Создание элементов для ссылок и фото, и добавление в DOM
function displayPhotos() {
  imagesLoaded = 0
  totalImages = photosArray.length

  photosArray.forEach(photo => {

    const item = document.createElement('a')
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank'
    })

    const image = document.createElement('img')
    setAttributes(image, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description
    })
    image.addEventListener('load', imageLoaded)

    item.appendChild(image)
    imageContainer.appendChild(item)
  })
}

// Получаем изображения
async function getPhotos() {
  try {
    const response = await fetch(apiUrl)
    photosArray = await response.json()
    displayPhotos()

    if (isInitialLoad) {
      updateAPIUrlWithNewCount(30)
      isInitialLoad = false
    }
  } catch (err) {
    console.log('whoops', err)
  }
}

// Догружаем фото при прокрутке
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && isReady) {
    isReady = false
    getPhotos()
  }
})

getPhotos()