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
      prefixLen = prefix.length,

      MATRIX = [1, 0, 0, 1, 0, 0],
      MATRIX_3D = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]


  
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

        case 'matrix':
        case 'matrix3d':
          return getMatrix(this[0]) || MATRIX

        case 'scale':
        case 'scaleX':
        case 'scaleY':
        case 'rotate':
        case 'rotateX':
        case 'rotateY':
        case 'rotateZ':
        case 'translate':
        case 'translateX':
        case 'translateY':
        case 'translateZ':
        case 'skew':
        case 'skewX':
        case 'skewY':
          return getStyleFromMatrix(this[0], arguments[0])
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


  $.fn.csstransform.degrees = function (radians) {
    return r2d(radians)
  }

  $.fn.csstransform.radians = function (degrees) {
    return d2r(degrees)
  }


  function CssTransform(el) {
    this.el = el
    return this
  }

  CssTransform.prototype = {

    execute: function (args) {
      var arg0 = args[0],
          arg1 = args[1]
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


  function getMatrix(el) {
    var matrix = getStyle(el, 'transform')
    return (matrix && matrix !== 'none') ? convertMatrixToArray(matrix) : null
  }


  function getStyleFromMatrix(el, prop) {
    var matrix = getMatrix(el)

    if (!matrix) {
      switch (prop) {
        case 'scaleX':
        case 'scaleY':
          return 1
        case 'scale':
          return [1, 1]
        case 'translate':
        case 'skew':
          return [0, 0]
        case 'translate3d':
          return [0, 0, 0]
        case 'scale3d':
          return [1, 1, 1]
        case 'rotate3d':
          // @see https://developer.mozilla.org/en-US/docs/CSS/transform-function
          return [0, 0, 0, 0]
      }
      return 0
    }

    if (matrix.length > 6) {
      return 0
    } else {
      return getMatrixProp2d(matrix, prop)
    }
    return 0
  }


  /**
   * @param {array} matrix An array of matrix numbers (not the raw string transform output).
   * @param {string} prop The property we want a result for.
   * @returns {number}
   */
  function getMatrixProp2d(matrix, prop) {
    switch (prop) {
      case 'scaleX':
        return matrix[0]
      case 'scaleY':
        return matrix[3]
      case 'scale':
        return [matrix[0], matrix[3]]
      case 'rotate':
        return [Math.acos(matrix[0]), Math.acos(matrix[1])]
      case 'translateX':
        return matrix[4]
      case 'translateY':
        return matrix[5]
      case 'translate':
        return [matrix[4], matrix[5]]
      case 'skewX':
        return Math.atan(matrix[2])
      case 'skewY':
        return Math.atan(matrix[1])
      case 'skew':
        return [Math.atan(matrix[2]), Math.atan(matrix[1])]
    }
    return 0
  } 


  function convertMatrixToArray(matrix) {
    var nums
    if (!matrix || matrix === 'none') {
      return []
    }
    nums = matrix.match(/-?\d+.+\d+/gi)[0].split(', ')
    $(nums).each(function (i, num) {
      nums[i] = parseFloat(num)
    })
    return nums
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

  function r2d(radians) {
    return radians * 180 / Math.PI
  }

  function d2r(degrees) {
    return degrees * Math.PI / 180
  }

}(jQuery));