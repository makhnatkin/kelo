/**
* @author tohachan
* @since 12.09.2012
*
* Расширяет jQuery свойствами с названием платформ
*
* Например: $.ipad вернет true если скрипт запустить на ipad
*/
(function($, window) {

	var platforms = [
		'linux',
		'mac',
		'win',
		'solaris',
		'unix',
		'ipad',
		'iphone',
		'ipad'
	];

	for (var i = 0; i < platforms.length; i++) {
		$[platforms[i]] = navigator && navigator.platform && navigator.platform.toLowerCase().indexOf( platforms[i] ) !== -1;
	}

}) (jQuery, window);

/**
* Функция, которая производит проверку на определенный-браузер/ОС и т.п.
* Если нужна какая-то новая проверка - дописываем новый case и передаем его имя в check.
* @since 12.08.12 13:19
* @author a.gugiev
*
* @return boolean Если проверка прошла успешно - true. Если же браузер/ОС у пользователя отличается, или такой проверки нету - false.
*/
function browserIs(check) {
//TODO: добавить определение других браузеров и ОС

	switch (check) {
		case 'ie':
			return navigator.userAgent.indexOf('MSIE') != -1;
		case 'safari':
			return navigator.userAgent.indexOf('Safari') > -1  && navigator.userAgent.indexOf('Chrome') == -1;
		case 'chrome':
			return navigator.userAgent.indexOf('Chrome') != -1;
		case 'firefox':
			return navigator.userAgent.indexOf('Firefox') != -1;
		case 'webkit':
			return navigator.userAgent.indexOf('WebKit') != -1;
		case 'opera':
			return navigator.userAgent.indexOf('Opera') != -1;
		case 'apple-mobile':
			return navigator.userAgent.match(/iPad|iPhone|iPod/i) != null;
		default:
		return false;
	}
}

/**
* Create jQuery plugin from class
* @param {function} Class
*/
function createjQueryPlugin(Class, name) {

	var className = Class.toString().match(/^function ([^(]+)/)[1],
		pluginName = className.slice(0,1).toLowerCase() + className.slice(1),
		dataName = name || pluginName;

	$.fn[pluginName] = function(options) {
		var args;
		args = Array.prototype.slice.call(arguments, 1);

		return this.each(function() {
			var obj;

			obj = $(this).data( dataName );

			if (!(obj instanceof Class)) {
				obj = new Class( $(this), options );
				$(this).data(dataName, obj);
			}

			if ( obj[options] !== undefined ) {
				return obj[options].apply(obj, args);
			}

			return obj;
		});
	}
}

(function(window, $) {
	/*
	# Класс диалоговой фоторамы
	# @class
	*/

	var PhotoViewer;
	PhotoViewer = (function() {

		/*
		# @param {jQuery} $node jQuery объект
		# @constructor
		*/
		function PhotoViewer($node, options) {
			var self;
			self = this;
			this.options = $.extend(true, {
				selectors: {
					link: '.gallery__link',
					image: '.gallery__preview-image'
				},
				fotoramaOptions: {
					transition: 'fade',
					transitionDuration: 120,
					arrows: false,
					thumbBorderColor: '#7ab800 #00eb89 #00b66f',
					hideNavIfFullscreen: false,
					shadows: false,
					fullscreenIcon: true,
					zoomToFit: false
				}
			}, options);

			if (!$node && !$node.size()) {
				console.error('incorrect $node in PhotoViewer.constructor');
				return;
			}

			this.$gallery = $node;
			this._createImagesUrls();
			this._preloadImages();
			this._createModal();
			this.showModal();
			self.currentImage = 0;
			this.appendImage(self.currentImage);
			self.$modal.on('click', function() {
				self.currentImage++;
				if (self.currentImage == self.fullImagesUrls.length) {
					self.currentImage = 0;
				}
				self.nextImage(self.currentImage);
			});
		}


		PhotoViewer.prototype._createImagesUrls = function() {
			self = this;
			self.fullImagesUrls = [];
			console.log(self.$gallery);
			self.$gallery.find(self.options.selectors.link).each(function() {
				self.fullImagesUrls.push($(this).attr('href'));
			});
		}


		PhotoViewer.prototype._preloadImages = function() {
			self = this;
			$(window).load(function() {
				$(self.fullImagesUrls).each(function() {
       				$('<img/>')[0].src = this;
    			});
			});			
		}


		/*
		# Инициализация фоторамы
		*/
		PhotoViewer.prototype._createModal = function() {
			var 
				$body,
				$modalBackground,
				$ajaxLoader,
				self;
	
			self = this;
			$body = $(document.body)
			$ajaxLoader = $('<div>').addClass('viewer__loader');
			$modalBackground = $('<div>').addClass('viewer');
			$modalBackground.append($ajaxLoader);
			$body.addClass('viewer_blocker').append($modalBackground);
			return self.$modal = $modalBackground;
		};

		/*
		# Инициализация фоторамы
		*/
		PhotoViewer.prototype.showModal = function() {
			var self;
	
			self = this;
			self.$modal.fadeIn('fast');
		};

		/*
		# Инициализация фоторамы
		*/
		PhotoViewer.prototype.appendImage = function(imageNumber) {
			var 
				$imageWrapper,
				$currentImage,
				self;
	
			self = this;
			$imageWrapper = $('<div>').addClass('viewer__wrapper');
			$currentImage = $('<img>')
				.addClass('viewer__image')
				.attr('src', self.fullImagesUrls[imageNumber]);
			$imageWrapper.append($currentImage);
			self.$modal.append($imageWrapper);
		};

		/*
		# Инициализация фоторамы
		*/
		PhotoViewer.prototype.nextImage = function(imageNumber) {
			var 
				$currentImage,
				self;
	
			self = this;
			$currentImage = $('.viewer__image')
			$currentImage.attr('src', self.fullImagesUrls[imageNumber]);
		};


/*
# Инициализация фоторамы
*/
PhotoViewer.prototype._initHiddenContainer = function($fotorama) {
var $hiddenContainer, $links, $linksClone, number, self;
self = this;
$fotorama.addClass('b-fotorama');
$links = $(self.options.selectors.imageLinks, $fotorama);
$links = $links.filter(self.options.selectors.link);
number = 0;
$links.each(function() {
return $(this).addClass(self.options.selectors.image).data('fotorama-number', ++number);
});
$linksClone = $links.clone().empty().append('<img />');
$hiddenContainer = $('<div>');
$hiddenContainer.addClass('b-fotorama-lightbox').hide().append($linksClone).insertAfter($fotorama);
$fotorama.data('fotorama-container', $hiddenContainer);
return self.fotoramaContainer = $hiddenContainer;
};

/*
# Навешивание событий
*/
PhotoViewer.prototype._bindEvents = function() {
var self,
_this = this;
self = this;
return this.$fotoramaArea.on('click', '.j-file-link', function(event) {
var number;
_this.$slide = $(event.target);
_this.$fotorama = _this.$slide.closest(_this.options.selectors.fotorama);
_this.fotoramaContainer = _this.$fotorama.data('fotorama-container');
if (!_this.fotoramaContainer) {
_this._initHiddenContainer(_this.$fotorama);
}
if (!(event.ctrlKey || event.metaKey) && $(event.target).hasClass(self.options.selectors.image)) {
event.preventDefault();
_this.$fotorama.hide();
number = _this.$slide.data('fotorama-number');
return _this.fotoramaContainer.show().fotorama(self.options.fotoramaOptions).trigger('fullscreenopen').trigger('showimg', [number - 1, 0]);
}
});
};

return PhotoViewer;

})();
return createjQueryPlugin(PhotoViewer);
})(window, jQuery);
