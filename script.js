"use strict" /*включает строгий режим, в частности не позволяет объявлять переменные без ключевого слова let (var)*/
//alert("Скрипт подключен!")

let balance = document.querySelector(".balance"); 

function buyCoffee(name, cost) {
  //проверка alert(balance.value);
  //проверка alert(`Вы заказали ${name}. Цена: ${cost}`);
  let afterBuyValue = +balance.value - cost;
  //проверяем или меньше нуля или не число
  if ( (balance.value - cost) < 0 || Number.isNaN(afterBuyValue)) {
    alert("Недостаточно средств!");
    return;
  }
  //ограничим двумя знаками после запятой
  balance.value = (+balance.value - cost).toFixed(2);
  alert("Ваш " + name + " готовится!");
  
}