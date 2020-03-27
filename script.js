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
  console.log(billCost);
  
  
  bill.style.position = "absolute";
  //разворачиваем купюры на 90 градусов, чтобы внести в купюроприемник
  bill.style.transform = "rotate(90deg)";
  
  //Ищем координаты наших купюр
  let billCoords = bill.getBoundingClientRect();
  //console.log(billCoords);
  //нам потребуются ширина и высота купюры
  let billWidth = billCoords.width;
  let billHeight = billCoords.height;
  console.log(billWidth, billHeight);
  
  console.log(event);
  //Положение нашего курсора на экране clientX и clientY
  console.log(event.clientX, event.clientY);
  
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
}  
  







