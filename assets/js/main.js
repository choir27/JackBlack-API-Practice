/*
	Lens by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

var main = (function($) { var _ = {

	/**
	 * Settings.
	 * @var {object}
	 */
	settings: {

		// Preload all images.
			preload: false,

		// Slide duration (must match "duration.slide" in _vars.scss).
			slideDuration: 500,

		// Layout duration (must match "duration.layout" in _vars.scss).
			layoutDuration: 750,

		// Thumbnails per "row" (must match "misc.thumbnails-per-row" in _vars.scss).
			thumbnailsPerRow: 2,

		// Side of main wrapper (must match "misc.main-side" in _vars.scss).
			mainSide: 'right'

	},

	/**
	 * Window.
	 * @var {jQuery}
	 */
	$window: null,

	/**
	 * Body.
	 * @var {jQuery}
	 */
	$body: null,

	/**
	 * Main wrapper.
	 * @var {jQuery}
	 */
	$main: null,

	/**
	 * Thumbnails.
	 * @var {jQuery}
	 */
	$thumbnails: null,

	/**
	 * Viewer.
	 * @var {jQuery}
	 */
	$viewer: null,

	/**
	 * Toggle.
	 * @var {jQuery}
	 */
	$toggle: null,

	/**
	 * Slides.
	 * @var {array}
	 */
	slides: [],

	/**
	 * Current slide index.
	 * @var {integer}
	 */
	current: null,

	/**
	 * Lock state.
	 * @var {bool}
	 */
	locked: false,

	/**
	 * Initialize properties.
	 */
	initProperties: function() {

		// Window, body.
			_.$window = $(window);
			_.$body = $('body');

		// Thumbnails.
			_.$thumbnails = $('#thumbnails');

		// Viewer.
			_.$viewer = $(
				'<div id="viewer">' +
					'<div class="inner">' +	
						'<div class="toggle"></div>' +
					'</div>' +
				'</div>'
			).appendTo(_.$body);

		// Nav.
			_.$navNext = _.$viewer.find('.nav-next');
			_.$navPrevious = _.$viewer.find('.nav-previous');

		// Main wrapper.
			_.$main = $('#main');

		// Toggle.
			$('<div class="toggle"></div>')
				.appendTo(_.$main);

			_.$toggle = $('.toggle');

	},

	/**
	 * Initialize events.
	 */
	initEvents: function() {

		// Window.

			// Remove is-preload-* classes on load.
				_.$window.on('load', function() {

					_.$body.removeClass('is-preload-0');

					window.setTimeout(function() {
						_.$body.removeClass('is-preload-1');
					}, 100);

					window.setTimeout(function() {
						_.$body.removeClass('is-preload-2');
					}, 100 + Math.max(_.settings.layoutDuration - 150, 0));

				});

			// Disable animations/transitions on resize.
				var resizeTimeout;

				_.$window.on('resize', function() {

					_.$body.addClass('is-preload-0');
					window.clearTimeout(resizeTimeout);

					resizeTimeout = window.setTimeout(function() {
						_.$body.removeClass('is-preload-0');
					}, 100);

				});

		// Viewer.

			// Hide main wrapper on tap (<= medium only).
				_.$viewer.on('touchend', function() {

					// if (breakpoints.active('<=medium'))
					// 	_.hide();

				});

			// Touch gestures.
				_.$viewer
					.on('touchstart', function(event) {

						// Record start position.
							_.$viewer.touchPosX = event.originalEvent.touches[0].pageX;
							_.$viewer.touchPosY = event.originalEvent.touches[0].pageY;

					})
					.on('touchmove', function(event) {

						// No start position recorded? Bail.
							if (_.$viewer.touchPosX === null
							||	_.$viewer.touchPosY === null)
								return;

						// Calculate stuff.
							var	diffX = _.$viewer.touchPosX - event.originalEvent.touches[0].pageX,
								diffY = _.$viewer.touchPosY - event.originalEvent.touches[0].pageY;
								boundary = 20,
								delta = 50;

						// Swipe left (next).
							if ( (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta) )
								_.next();

						// Swipe right (previous).
							else if ( (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta)) )
								_.previous();

						// Overscroll fix.
							var	th = _.$viewer.outerHeight(),
								ts = (_.$viewer.get(0).scrollHeight - _.$viewer.scrollTop());

							if ((_.$viewer.scrollTop() <= 0 && diffY < 0)
							|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

								event.preventDefault();
								event.stopPropagation();

							}

					});

		// Main.

			// Touch gestures.
				_.$main
					.on('touchstart', function(event) {

						// Bail on xsmall.
							// if (breakpoints.active('<=xsmall'))
							// 	return;

						// Record start position.
							_.$main.touchPosX = event.originalEvent.touches[0].pageX;
							_.$main.touchPosY = event.originalEvent.touches[0].pageY;

					})
					.on('touchmove', function(event) {

						// Bail on xsmall.
							// if (breakpoints.active('<=xsmall'))
							// 	return;

						// No start position recorded? Bail.
							if (_.$main.touchPosX === null
							||	_.$main.touchPosY === null)
								return;

						// Calculate stuff.
							var	diffX = _.$main.touchPosX - event.originalEvent.touches[0].pageX,
								diffY = _.$main.touchPosY - event.originalEvent.touches[0].pageY;
								boundary = 20,
								delta = 50,
								result = false;

						// Swipe to close.
							switch (_.settings.mainSide) {

								case 'left':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX > delta);
									break;

								case 'right':
									result = (diffY < boundary && diffY > (-1 * boundary)) && (diffX < (-1 * delta));
									break;

								default:
									break;

							}

							if (result)
								_.hide();

						// Overscroll fix.
							var	th = _.$main.outerHeight(),
								ts = (_.$main.get(0).scrollHeight - _.$main.scrollTop());

							if ((_.$main.scrollTop() <= 0 && diffY < 0)
							|| (ts > (th - 2) && ts < (th + 2) && diffY > 0)) {

								event.preventDefault();
								event.stopPropagation();

							}

					});
		// Toggle.
			_.$toggle.on('click', function() {
				_.toggle();
			});

			// Prevent event from bubbling up to "hide event on tap" event.
				_.$toggle.on('touchend', function(event) {
					event.stopPropagation();
				});

		// Nav.
			_.$navNext.on('click', function() {
				_.next();
			});

			_.$navPrevious.on('click', function() {
				_.previous();
			});

		// Keyboard shortcuts.

			// Ignore shortcuts within form elements.
				_.$body.on('keydown', 'input,select,textarea', function(event) {
					event.stopPropagation();
				});

			_.$window.on('keydown', function(event) {

				// Ignore if xsmall is active.
					// if (breakpoints.active('<=xsmall'))
					// 	return;

			

			});

	},

	/**
	 * Initialize viewer.
	 */
	initViewer: function() {

		// Bind thumbnail click event.
			_.$thumbnails
				.on('click', '.thumbnail', function(event) {

					var $this = $(this);

					// Stop other events.
						event.preventDefault();
						event.stopPropagation();

					// Locked? Blur.
						if (_.locked)
							$this.blur();

					// Switch to this thumbnail's slide.
						_.switchTo($this.data('index'));

				});

		// Create slides from thumbnails.
			_.$thumbnails.children()
				.each(function() {

					var	$this = $(this),
						$thumbnail = $this.children('.thumbnail'),
						s;

					// Slide object.
						s = {
							$parent: $this,
							$slide: null,
							$slideImage: null,
							$slideCaption: null,
							url: $thumbnail.attr('href'),
							loaded: false
						};

					// Parent.
						$this.attr('tabIndex', '-1');

					// Slide.

						// Create elements.
	 						s.$slide = $('<div class="slide"><div class="caption"></div><div class="image"></div></div>');

	 					// Image.
 							s.$slideImage = s.$slide.children('.image');

 							// Set background stuff.
	 							s.$slideImage
		 							.css('background-image', '')
		 							.css('background-position', ($thumbnail.data('position') || 'center'));

						// Caption.
							s.$slideCaption = s.$slide.find('.caption');

							// Move everything *except* the thumbnail itself to the caption.
								$this.children().not($thumbnail)
									.appendTo(s.$slideCaption);

					// Preload?
						if (_.settings.preload) {

							// Force image to download.
								var $img = $('<img src="' + s.url + '" />');

							// Set slide's background image to it.
								s.$slideImage
									.css('background-image', 'url(' + s.url + ')');

							// Mark slide as loaded.
								s.$slide.addClass('loaded');
								s.loaded = true;

						}

					// Add to slides array.
						_.slides.push(s);

					// Set thumbnail's index.
						$thumbnail.data('index', _.slides.length - 1);

				});

	},

	/**
	 * Initialize stuff.
	 */
	init: function() {

		// Breakpoints.
			breakpoints({
				xlarge:  [ '1281px',  '1680px' ],
				large:   [ '981px',   '1280px' ],
				medium:  [ '737px',   '980px'  ],
				small:   [ '481px',   '736px'  ],
				xsmall:  [ null,      '480px'  ]
			});

		// Everything else.
			_.initProperties();
			_.initViewer();
			_.initEvents();

		// Show first slide if xsmall isn't active.
			breakpoints.on('>xsmall', function() {

				if (_.current === null)
					_.switchTo(0, true);

			});

	},

	/**
	 * Switch to a specific slide.
	 * @param {integer} index Index.
	 */
	switchTo: function(index, noHide) {

		// Already at index and xsmall isn't active? Bail.
			if (_.current == index
			&&	!breakpoints.active('<=xsmall'))
				return;

		// Locked? Bail.
			if (_.locked)
				return;

		// Lock.
			_.locked = true;

		// Hide main wrapper if medium is active.
			// if (!noHide
			// &&	breakpoints.active('<=medium'))
			// 	_.hide();

		// Get slides.
			var	oldSlide = (_.current !== null ? _.slides[_.current] : null),
				newSlide = _.slides[index];

		// Update current.
			_.current = index;

		// Deactivate old slide (if there is one).
			if (oldSlide) {

				// Thumbnail.
					oldSlide.$parent
						.removeClass('active');

				// Slide.
					oldSlide.$slide.removeClass('active');

			}

		// Activate new slide.

			// Thumbnail.
				newSlide.$parent
					.addClass('active')
					.focus();

			// Slide.
				var f = function() {

					// Old slide exists? Detach it.
						if (oldSlide)
							oldSlide.$slide.detach();

					// Attach new slide.
						newSlide.$slide.appendTo(_.$viewer);

					// New slide not yet loaded?
						if (!newSlide.loaded) {

							window.setTimeout(function() {

								// Mark as loading.
									newSlide.$slide.addClass('loading');

								// Wait for it to load.
									$('<img src="' + newSlide.url + '" />').on('load', function() {
									//window.setTimeout(function() {

										// Set background image.
											newSlide.$slideImage
												.css('background-image', 'url(' + newSlide.url + ')');

										// Mark as loaded.
											newSlide.loaded = true;
											newSlide.$slide.removeClass('loading');

										// Mark as active.
											newSlide.$slide.addClass('active');

										// Unlock.
											window.setTimeout(function() {
												_.locked = false;
											}, 100);

									//}, 1000);
									});

							}, 100);

						}

					// Otherwise ...
						else {

							window.setTimeout(function() {

								// Mark as active.
									newSlide.$slide.addClass('active');

								// Unlock.
									window.setTimeout(function() {
										_.locked = false;
									}, 100);

							}, 100);

						}

				};

				// No old slide? Switch immediately.
					if (!oldSlide)
						(f)();

				// Otherwise, wait for old slide to disappear first.
					else
						window.setTimeout(f, _.settings.slideDuration);

	},




	

	/**
	 * Shows the main wrapper.
	 */
	show: function() {

		// Already visible? Bail.
			if (!_.$body.hasClass('fullscreen'))
				return;

		// Show main wrapper.
			_.$body.removeClass('fullscreen');

		// Focus.
			_.$main.focus();

	},

	/**
	 * Hides the main wrapper.
	 */
	hide: function() {

		// Already hidden? Bail.
			if (_.$body.hasClass('fullscreen'))
				return;

		// Hide main wrapper.
			_.$body.addClass('fullscreen');

		// Blur.
			_.$main.blur();

	},

	/**
	 * Toggles main wrapper.
	 */
	toggle: function() {

		if (_.$body.hasClass('fullscreen'))
			_.show();
		else
			_.hide();

	},

}; return _; })(jQuery); main.init();






function Deck(){
	this.DOM = ele => document.querySelector(ele)
	this.draw = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=1`
	this.oppVal = []
	this.yourVal = []
	this.opponentCards = []
	this.yourCards = []
	
	this.playJackBlack = _ =>{
		this.deck = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
		fetch(this.deck)
		.then(res=>res.json())
		.then(data=>{
		this.deckId = data.deck_id
		this.DOM('.button').addEventListener('click',this.drawFour)
		})
	}
	
	this.redeal = _ =>{
		this.deck = 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1'
		fetch(this.deck)
		.then(res=>res.json())
		.then(data=>{
		this.deckId = data.deck_id
		this.DOM('.button').classList.remove('hidden')
		this.DOM('#redeal').classList.add('hidden')   
		this.DOM('.button').addEventListener('click',this.drawFour)
		})
	}
	
	this.removeAllChildNodes = ele =>{
		while (ele.firstChild) {
			ele.removeChild(ele.firstChild);
		}
	}
	
	this.drawFour = _ =>{
		
	  this.oppHand = ''
	  this.yourHand = ''
	
		this.removeAllChildNodes(this.DOM('#OppHand'))
		this.removeAllChildNodes(this.DOM('#yourHand'))
	
	
		this.DOM('#theirTotal').classList.add('hidden')
		this.DOM('#show').classList.remove('hidden')
		this.DOM('#bet').classList.remove('hidden')
	
	
		this.DOM('#OppCards1').src = 'img/back.jpg'
	
		this.DOM('#result').innerText = 'Result'
		this.oppVal = []
		this.yourVal = []
	
	
	let draw4 = `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=4`
	
	fetch(draw4)
	  .then(res=>res.json())
	  .then(data=>{
	
		localStorage.clear()
	 
		if(data.remaining<=4){
		  this.DOM('#redeal').classList.remove('hidden')
		   this.DOM('.button').classList.add('hidden')
		   this.DOM('#bet').classList.add('hidden')
		   this.DOM('#show').classList.add('hidden')
		   this.DOM('#redeal').addEventListener('click',this.redeal)
		   }
	
	
	   this.opponentCards = [data.cards[0].images.png, data.cards[1].images.png]
	   this.yourCards = [data.cards[2].images.png, data.cards[3].images.png]
	
	  this.oppCardImages = localStorage.setItem('opponentCards',this.opponentCards)
	  this.yourCardImages = localStorage.setItem('yourCards',this.yourCards)
	
	  this.DOM('#yourCards').src = this.yourCards[0]
	  this.DOM('#yourCards1').src = this.yourCards[1]
	  this.DOM('#OppCards').src = this.opponentCards[0]
	
	  this.oppVal.push(data.cards[0].value,data.cards[1].value)
	  this.yourVal.push(data.cards[2].value,data.cards[3].value)
	
	  this.yourVal = this.convertNumber(this.yourVal)
	  this.oppVal = this.convertNumber(this.oppVal)
	
	  this.DOM('.button').classList.add('hidden')
	  this.getSum()
	
	  this.DOM('#show').addEventListener('click',this.showCards)
	  this.DOM('#bet').addEventListener('click',this.bet)
	  })
	}
	
	
	this.showCards = _ =>{
		this.DOM('#OppCards1').src = this.opponentCards[1]
		this.DOM('#show').classList.add('hidden')
		this.DOM('#bet').classList.add('hidden')
		this.DOM('#theirTotal').classList.remove('hidden')
		this.getFinalSum()
		this.DOM('.button').classList.remove('hidden')
	
	}
	
	
	this.oppHand = ''
	this.yourHand = ''
	
	this.bet = _ =>{
		let drawTwo= `https://deckofcardsapi.com/api/deck/${this.deckId}/draw/?count=2`
	fetch(drawTwo)
	  .then(res=>res.json())
	  .then(data=>{
	
	  let newCard = document.createElement('img')
	  newCard.src = data.cards[0].images.png
	  this.DOM('#yourHand').appendChild(newCard)
	  this.yourVal.push(data.cards[0].value)
	
	  let newOppCard = document.createElement('img')
	  newOppCard.src = data.cards[1].images.png
	  this.DOM('#OppHand').appendChild(newOppCard)
	  this.oppVal.push(data.cards[1].value)
	
	  this.oppVal = this.convertNumber(this.oppVal)
	  this.yourVal = this.convertNumber(this.yourVal)
	
	  this.oppHand += data.cards[1].images.png += ', '
	  this.yourHand += data.cards[0].images.png += ', '
	
	  this.newOppImages = localStorage.setItem('newOppImages', this.oppHand)
	  this.newYourImages = localStorage.setItem('newYourImages', this.yourHand)
	
	
	  this.getSum()
	})
	}
	
	this.convertNumber = (arr) =>{
	return arr.map(ele=>{
	  if(ele==='JACK'||ele==='QUEEN'||ele==='KING'){
		  return 10
	  }else if(ele==='ACE'){
		  return 11
	  }else{
		return Number(ele)
	  }
	})
	
	
	}
	
	this.getSum = _ => {
		let yourSum = this.yourVal.reduce((a,b)=>{
	 return a+b
	   },0)
	   this.DOM('#yourTotal').innerText = yourSum
	 
	 
	   let theirSum = this.oppVal.reduce((a,b)=>{
	 return a+b
	   },0)
	 
	   this.DOM('#theirTotal').innerText = theirSum
	 
	   this.yourTotal  = localStorage.setItem('yourTotal' ,yourSum)
	   this.oppTotal = localStorage.setItem('oppTotal' ,theirSum)
	
	   if(yourSum>21){
		 this.DOM('#result').innerText = "You Lose!"
		 this.DOM('.button').classList.remove('hidden')
		 this.DOM('#bet').classList.add('hidden')
		 this.DOM('#show').classList.add('hidden')
	   }else if(theirSum>21){
		 this.DOM('#result').innerText = "You Win!"
		 this.DOM('.button').classList.remove('hidden')
		 this.DOM('#bet').classList.add('hidden')
		 this.DOM('#show').classList.add('hidden')
	   }
	  
	 }
	 
	 this.getFinalSum = _ =>{ 
		this.yourSum = this.yourVal.reduce((a,b)=>{
	return a+b
		},0)
		this.DOM('#yourTotal').innerText = this.yourSum
			
			
		this.theirSum = this.oppVal.reduce((a,b)=>{
	 return a+b
		},0)
	
	  this.DOM('#theirTotal').innerText = this.theirSum
	 
	  
	  if(this.yourSum>21){
		this.DOM('#result').innerText = "You Lose!"
		this.DOM('.button').classList.remove('hidden')
		this.DOM('#bet').classList.add('hidden')
		this.DOM('#show').classList.add('hidden')
	  }else if(this.theirSum>21){
		this.DOM('#result').innerText = "You Win!"
		this.DOM('.button').classList.remove('hidden')
		this.DOM('#bet').classList.add('hidden')
		this.DOM('#show').classList.add('hidden')
	  }else if(this.yourSum>this.theirSum){
		this.DOM('#result').innerText = "You Win!"
		this.DOM('.button').classList.remove('hidden')
		this.DOM('#bet').classList.add('hidden')
		this.DOM('#show').classList.add('hidden')
	  }else if(this.theirSum>this.yourSum){
		this.DOM('#result').innerText = "You Lose!"
		this.DOM('.button').classList.remove('hidden')
		this.DOM('#bet').classList.add('hidden')
		this.DOM('#show').classList.add('hidden')
	  }else if(this.theirSum===this.yourSum){
		this.DOM('#result').innerText = "It is a Tie!"
		this.DOM('.button').classList.remove('hidden')
		this.DOM('#bet').classList.add('hidden')
		this.DOM('#show').classList.add('hidden')
	  }
	}
	
	}
	
	
	
	
	let deck1 = new Deck()
	
	deck1.playJackBlack()
	
	deck1.oppCardImages = localStorage.getItem('opponentCards')
	deck1.yourCardImages = localStorage.getItem('yourCards')
	
	deck1.yourTotal  = localStorage.getItem('yourTotal')
	deck1.oppTotal = localStorage.getItem('oppTotal')
	deck1.newOppImages = localStorage.getItem('newOppImages')
	deck1.newYourImages = localStorage.getItem('newYourImages')
	
	if(deck1.oppCardImages!==null||deck1.yourCardImages!==null||deck1.oppTotal!==null||deck1.yourTotal!==null){
	  deck1.DOM('#yourCards').src = (deck1.yourCardImages.split(','))[0]
	  deck1.DOM('#yourCards1').src = (deck1.yourCardImages.split(','))[1]
	  deck1.DOM('#OppCards').src = (deck1.oppCardImages.split(','))[0]
	  deck1.DOM('#yourTotal').innerText = deck1.yourTotal
	  deck1.DOM('#theirTotal').innerText = deck1.oppTotal
	}
	
	if(deck1.newOppImages!==null||deck1.newYourImages!==null && deck1.newOppImages.length > 2){
	  let newCard = document.createElement('img')
	  deck1.newYourImages = deck1.newYourImages.split(', ')
	  newCard.src = deck1.newYourImages[0]
	  deck1.DOM('#yourHand').appendChild(newCard)
	
	  let newOppCard = document.createElement('img')
	  deck1.newOppImages = deck1.newOppImages.split(', ')
	  newOppCard.src = deck1.newOppImages[0]
	  deck1.DOM('#OppHand').appendChild(newOppCard)
	}
	
	
	if(deck1.newOppImages!==null||deck1.newYourImages!==null && deck1.newOppImages.length === 3){
	  let newCard = document.createElement('img')
	  deck1.newYourImages = deck1.newYourImages
	  newCard.src = deck1.newYourImages[1]
	  deck1.DOM('#yourHand').appendChild(newCard)
	
	  let newOppCard = document.createElement('img')
	  deck1.newOppImages = deck1.newOppImages
	  newOppCard.src = deck1.newOppImages[1]
	  deck1.DOM('#OppHand').appendChild(newOppCard)
	
	}
	
	