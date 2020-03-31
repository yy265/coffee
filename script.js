"use strict" /*включает строгий режим, в частности не позволяет объявлять переменные без ключевого слова let (var)*/
//alert("Скрипт подключен!")

let balance = document.querySelector(".balance"); 
let displayText = document.querySelector(".display-text"); 
//создадим переменную статус, для отслживания состояния кофемашины
//изначальное состояние-ожидание заказа. Еще состояния "cooking" и "ready"
let coffeeStatus = "waiting";

//Вешаем событие на нажатие на чашку
//первый вариант: 
/*при этом скобки послефункции takeCoffee не указываем, иначе она тут же вызовется, а у нас она должна вызываться по клику*/
//coffeeCup.onclick = takeCoffee;
//или первый вариант со скобками в таком виде
/*coffeeCup.onclick = function() {
  takeCoffee();
}*/
//второй вариант:
//coffeeCup.addEventListener("click", takeCoffee, par1, par2);
//или
/*
coffeeCup.addEventListener("click", () => {
takeCoffee
});
*/

//coffeeCup.onclick = takeCoffee; //первый вариант

//Создаем глобальные переменные для заполнения прогрессбара и появления кружки в процессе приготовления кофе
let progressBar = document.querySelector(".progress-bar");
let coffeeCup = document.querySelector(".coffee-cup img");

coffeeCup.onclick = takeCoffee; //первый вариант

function buyCoffee(name, cost, elem) {
  //проверяем coffeeStatus чтобы во время приготовления нельзя было заказать новый кофе
  if (coffeeStatus != "waiting") {
    return;
  }
  //проверка alert(balance.value);
  //проверка alert(`Вы заказали ${name}. Цена: ${cost}`);
  let afterBuyValue = +balance.value - cost;
  //проверяем или меньше нуля или не число
  if ( (balance.value - cost) < 0 || Number.isNaN(afterBuyValue)) {
    //alert("Недостаточно средств!"); - убираем, уже не нужно
    //делаем более наглядный вывод недостатка средств
    balance.style.border = "2px solid red";
    //background-сolor заменяется на backgroundColor
    balance.style.backgroundColor = "pink";
    changeDisplayText("Недостаточно средств");
    return;
  }
  //Если денег достаточно, то все изменения возвращаем в исходное состояние
  balance.style.border = "none";
  balance.style.backgroundColor = "white";
  //ограничим двумя знаками после запятой
  balance.value = (+balance.value - cost).toFixed(2);
  //alert("Ваш " + name + " готовится!");
  cookCoffee(name, elem);
  
}
//Пишем функцию для изменения текста внутри нашего дисплея
function changeDisplayText(text) {
  displayText.innerText = "<span>"+text+"</span>";
  //если нужен не просто текст, а HTML-код, то используем .innerHTML
  displayText.innerHTML = "<span>"+text+"</span>";
}

//Функция "готовь кофе"
function cookCoffee(name, elem) {
  coffeeStatus = "cooking";
  changeDisplayText("Ваш " + name + " готовится!");
  
  //ищем img только внутри нашего elem
  let cupImg = elem.querySelector("img");
  console.log(cupImg); //при нажатии на капучино выводится img/cappuccino.png
  // В консоли отобразится переданный элемент, напр.Эспрессо
  //Надо вытащить src- путь к нашему изображению
  let cupSrc = cupImg.getAttribute ("src");
  //потом надо применить этот атрибут к нашей кружке:
  coffeeCup.setAttribute("src", cupSrc);
  //console.log(elem); 
  //Задаем первоначальную видимость кружки (пока не видна)
  coffeeCup.style.opacity = "0%";
  //удаляем d-none чтобы можно было работать с кружкой
  coffeeCup.classList.remove("d-none");
  
  //Далее заполняем наш прогресс-бар и делаем кружку видимой-невидимой
  //Увидим img/americano.png в консоли т.к. именно это картинка там лежит под прогрессбаром
  //console.log(coffeeCup);
  //Учимся работать с классами:
  //coffeeСup.classList.add(""); //Добавить класс
  //coffeeСup.classList.remove(""); //Убрать класс
  //coffeeСup.classList.toggle(""); //Вкл/Выкл класс
  //coffeeСup.classList.contains("d-none"); //Содержит ли?
  
  let readyPercent = 0;
  let cookingInterval = setInterval(() => {
    readyPercent++
    progressBar.style.width = readyPercent + "%";
    //Делаем видимость кружки в соответствии с процентами готовности
    coffeeCup.style.opacity = readyPercent + "%";
    if (readyPercent == 100) {
      coffeeStatus = "ready";
      changeDisplayText("Ваш " + name + " готов");
      //чтобы по окончании готовки кофе при наведении курсора на кружки курсор менялся на палец
      coffeeCup.style.cursor = "pointer";
      clearInterval(cookingInterval);
    }
  }, 100);
}

//Функция "Забрать кофе"
function takeCoffee() {
  if (coffeeStatus != "ready") {
    return;
  }
  //Возвращаем статус в "waiting"
  coffeeStatus = "waiting";
  //Убираем изображение чашки
  coffeeCup.classList.add("d-none");
  coffeeCup.style.cursor = "auto";
  progressBar.style.width = "0%";
  changeDisplayText("Выберите кофе");
} 

//-----------------------------------Drag'n'Drop---------------------------

let bills = document.querySelectorAll(".wallet img");

for(let i = 0; i < bills.length; i++) {
  bills[i].onmousedown = takeMoney;
  //bills[i].onmousedown = () => {takeMoney()};
}

function takeMoney(event) {
  //Отключаем встроенные функции. чтобы не тянулся "призрак" за купюрой
  event.preventDefault();
  
  let bill = this;
  let billCost = bill.getAttribute("cost");
  //console.log("Вы нажали на купюру")
  //console.log(billCost);
  
  
  bill.style.position = "absolute";
  //разворачиваем купюры на 90 градусов, чтобы внести в купюроприемник
  bill.style.transform = "rotate(90deg)";
  
  //Ищем координаты наших купюр
  let billCoords = bill.getBoundingClientRect();
  //console.log(billCoords);
  //нам потребуются ширина и высота купюры
  let billWidth = billCoords.width;
  let billHeight = billCoords.height;
  //console.log(billWidth, billHeight);
  
  //console.log(event);
  //Положение нашего курсора на экране clientX и clientY
  //console.log(event.clientX, event.clientY);
  
  //Изменим положение нашей купюры - при нажатии помещаем ее в центр курсора
  /*
  bill.style.top = event.clientY + "px";
  bill.style.left = event.clientX + "px";
  */
  //Чтобы сделать купюру по центру курсора купюру надо сдвинуть на половину ее ширины и высоты
  bill.style.top = event.clientY - billWidth/2 + "px";
  bill.style.left = event.clientX  - billHeight/2 + "px";
  
  //Надо отловить событие движения купюры по экрану
  //и отловить надо движение курсора по экрану, а не внутри купюры
  //событие должно появляться внутри функции и должно видеть bill, поэтому расположим внутри функции
  window.onmousemove = (event) => {
    //console.log(event.clientX, event.clientY);
    //каждый раз когда двигается -обновляются координаты
    bill.style.top = event.clientY - billWidth/2 + "px";
    bill.style.left = event.clientX  - billHeight/2 + "px";
  };
  
  //Действие на отпускание купюры
  bill.onmouseup = dropMoney;
  
}

function dropMoney() {
  window.onmousemove = null;
  //inAtm(this); //this вернет купюру, которую мы передаем в купюроприемник, т.к. dropMoney подвешена на: bill.onmouseup = dropMoney;
  let bill = this;
  let billCost = bill.getAttribute("cost");
  //если купюра в купюроприемнике, то увеличиваем наш баланс
  if (inAtm(this)) {
    balance.value = +balance.value + +billCost;
    //и после увеличения баланса удаляем купюру с помощью .remove-метод,который совсем убирает объект со страницы, а d-none просто прячет-делает невидимым
    bill.remove();
  }
}  
  
function inAtm(bill) {
  let billCoord = bill.getBoundingClientRect(); //координаты купюры
  let atm = document.querySelector(".atm"); //ищем atm в глобальном document
  let atmCoord = atm.getBoundingClientRect(); //координаты нашего atm (приемника купюр)
  //ищем координаты левого верхнего края купюры
  let billLeftTopCornerX = billCoord.x;
  let billLeftTopCornerY = billCoord.y;
  //ищем координаты правого верхнего края купюры
  let billRightTopCornerX = billCoord.x + billCoord.width;
  let billRightTopCornerY = billCoord.y;
  
  //ищем координаты левого верхнего края нашего atm
  let atmLeftTopCornerX = atmCoord.x;
  let atmLeftTopCornerY = atmCoord.y;
  //ищем координаты правого верхнего края нашего atm
  let atmRightTopCornerX = atmCoord.x + atmCoord.width;
  let atmRightTopCornerY = atmCoord.y;
  //ищем координаты левого нижнего края нашего atm (его верхней трети-куда вставляют купюру)
  let atmLeftBottomCornerX = atmCoord.x;
  let atmLeftBottomCornerY = atmCoord.y + atmCoord.height/3;
  //ищем координаты правого нижнего края нашего atm (его верхней трети-куда вставляют купюру)
  let atmRightBottomCornerX = atmCoord.x + atmCoord.width;
  let atmRightBottomCornerY = atmCoord.y + atmCoord.height/3;
  
  
  //console.log([billCoord, atmCoord]);
  //console.log([billLeftTopCornerX, billLeftTopCornerY] , [billRightTopCornerX, billRightTopCornerY]);
  /*
  console.log(
              [
                [billLeftTopCornerX, billLeftTopCornerY] , [billRightTopCornerX, billRightTopCornerY]
              ],
              [
                [atmLeftTopCornerX, atmLeftTopCornerY] , [atmRightTopCornerX, atmRightTopCornerY],
                [atmLeftBottomCornerX, atmLeftBottomCornerY] , [atmRightBottomCornerX, atmRightBottomCornerY],
              ]
              );
  */ 
  //Проверяем координаты купюры на попадание в координаты верхней трети купюроприемника
  if (
    billLeftTopCornerX >= atmLeftTopCornerX
    && billLeftTopCornerY >= atmLeftTopCornerY
    && billRightTopCornerX <= atmRightTopCornerX
    && billRightTopCornerY >= atmRightTopCornerY
    //проверяем координаты снизу
    && billLeftTopCornerX >= atmLeftBottomCornerX
    && billLeftTopCornerY <= atmLeftBottomCornerY
    ) {
      //console.log(true);
      return true;
    } else {
      //console.log(false);
      return false;
    }

}

/*---------------------------Сдача----------------*/
//будет вываливать монетки в нижний квадрат
let changeBtn = document.querySelector(".change");
//повесим на переменную событие
changeBtn.onclick = takeChange;



function takeChange() {
  //alert("Сдача!");
  //Напишем логику выдачи сдачи
  //tossCoin("10");
  //проверяем балансе, если денег нет, то и сдачи нет
  
  if (balance.value <= 0) {
    changeBtn.onclick = takeChange; // возвращаем событие на место
    //Вешаем звук на выпадение монеток-один раз, а не на каждую монету
    
    /* Перенсли это вниз- в конец function tossCoin
    let coinSound = new Audio("sound/coindrop.mp3");
    
    // можно и так: 
    //let coinSound = new Audio();
    //coinSound.src = "sound/coindrop.mp3";
    
    coinSound.play();
    */
    return;
  } 
  changeBtn.onclick = null; /*снимаем событие, т.к. если нажать на сдачу, когда падают монетки, то каждое нажатие будет стоить автомату 10 руб и в сдаче будет на столько же монеток больше и получится баланс -70 например*/
  
  /* Первоначальный вариант - без задержки setTimeout
  if (balance.value - 10 >= 0) {
    tossCoin("10");
    balance.value -= 10;
    return takeChange(); //вызываем саму себя, чтобы выдать ысе монетки по 10руб.
    // если return takeChange; -без скобок, товыдает по одной монете
  } else if (balance.value - 5 >= 0) {
    tossCoin("5");
    balance.value -= 5;
    return takeChange();
  } else if (balance.value - 2 >= 0) {
    tossCoin("2");
    balance.value -= 2;
    return takeChange();
  } else if (balance.value - 1 >= 0) {
    tossCoin("1");
    balance.value -= 1;
    return takeChange();
  }
  */
  // Вводим задержку с помощью setTimeout в 300мс
  if (balance.value - 10 >= 0) {
    setTimeout(() => {
      tossCoin("10");
      balance.value -= 10;
      return takeChange(); //вызываем саму себя, чтобы выдать ысе монетки по 10руб.
    // если return takeChange; -без скобок, товыдает по одной монете
    }, 300);
  } else if (balance.value - 5 >= 0) {
    setTimeout(() => {
      tossCoin("5");
      balance.value -= 5;
      return takeChange();
    }, 300);  
  } else if (balance.value - 2 >= 0) {
    setTimeout(() => {
      tossCoin("2");
      balance.value -= 2;
      return takeChange();
    }, 300);
  } else if (balance.value - 1 >= 0) {
    setTimeout(() => {
      tossCoin("1");
      balance.value -= 1;
      return takeChange();
    }, 300);  
  }
}
 
function tossCoin(cost) {
  let changeContainer = document.querySelector(".change-box");
  let changeContainerCoords = changeContainer.getBoundingClientRect();
  //alert(cost);
  //console.log(changeContainerCoords);
  //переменная с адресом к изображению монеты
  let coinSrc = "";
  
  switch (cost) {
    case "10":
      coinSrc = "img/10rub.png";
      break;
    case "5":
      coinSrc = "img/5rub.png";
      break;
    case "2":
      coinSrc = "img/2rub.png";
      break;
    case "1":
      coinSrc = "img/1rub.png";
      break;
  }
  //console.log(coinSrc);
  /*
  // Воспользуемся способом с innerHTML с обратными кавычками, вписывая прямо в него (в changeBox)
  changeContainer.innerHTML +=`
    <img src="${coinSrc}" style="height: 50px">
  `
  */
  //Второй способ, создавая код HTML с помощью js
  let coin = document.createElement("img");
  coin.setAttribute("src", coinSrc);
  coin.style.height = "50px";
  coin.style.coursor = "pointer";
  coin.style.display = "inline-block"; //сделали строчно-блочным элементом, чтобы появились ширина-высота
  coin.style.position = "absolute";
  coin.style.userSelect = "none";
  
  changeContainer.append(coin); //Прикрепить после внутри элемента
  /*
  changeContainer.prepend(coin); //Прикрепить до внутри элемента
  
  changeContainer.after(coin); //После контейнера
  changeContainer.before(coin); //Перед контейнером
  
  changeContainer.replace(coin); //Заменяем элементы
  */
  
  // +3  и - 53: чтобы монеты не залезали на границы change-box
  coin.style.top = 3 + Math.round(Math.random() * (changeContainerCoords.height - 53)) + "px";
  coin.style.left = 3 + Math.round(Math.random() * (changeContainerCoords.width - 53)) + "px";
  
  // Будем удалять монетки, для этого надо повесить событие на монетку
  coin.onclick = () => coin.remove();
  
  //перенесли вниз
  let coinSound = new Audio("sound/coindrop.mp3");
    // можно и так: 
    /*
    let coinSound = new Audio();
    coinSound.src = "sound/coindrop.mp3";
    */
    coinSound.play();
  
}


