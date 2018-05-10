/*jshint esversion: 6, browser: true, node: true*/
'use strict';
const tlComebackSettings = {
   lang: 'ru',
   mainColor: '#007082'
};

class Comebacker {

   constructor(settings) {
      this.set = settings;
   }

   setComeBackCSS() {
      const contrastTextColor = this.getContrast50(this.set.mainColor);
      const shadowColor = this.ColorLuminance(this.set.mainColor, -0.1);
      const css = `
.tl-comeback {
position: fixed;
top: 10%;
left: 0;
right: 0;
margin: auto;
max-width: 480px;
width: 90%;
background: #e3e3e3;
color: ${contrastTextColor};
padding: 20px;
text-align: center;
border-radius: 5px;
overflow: hidden;
-webkit-box-shadow: rgba(45, 45, 45, .05) 0 2px 2px, rgba(49, 49, 49, .05) 0 4px 4px, rgba(42, 42, 42, .05) 0 8px 8px, rgba(32, 32, 32, .05) 0 16px 16px, rgba(49, 49, 49, .05) 0 32px 32px, rgba(35, 35, 35, .05) 0 64px 64px;
box-shadow: rgba(45, 45, 45, .05) 0 2px 2px, rgba(49, 49, 49, .05) 0 4px 4px, rgba(42, 42, 42, .05) 0 8px 8px, rgba(32, 32, 32, .05) 0 16px 16px, rgba(49, 49, 49, .05) 0 32px 32px, rgba(35, 35, 35, .05) 0 64px 64px;
}

.tl-comeback__form .input-wrapper {
position: relative;
margin-bottom: 20px;
}

.tl-comeback__form .form-head {
background-color: ${this.set.mainColor};
padding: 30px 20px;
margin: -20px;
margin-bottom: 30px;
text-transform: uppercase;
font-family: Arial, Helvetica, sans-serif;
font-weight: bold;
font-size: 20px;
position: relative;
overflow: hidden;
}

.tl-comeback__form .form-head::after {
content: '';
display: block;
left: 0;
right: 0;
top: -75px;
bottom: 0;
position: absolute;
background: radial-gradient(ellipse at center, rgba(255, 255, 255, .4) 0%, rgba(255, 255, 255, 0) 100%);
}

.tl-comeback__form .input {
width: 100%;
max-width: 100%;
-webkit-box-sizing: border-box;
box-sizing: border-box;
height: 40px;
font: inherit;
padding-left: 10px;
border-radius: 5px;
border: 1px solid white;
outline: none;
color: black;
}

.tl-comeback__form .input--text {
min-width: 100%;
height: 100px;
max-height: 300px;
padding: 10px;
color: black;
}

.tl-comeback__form .submit {
height: 60px;
border: none;
outline: none;
background: ${this.ColorLuminance(this.set.mainColor, 0.5)};
color: inherit;
text-transform: uppercase;
padding: 0 20px;
width: 100%;
border-radius: 5px;
font-size: 26px;
letter-spacing: 2px;
-webkit-box-shadow: 0 3px ${shadowColor};
box-shadow: 0 3px ${shadowColor};
cursor: pointer;
-webkit-transition: all .3s;
transition: all .3s
}

.tl-comeback__form .submit:hover {
background: ${this.ColorLuminance(this.set.mainColor, 0.8)};
}

.tl-overlay {
display: none;
opacity: 0;
position: fixed;
top: 0;
bottom: 0;
left: 0;
right: 0;
background: rgba(0, 0, 0, .3)
}
.tl-overlay.is-open{
z-index: 1000;
display: block;
}

.tl-comeback__close{
position: absolute;
top: 10px;
right: 10px;
z-index: 10;
cursor: pointer;
}

.tl-comeback__close::after{
content: "\\00D7";
font-size: 25px;
cursor: pointer;
}
body.no-scroll{
position: fixed;
}`;
      const styles = document.createElement('style');
      styles.innerHTML = css;
      document.head.appendChild(styles);
   }

   getContrast50(hex) {
      return (hex.replace('#', '0x') > 0xffffff / 2) ? 'black' : 'white';
   }

   ColorLuminance(hex, lum) {
      // validate hex string
      hex = String(hex).replace(/[^0-9a-f]/gi, '');
      if (hex.length < 6) {
         hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }
      lum = lum || 0;
      // convert to decimal and change luminosity
      let rgb = '#',
         c = void 0,
         i = void 0;
      for (i = 0; i < 3; i++) {
         c = parseInt(hex.substr(i * 2, 2), 16);
         c = Math.round(Math.min(Math.max(0, c + c * lum), 255)).toString(16);
         rgb += ('00' + c).substr(c.length);
      }
      return rgb;
   }

   createComeBackForm() {
      const popupTranslates = {
            'ru': {
               'title': 'СВЯЖИТЕСЬ С НАМИ!',
               'name': 'Ваше имя',
               'phone': 'Телефон',
               'message': 'Сообщение',
               'submit': 'Отправить'
            }
         },
         popupText = popupTranslates[this.set.lang];
      let html = `<div class="tl-comeback">
<form action="/" class="tl-comeback__form" method="post">
<div class="tl-comeback__close" id="tl-comeback__close"></div>
<h4 class="form-head">${popupText.title}</h4>
<div class="input-wrapper">
<input type="text" name="name" class="input" required placeholder="${popupText.name}">
</div>
<div class="input-wrapper">
<input type="tel" name="phone" class="input" required placeholder="${popupText.phone}">
</div>
<div class="input-wrapper">
<textarea type="textaream" name="message" class="input input--text" placeholder="${popupText.message}"></textarea>
</div>
<button type="submit" class="submit">${popupText.submit}</button>
</form>
</div>`;

      let comebackNode = document.createElement('div');
      comebackNode.classList.add('tl-overlay');
      comebackNode.id = 'tl-overlay';
      comebackNode.innerHTML = html;
      document.body.appendChild(comebackNode);
   }

   fadeIn(el, time) {
      el.style.opacity = 0;
      let last = +new Date();
      let tick = () => {
         el.style.opacity = +el.style.opacity + (new Date() - last) / time;
         last = +new Date();

         if (+el.style.opacity < 1) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
         }
      };
      tick();
   }

   fadeOut(el, time) {
      let last = +new Date();
      let tick = () => {
         el.style.opacity = +el.style.opacity - (new Date() - last) / time;
         last = +new Date();

         if (+el.style.opacity > 0) {
            (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
         }
      };
      tick();
   }

   screenWidth() {
      return Math.max(window.innerWidth, document.documentElement.clientWidth);
   }

   isScreenBigger(breakpoint) {
      return this.screenWidth() > breakpoint ? true : false;
   }

   hideComeBack(comebackSelector) {
      this.fadeOut(comebackSelector, 400);
      if (!this.isScreenBigger(767)) {
         document.body.classList.remove('no-scroll');
      }
      setTimeout(function () {
         comebackSelector.classList.remove('is-open');
      }, 400);
   }
   showComeBack(comebackSelector) {
      if (!this.isScreenBigger(767)) {
         document.body.classList.add('no-scroll');
      }
      this.fadeIn(comebackSelector, 400);
      comebackSelector.classList.add('is-open');
   }

   addComeBackToDocument() {
      this.setComeBackCSS();
      this.createComeBackForm();
   }
}

const comeback = new Comebacker(tlComebackSettings);

comeback.addComeBackToDocument();

const tlOverlay = document.getElementById('tl-overlay');
let comebacker = true;

try {
   for (let times = 0; 100 > times; ++times) history.pushState({}, "", window.location.href);
   window.onpopstate = function (t) {
      comeback.showComeBack(tlOverlay);
   };
} catch (error) {}

document.addEventListener('click', (e) => {
   let target = e.target,
      targetID = target.getAttribute('id');
   if (targetID == 'tl-comeback__close' || targetID == 'tl-overlay') comeback.hideComeBack(tlOverlay);
});

window.addEventListener("beforeunload", function (e) {
   e.preventDefault();
   e.returnValue = false;
   comeback.showComeBack(tlOverlay);
});

window.addEventListener('mouseout', function (event) {
   if (event.pageY - window.scrollY < 1 && comebacker) {
      comebacker = false;
      setTimeout(function () {
         comebacker = true;
      }, 10000);
      comeback.showComeBack(tlOverlay);
      return false;
   }
});