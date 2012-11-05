jquery-csstransform
===================

A jQuery plugin for manipulating and animating CSS transforms.

On hold while I get some other crap done.

Notes:

* When scale3d or scaleZ is set, a nonsensenical number is output for scaleX inside matrix3d, although visual display is fine. Or something's going on that I'm too dim to understand.

* $.csstransform('rotate3d') just returns the matrix3d array. The actual calculations are a bit much to handle, especially for a property which doesn't need to be read nearly as often as it is written.