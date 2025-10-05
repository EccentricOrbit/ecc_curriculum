"""
The `tunepad.drawing` module defines a function to get a CanvasRenderingContext2D
from the DOM <tunepad-canvas> elements.
"""

from pyodide.code import run_js
from math import pi
from types import MethodType


#---------------------------------------------------------------------
# internal function called by PythonWorker.js
#---------------------------------------------------------------------
_tunepad_canvas = None
def setDefaultCanvas(default_canvas):
    global _tunepad_canvas
    _tunepad_canvas = default_canvas


# returns a JavaScript CanvasRenderingContext2D object
def getCanvas(canvas_name = None):
    """
    Returns a JavaScript CanvasRenderingContext2D object for the given `canvas_name`.
    If the optional `canvas_name` parameter is not provided, this will return either
    the canvas indicated in a tunepad-cell's `canvas` attribute, or the first canvas
    in the document (if the canvas attribute is not defined).

    See https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

    For convenience, the context object has a width and height property set, which 
    correspond to the canvas width and height.

    There are also `fillCircle(x, y, radius)` and `circle(x, y, radius)` methods defined.
    """
    if (canvas_name == None): canvas_name = _tunepad_canvas
    ctx = run_js(f'_getCanvasContext("{canvas_name}")' if canvas_name else '_getCanvasContext()')

    ctx.width = ctx.canvas.width
    ctx.height = ctx.canvas.height

    def fillCircle(self, x, y, radius):
        self.beginPath()
        self.arc(x, y, radius, 0, pi * 2)
        self.fill()

    ctx.fillCircle = MethodType(fillCircle, ctx)

    def circle(self, x, y, radius):
        self.arc(x, y, radius, 0, pi * 2)

    ctx.circle = MethodType(circle, ctx)

    return ctx



def fetch(resource, options):
    return run_js(f'fetch("{resource}")')
