function Slider(selectorOrElement, autoInit) {
    var self = this;
    var currentSlide = 0;
    var timer;

    if (typeof selectorOrElement === 'string') {
        this.handler = document.querySelector(selectorOrElement);
        if (this.handler === null) {
            throw new Error('Element doesn\'t exists');
        }
    } else if (selectorOrElement instanceof HTMLElement) {
        this.handler = selectorOrElement;
    } else {
        throw new ReferenceError('Invalid argument. Must be CSS selector or HTML Element');
    }

    // Init getters
    Object.defineProperty(this, 'slides', {
        get: function () {
            return self.handler.querySelectorAll('.gallery__slide');
        }
    });

    Object.defineProperty(this, 'container', {
        get: function () {
            return self.handler.querySelector('.gallery__container');
        }
    });

    Object.defineProperty(this, 'width', {
        get: function () {
            return self.handler.offsetWidth;
        }
    });

    Object.defineProperty(this, 'currentSlide', {
        get: function () {
            return currentSlide;
        },
        set: function(value) {
            setSlide(value);
        }
    });




    this.init = function () {
       var htmlBuffer = this.handler.innerHTML.toString();
       this.handler.innerHTML =
           '<button class="gallery__ctrl gallery__backward">&lt;</button>' +
           '<div class="gallery__container">' +
           htmlBuffer +
           '</div>'+
           '<button class="gallery__ctrl gallery__forward">&gt;</button>';
       this.reload();
       window.addEventListener('resize', function() {
           self.reload();
       }, false);

        this.handler.querySelector('.gallery__backward').addEventListener('click', function() {
            self.backward();
        });

        this.handler.querySelector('.gallery__forward').addEventListener('click', function() {
            self.forward();
        });

        this.handler.addEventListener('mouseover', function() {
            self.timer.disable();
        });

        this.handler.addEventListener('mouseout', function() {
            self.timer.enable();
        });
    };

    this.reload = function() {
        this.container.style.width = (this.width * this.slides.length) + 'px';

        for(var i = 0; i < this.slides.length; i++) {
            this.slides[i].style.width = this.width + 'px';
        }

        setSlide(currentSlide);
    };

    this.forward = function() {
      if(this.currentSlide < (this.slides.length - 1)) {
          this.currentSlide++;
      } else {
          this.currentSlide = 0;
      }
    };

    this.backward = function() {
        if(this.currentSlide == 0) {
            this.currentSlide = this.slides.length - 1;
        } else {
            this.currentSlide--;
        }
    };

    this.timer = {
        context: null,
        enable: function() {
            this.context = setInterval(function() {
                self.forward();
            }, 1300);
        },
        disable: function() {
            clearInterval(this.context);
        }
    };

    function setSlide(slideNumber) {
        var slideId = parseInt(slideNumber);

        if(isNaN(slideId)) throw new ReferenceError('Argument is not a number');

        if(slideId >= self.slides.length) {
            throw new RangeError('Slide number is out of bounds');
        }
        var pos = (slideId * self.width) * -1;
        currentSlide = slideId;
        self.container.style.transform = 'translateX(' + pos + 'px)';
    }



    autoInit = autoInit || false;

    if (autoInit === true) this.init();
}
document.addEventListener('DOMContentLoaded', function () {
    var sliders = document.querySelectorAll('.gallery');
    for (var g = 0; g < sliders.length; g++) {
        sliders[g].slider = new Slider(sliders[g], true);
    }
}, false);