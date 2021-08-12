'use strict'

const pandemic = {}

;($ => {
  const $body = $('body'),
    $window = $(window)

  pandemic.init = () => {
    pandemic.mobileMenu()
    pandemic.fixedHeader()
    pandemic.backToTop()
    pandemic.tabs()
    pandemic.gallery()
    pandemic.offCanvasMenu()
  }

  pandemic.mobileMenu = () => {
    const $menuToggle = $('.menu-toggle')

    if (992 <= $window.width()) {
      $('#primary-menu').removeClass('is-mobile')
      $menuToggle.removeClass('is-active')
      $body.removeClass('menu-open')
      $('.open-child').remove()
      $('.menu-item-back').remove()
      return
    }
    $('#primary-menu').addClass('is-mobile')

    $menuToggle.off('click').on('click', e => {
      $(e.currentTarget).toggleClass('is-active')
      $body.toggleClass('menu-open')
    })

    $('#page')
      .off('click')
      .on('click', e => {
        if (
          !$(e.target).closest('.menu-toggle').length &&
          !$(e.target).closest('#primary-menu').length &&
          $menuToggle.hasClass('is-active') &&
          $body.hasClass('menu-open')
        ) {
          $menuToggle.removeClass('is-active')
          $body.removeClass('menu-open')

          e.preventDefault()
        }
      })

    // Add arrows to all items have sub-menu.
    $('#primary-menu')
      .find('li:has(ul)')
      .each((index, el) => {
        const $el = $(el),
          link = $el.find('>a').clone()

        if (link.length && !$el.find('.open-child').length) {
          $el.prepend('<span class="open-child">open</span>')
          $el.find('>ul').prepend(
            '<li class="menu-item-back">' +
              link
                .wrap('<div>')
                .parent()
                .html() +
              '</a></li>'
          )
        }
      })

    // Open sub-menu.
    $('.open-child').on('click', e => {
      const $parent = $(e.currentTarget).parent()

      if ($parent.hasClass('open')) {
        $parent.removeClass('open')
      } else {
        $parent
          .parent()
          .find('>li.open')
          .removeClass('open')
        $parent.addClass('open')
      }

      $('#primary-menu')
        .parent()
        .scrollTop(0)
    })

    // Go back.
    $('.menu-item-back').on('click', e => {
      const $grand = $(e.currentTarget)
        .parent()
        .parent()

      if ($grand.hasClass('open')) {
        $grand.removeClass('open')
      }
    })
  }

  pandemic.fixedHeader = () => {
    if ($('.site-header--fixed').length) {
      $('.site-header--fixed').jSticky({
        zIndex: 9999
      })
    }
  }

  pandemic.backToTop = () => {
    const $backToTop = $('#back-to-top')

    if ($backToTop.length) {
      const scrollTrigger = 100,
        backToTop = function() {
          if ($window.scrollTop() > scrollTrigger) {
            $('#back-to-top').addClass('show')
          } else {
            $('#back-to-top').removeClass('show')
          }
        }

      backToTop()

      $window.on('scroll', function() {
        backToTop()
      })

      $backToTop.on('click', function(e) {
        e.preventDefault()

        $('html, body').animate(
          {
            scrollTop: 0
          },
          700
        )
      })
    }
  }

  pandemic.tabs = $scope => {
    let $element = $('.pandemic-tabs')

    if (typeof $scope !== 'undefined') {
      $element = $scope.find('.pandemic-tabs')
    }

    $element.each(function() {
      const $tabs = $(this)
      const $tab = $tabs.find('.pandemic-tab-title')
      const $tabMobile = $tabs.find('.pandemic-tab-mobile-title')
      const $tabLink = $tabs.find('.pandemic-tab-desktop-title a')
      const $tabContent = $tabs.find('.pandemic-tab-content')

      setTimeout(function() {
        let maxHeight = $tabContent
          .first()
          .find('.pandemic-tab-content__inner')
          .height()

        $tabContent.each(function() {
          const h = $(this)
            .find('.pandemic-tab-content__inner')
            .height()

          if (h > maxHeight) {
            maxHeight = h
          }

          $(this).height(h)
        })

        $tabContent.closest('.pandemic-tabs-content-wrapper').height(maxHeight)
      }, 500)

      // Active the first tab after loading
      $tabs.find('.pandemic-tab-title[data-tab="1"]').addClass('pandemic-active')
      $tabs.find('.pandemic-tab-content[data-tab="1"]').addClass('pandemic-active')

      $tabLink.on('click', function(e) {
        e.preventDefault()

        const $currentTab = $(this).parent()
        const dataTab = $currentTab.attr('data-tab')
        const $currentContent = $tabs.find(`.pandemic-tab-content[data-tab="${dataTab}"]`)

        $tab.removeClass('pandemic-active')
        $currentTab.addClass('pandemic-active')

        $tabContent.removeClass('pandemic-active')
        $currentContent.addClass('pandemic-active')

        const h = $currentContent.find('.pandemic-tab-content__inner').height()

        $(this)
          .closest('.pandemic-tabs')
          .find('.pandemic-tabs-content-wrapper')
          .height(h)

        // Fix slick slider in tabs.
        $('.slick-slider').slick('setPosition')
      })

      $tabMobile.on('click', function(e) {
        e.preventDefault()

        const $currentTab = $(this)
        const dataTab = $currentTab.attr('data-tab')
        const $currentContent = $tabs.find(`.pandemic-tab-content[data-tab="${dataTab}"]`)

        $tab.removeClass('pandemic-active')
        $currentTab.addClass('pandemic-active')

        $tabContent.removeClass('pandemic-active').hide()
        $currentContent.addClass('pandemic-active').show()

        // Fix slick slider in tabs.
        $('.slick-slider').slick('setPosition')
      })
    })
  }

  pandemic.videoSlider = $scope => {
    let $sliderLink = $('.video-slider__link')

    if (typeof $scope !== 'undefined') {
      $sliderLink = $scope.find('.video-slider__link')
    }

    if ($sliderLink.length) {
      $sliderLink.magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
      })
    }

    let $slider = $('.pandemic-video-slider__wrapper').not('.slick-initialized')
    let $progressBar = $('.video-slider__progressbar-inner')

    if (typeof $scope !== 'undefined') {
      $slider = $scope.find('.pandemic-video-slider__wrapper').not('.slick-initialized')
      $progressBar = $scope.find('.video-slider__progressbar-inner')
    }

    if ($slider.length) {
      $slider.slick({
        slidesToShow: 3,
        centerPadding: '200px',
        centerMode: true,
        variableWidth: true,
        adaptiveHeight: true,
        nextArrow: '<div class="video-slider__next-btn"><span>Next</span></div>',
        prevArrow: '<div class="video-slider__prev-btn"><span>Previous</span></div>',
        responsive: [
          {
            breakpoint: 1440,
            settings: {
              slidesToShow: 1,
              variableWidth: false,
              centerMode: false
            }
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              variableWidth: false,
              centerMode: false
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              variableWidth: false,
              centerMode: false,
              centerPadding: '0px'
            }
          }
        ]
      })
    }

    $slider.on('beforeChange', function(event, slick) {
      const count = slick.slideCount
      const current = slick.currentSlide
      let percent = ((current + 2) / count) * 100

      if (current + 2 > count) {
        percent = ((current + 2 - count) / count) * 100
      }

      $progressBar.css('width', `${percent}%`)
    })
  }

  pandemic.matchSlider = $scope => {
    let $slider = $('.pandemic-match-slider__wrapper').not('.slick-initialized')
    const showTick = $slider.attr('data-show-tick') === 'yes'
    let rows = $slider.attr('data-rows')

    if (typeof $scope !== 'undefined') {
      $slider = $scope.find('.pandemic-match-slider__wrapper').not('.slick-initialized')
    }

    if (!rows) {
      rows = 2
    }

    if ($slider.length) {
      $slider.slick({
        slidesToShow: 1,
        rows,
        centerMode: true,
        centerPadding: '0px',
        dots: showTick,
        customPaging(slick, index) {
          return '<a>' + (index + 1) + '</a>'
        }
      })
    }
  }

  pandemic.postSlider = $scope => {
    let $slider = $('.pandemic-post-slider__wrapper').not('.slick-initialized')

    if (typeof $scope !== 'undefined') {
      $slider = $scope.find('.pandemic-post-slider__wrapper').not('.slick-initialized')
    }

    if ($slider.length) {
      $slider.slick({
        slidesToShow: 3,
        centerPadding: '200px',
        centerMode: true,
        variableWidth: true,
        adaptiveHeight: true,
        responsive: [
          {
            breakpoint: 1440,
            settings: {
              slidesToShow: 1,
              variableWidth: false,
              centerMode: true,
              centerPadding: '100px'
            }
          },
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 1,
              variableWidth: true,
              centerMode: true,
              centerPadding: '100px'
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              variableWidth: false,
              adaptiveHeight: true,
              centerMode: false,
              centerPadding: '0px'
            }
          }
        ]
      })
    }
  }

  pandemic.gallery = $scope => {
    let $gallery = $('.pandemic-gallery')

    if (typeof $scope !== 'undefined') {
      $gallery = $scope.find('.pandemic-gallery')
    }

    if ($gallery.length) {
      // eslint-disable-next-line no-undef
      new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: false
      })
      // magnific popup
      $gallery.find('.tiles__line-img').css('cursor', 'pointer');
      $gallery.find('.tiles__line-img').on('click', function(){
        let imageUrl = $(this).data('image');
        $.magnificPopup.open({
          items: {
            src: imageUrl
          },
          type: 'image',
          gallery: {
            enabled: true
          }
        })
      })
    }
  }

  pandemic.offCanvasMenu = () => {
    const $toggle = $('.offcanvas-toggle')
    const $offcanvasWrapper = $('#offcanvas-wrapper')

    $toggle.on('click', e => {
      e.preventDefault()

      $body.toggleClass('offcanvas-menu-opened')
      $offcanvasWrapper.toggleClass('is-open')
    })
  }

  $(() => {
    pandemic.init()
  })

  $window.on('load', () => {
    pandemic.videoSlider()
    pandemic.matchSlider()
  })

  $window.on('resize', () => {
    pandemic.mobileMenu()
  })

  $window.on('elementor/frontend/init', function() {
    // eslint-disable-next-line no-undef
    elementorFrontend.hooks.addAction('frontend/element_ready/pandemic_tabs.default', function($scope) {
      pandemic.tabs($scope)
    })

    // eslint-disable-next-line no-undef
    elementorFrontend.hooks.addAction('frontend/element_ready/pandemic_video_slider.default', function($scope) {
      pandemic.videoSlider($scope)
    })

    // eslint-disable-next-line no-undef
    elementorFrontend.hooks.addAction('frontend/element_ready/pandemic_match_slider.default', function($scope) {
      pandemic.matchSlider($scope)
    })

    // eslint-disable-next-line no-undef
    elementorFrontend.hooks.addAction('frontend/element_ready/pandemic_post_slider.default', function($scope) {
      pandemic.postSlider($scope)
    })
  })
})(jQuery) // eslint-disable-line no-undef