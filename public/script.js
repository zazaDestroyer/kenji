let lastClickedBus = null;
let clickTimer = null;

// Отправка геолокации на сервер
function requestLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        console.log('Широта:', lat, 'Долгота:', lon);

        fetch('/location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude: lat, longitude: lon })
        })
        .then(res => res.text())
        .then(data => console.log('Сервер ответил:', data))
        .catch(err => console.error('Ошибка при отправке координат:', err));
      },
      (error) => {
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert("Вы отказали в разрешении на GPS");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Информация о местоположении недоступна");
            break;
          case error.TIMEOUT:
            alert("Превышено время ожидания местоположения");
            break;
          default:
            alert("Ошибка при получении геолокации");
        }
      }
    );
  } else {
    alert("Ваш браузер не поддерживает GPS/геолокацию");
  }
}

function speak(text){
  if('speechSynthesis' in window){
    const u = new SpeechSynthesisUtterance(text);
    u.lang='ru-RU';
    speechSynthesis.speak(u);
  }
}

function busClick(num, btn){
  if(lastClickedBus !== num){
    lastClickedBus = num;
    speak('Автобус ' + num);
    btn.style.background = '#ffeeba';

    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      lastClickedBus = null;
      btn.style.background = '';
    }, 2000);
    return;
  }

  lastClickedBus = null;
  btn.style.background = '';
  localStorage.setItem('selectedBus', num);
  window.location.href = 'wait.html';
}

// wait.html
let backStep = 0;

window.onload = function(){
  const bus = localStorage.getItem('selectedBus');
  if(bus){
    const title = document.getElementById('selectedBusTitle');
    if(title) {
      title.innerText = 'Автобус ' + bus;
      speak('Вы выбрали автобус ' + bus + '. Включите переключатель, если ждёте его');
    }
  }
}

function toggleChanged(){
  const t = document.getElementById('waitToggle');
  const s = document.getElementById('statusText');
  if(t.checked){
    requestLocation();
    s.innerText='Я жду автобус';
    speak('Вы отмечены как ожидающий автобус');
  } else {
    s.innerText='Не жду';
    speak('Вы отменили ожидание автобуса');
  }
}

function backAreaClick(){
  const area = document.getElementById('backArea');

  if(backStep === 0){
    area.innerText = 'Вы хотите пойти назад? Нажмите ещё раз';
    speak('Вы хотите пойти назад? Нажмите ещё раз, если да');
    backStep = 1;
    return;
  }

  window.location.href = 'buslist.html';
}
