/* app.js
 * version 1.0
 * comments on russian, sorry ¯\_(ツ)_/¯ 
 */

// Основное полотно игры.
var app = document.getElementById('app');
// HTML блок 'карты', %image% заменяется на картинку.
var tmlp = '<div class="fc"><div class="flipper"><div class="front" style="background: url(\'images/empty.png\') center center no-repeat;"></div><div class="back" style="background: url(\'%image%\') center center no-repeat;"></div></div></div>';
// HTML блок модального диалога при победе игрока.
var modalwon = '<div id="won"><h3>You won, congratulations!</h3><strong onclick="init()">Restart</strong></div>';
// Массив картинок для карточек (увеличить вдвое, т.к. каждая карта имеет пару).
var cards = [
    'images/gemblue.png',
    'images/gemgreen.png',
    'images/gemorange.png',
    'images/heart.png',
    'images/rock.png',
    'images/star.png',

    'images/gemblue.png',
    'images/gemgreen.png',
    'images/gemorange.png',
    'images/heart.png',
    'images/rock.png',
    'images/star.png'
];
// Стек открытых карточек.
var ocs = [];
// Счетчик текущего игрового этапа.
var currentStageCounter = 0;

/**
 */
function openCard(e, opening) {
    // Поудалять из стека и закрыть текущую карточку и предыдущие если они есть.
    if (!opening) {
        e.setAttribute('class', 'fc');
        if (ocs.length>0) ocs.shift().setAttribute('class', 'fc');
        if (ocs.length>0) ocs.shift().setAttribute('class', 'fc');
        if (ocs.length>0) ocs.shift().setAttribute('class', 'fc');
        // console.log('open', ocs.length);
        return;
    }

    // открыть карточку
    e.setAttribute('class', 'fc flip');
    var l = ocs.push(e);
    // console.log('open', ocs.length);

    // Если в стеке две карточки то сравнить их,
    // если они совпадают, то деактивировать их.
    if (l==2) {
        // картинка предыдущей и текущей карточек.
        var curImage = ocs[1].getElementsByClassName('back')[0].style.backgroundImage;
        var prvImage = ocs[0].getElementsByClassName('back')[0].style.backgroundImage;

        if (curImage===prvImage) {
            var cur = ocs.shift();
            var prv = ocs.shift();
            
            // сначала деактивировать (set флаг диактивации)
            cur.setAttribute('class', 'fc flip rem');
            prv.setAttribute('class', 'fc flip rem');

            currentStageCounter -= 2;
            // console.log(currentStageCounter);

            // потом довыполнить анимацию деактивации (set флаг анимации)
            // p.s. если делать вместе с деактивацией то будет наслоение.
            setTimeout(function() {
                cur.setAttribute('class', 'fc disabled rem');
                prv.setAttribute('class', 'fc disabled rem');

                // ...
                if (currentStageCounter < 1) {
                    setTimeout(function() { app.innerHTML = modalwon; }, 500);
                }
            }, 600);
        }
    }

    // Если в стеке карточек больше двух, то поудалять  
    // их из стека и позакрывать их все кроме текущей.
    if (l==3) {
        ocs.shift().setAttribute('class', 'fc');
        ocs.shift().setAttribute('class', 'fc');
    }
}

/**
 */
function init() {
	// Очистить основное полотно игры от предыдущих игр.
    app.innerHTML = '';

    // Стек открытых карточек
    ocs = [];

    // currentStageCounter
    currentStageCounter = cards.length;

    // Перемешать массив картинок.
    for(var j, x, i = cards.length; i; j = parseInt(Math.random() * i), x = cards[--i], cards[i] = cards[j], cards[j] = x);

    // Добавить картинки в виде карточек на полотно игры.
    for (var a=0; a<cards.length; a++) {
        app.innerHTML += tmlp.replace('%image%', cards[a]);
    }

    // Реализация клика по каждой карточке
    var list = document.getElementsByClassName('fc');
    for (i=0; i<list.length; i++) {
        list[i].addEventListener('click', function(e) {
            if (this.getAttribute('class').indexOf(' rem') >= 0) return;  // Не открывать карточку если она не активна.
            openCard(this, (this.getAttribute('class').indexOf(' flip') < 0 ? true : false));  // Если класса flip еще нет, от открытие карточки.
        });
    }
}

init();