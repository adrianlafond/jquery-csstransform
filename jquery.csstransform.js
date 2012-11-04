/**
 * Disbranded / jquery.csstransform
 *
 * @author    Adrian Lafond / Disbranded
 * @github    https://github.com/disbranded
 * @version   0.0.1 
 */
;(function ($) {
  'use strict'

  var prefix = ['ms', 'webkit', 'Moz', 'O'],
      prefixLen = prefix.length


  
  $.fn.csstransform = function() {
    var argsLen = arguments.length

    if (argsLen === 1) {
      switch (arguments[0]) {
        case 'transform':
        case 'transformOrigin':
        case 'transform-origin':
        case 'transformStyle':
        case 'transform-style':
        case 'perspective':
        case 'perspectiveOrigin':
        case 'perspective-origin':
          return getStyle(this[0], arguments[0])
        default:
          return null
      }
    }

    return this.each(function () {
      var $el = $(this),
          transform = $el.data('csstransform')
          //settings// = $.extend($.fn.csstransform.defaultSettings, settings || {})

      if (!transform) {
        transform = new CssTransform(this)
        $el.data('csstransform', transform)
      }

      return transform.execute(arguments)
    })
  }

  $.fn.csstransform.defaultSettings = {
    matrix2d: null,
    matrix3d: null
  }


  function CssTransform(el) {
    this.el = el
    return this
  }

  CssTransform.prototype = {

    execute: function (args) {
      var arg0 = args[0],
          arg1 = args[1]
      // switch (arg0) {
      //   case 'transform':
      //   case 'transformOrigin':
      //   case 'transform-origin':
      //   case 'transformStyle':
      //   case 'transform-style':
      //   case 'perspective':
      //   case 'perspectiveOrigin':
      //   case 'perspective-origin':
      //     return und(arg1) ? this.get(arg0) : this.set(arg0, arg1)
      //   case 'animate':
      //     return this.animate(args)
      //   default:
      //     return null
      // }
      return this.set(arg0, arg1)
    },

    style: function (prop, value) {
      var propCamel = prop.charAt(0).toUpperCase() + prop.substr(1)
      this.el.style['ms' + propCamel] = value
      this.el.style['webkit' + propCamel] = value
      this.el.style['Moz' + propCamel] = value
      this.el.style['O' + propCamel] = value
      this.el.style[prop] = value
    },

    set: function (attr, value) {
      switch (attr) {
        case 'transform':
          this.style('transform', value)
          break
        case 'transformStyle':
        case 'transform-style':
          if (value === 'flat' || value === 'preserve-3d') {
            this.style('transformStyle', value)
          }
          break
        case 'perspective':
          this.style('perspective', px(value))
          break
        case 'transformOrigin':
        case 'transform-origin':
          this.style('transformOrigin', value)
          break
        case 'perspectiveOrigin':
        case 'perspective-origin':
          this.style('perspectiveOrigin', value)
          break
      }
    },

    get: function (attr) {
      switch (attr) {
        case 'transform':
        case 'perspective':
          return window.getComputedStyle(this.el)[this.prop(attr)]
        case 'matrix':
        case 'matrix3d':
          return 0
        default:
          return this.el.style[this.prop(attr)]
      }
    },


    animate: function () {
      //
    },

    prop: function (attr) {
      return getProp(this.el, attr)
    }
  }

  /**
   * @param {string|number|*} value
   * @returns 
   */
  function px(value) {
    var type = typeof value
    switch (type) {
      case 'number':
        return value + 'px'
      case 'string':
        return value
    }
    return 0
  }


  /**
   * 
   */
  function getStyle(el, prop) {
    var style = (el && 'getComputedStyle' in window) ? window.getComputedStyle(el) : null
    return style ? style[getProp(el, prop)] : null
  }


  /**
   * @returns the relevant name of a prefixed property.
   */
  function getProp(el, propName) {
    var i = 0,
        withPrefix
    if (propName in el.style) {
      return propName
    } else {
      propName = propName.charAt(0).toUpperCase() + propName.substr(1)
      for (; i < prefixLen; i++) {
        withPrefix = prefix[i] + propName
        if (withPrefix in el.style) {
          return withPrefix
        }
      }
    }
  }

  /**
   * For convenience.
   */
  function und(value) {
    return typeof value === 'undefined'
  }



  function matrix(value) {
    //
  }
}(jQuery));