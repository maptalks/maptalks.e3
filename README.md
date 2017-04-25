# maptalks.e3

[![CircleCI](https://circleci.com/gh/maptalks/maptalks.e3.svg?style=shield)](https://circleci.com/gh/maptalks/maptalks.e3)
[![NPM Version](https://img.shields.io/npm/v/maptalks.e3.svg)](https://github.com/maptalks/maptalks.e3)

A maptalks Layer to render with great [d3js](https://d3js.org) library.

![screenshot]()

## Install
  
* Install with npm: ```npm install maptalks.e3```. 
* Download from [dist directory](https://github.com/maptalks/maptalks.e3/tree/gh-pages/dist).
* Use unpkg CDN: ```https://unpkg.com/maptalks.e3/dist/maptalks.e3.min.js```

## Usage

As a plugin, ```maptalks.e3``` must be loaded after ```maptalks.js``` in browsers.
```html
<script type="text/javascript" src="https://unpkg.com/maptalks/dist/maptalks.min.js"></script>
<script type="text/javascript" src="https://unpkg.com/maptalks.e3/dist/maptalks.e3.min.js"></script>
<script>
// e3Options is echarts' options
var e3Layer = new maptalks.E3Layer('e3', e3Options)
    .addTo(map);
</script>
```
## Supported Browsers

IE 9-11, Chrome, Firefox, other modern and mobile browsers.

## Examples

* [Choropleth of unemployment](https://maptalks.github.io/maptalks.e3/demo/choropleth.html). (based on [original](http://bl.ocks.org/mbostock/4060606))
* [Choropleth of unemployment with D3 V3](https://maptalks.github.io/maptalks.e3/demo/choropleth-v3.html). (based on [original](http://bl.ocks.org/mbostock/4060606))
* [Voronoi diagram of airports and flights](https://maptalks.github.io/maptalks.e3/demo/flights.html). (based on [original](http://bl.ocks.org/mbostock/7608400))
* [Coastal Graph Distance](https://maptalks.github.io/maptalks.e3/demo/coastal.html). (based on [original](http://bl.ocks.org/mbostock/9744818))

## API Reference

```D3Layer``` is a subclass of [maptalks.Layer](http://docs.maptalks.org/api/maptalks.Layer.html) and inherits all the methods of its parent.

### `Constructor`

```javascript
new maptalks.e3Layer(id, options)
```

* id **String** layer id
* options **Object** options
    * d3Version **Number** version of D3: 3 or 4 (4 by default)
    * renderer **String** renderer of the layer: 'dom' or 'canvas' ('canvas' by default)
    * hideWhenZooming **Boolean** for dom renderer, whether hide the layer when zooming to improve performance (false by default)
    * container **String** for dom renderer, specify the container for layer dom elements: 'front' or 'back' ('front' by default)
    * Other options defined in [maptalks.Layer](http://docs.maptalks.org/api/maptalks.Layer.html)

### `config(key, value)`

config layer's options and redraw the layer if necessary

```javascript
animMarkerLayer.config('animation', 'scale');
```

**Returns** `this`

### `isCanvasRender()`

Whether the layer is rendered by canvas

**Returns** ```Boolean```

### `prepareToDraw(projection)`

An interface callback method, it is called only once before first drawing and never called again.

It is designed to implement to prepare the context for layer drawing.

The parameters returned by prepareToDraw will be passed to draw method.

* projection **Object** map projection object containing ```project(coord)``` and ```unproject(coord)``` method, returned by map.getProjection()

```javascript
var d3Layer = new maptalks.e3Layer('d3', { d3Version : 3 });
//Prepare the context parameters for D3Layer's drawing.
//Method prepareToDraw will be called only for once before the first drawing of the layer.
//It can be used to prepare context parameters for draw method
//The parameters returned by prepareToDraw will be passed to draw method.
d3Layer.prepareToDraw = function(context, projection) {
    var colors = [
        'rgba(247,251,255, 0.8)',
        'rgba(222,235,247, 0.8)',
        'rgba(198,219,239, 0.8)',
        'rgba(158,202,225, 0.8)',
        'rgba(107,174,214, 0.8)',
        'rgba(66,146,198, 0.8)',
        'rgba(33,113,181, 0.8)',
        'rgba(8,81,156, 0.8)',
        'rgba(8,48,107, 0.8)'
  ];
  var quantize = d3.scale.quantize()
      .domain([0, .15])
      .range(d3.range(9).map(function(i) { return i; }));
  var rateById = d3.map();

  //The parameters will be passed to draw method.
  return [rateById, colors, quantize];
};
```

**Returns** `this`

### `draw(context, projection, ..params)`

The core interface method of D3Layer, implement it to draw the layer on the map.

* context **SVG|Canvas2dContext** context for D3 to draw on, possiblly a SVG element (dom renderer) or a canvas 2d context (canvas renderer).
* projection **Object** map projection object
* params **Any** parameters returns by `prepareToDraw` method

```javascript
var d3Layer = new maptalks.e3Layer('d3', { d3Version : 3 });
//context is the canvas context
//projection is the projection object used by d3 to convert geo coordinates to screen points.
d3Layer.draw = function draw(context, projection, rateById, colors, quantize) {
  var layer = this;
  //the d3 path method to draw features on canvas context
  var path = d3.geo.path()
      .projection(projection).context(context);
  if (!us) {
    //load data
    queue()
      .defer(d3.json, "us.json")
      .defer(d3.tsv, "unemployment.tsv", function(d) { rateById.set(d.id, +d.rate); })
      .await(function (error, data) {
        if (error) throw error;
        us = data;
        draw();
      });
  } else {
    //data is ready and just draw
    draw();
  }

  function draw() {
    topojson.feature(us, us.objects.counties).features.forEach(function (d) {
      context.fillStyle = colors[quantize(rateById.get(d.id))];
      context.beginPath();
      path(d);
      context.fill();
    });
    //ask the layer to redraw
    layer.redraw();
  }
};
```

**Returns** `this`

### `redraw()`

request layer to draw

**Returns** `this`

### `getContext()`

Get layer's context to draw on, SVG or Canvas2dContext

**Returns** `SVG|Canvas2dContext`

### `getGeoProjection()`

Get layer's geo projection method used by D3 internally.

**Returns** `Function`

## Contributing

We welcome any kind of contributions including issue reportings, pull requests, documentation corrections, feature requests and any other helps.

## Develop

The only source file is ```index.js```.

It is written in ES6, transpiled by [babel](https://babeljs.io/) and tested with [mocha](https://mochajs.org) and [expect.js](https://github.com/Automattic/expect.js).

### Scripts

* Install dependencies
```shell
$ npm install
```

* Watch source changes and generate runnable bundle repeatedly
```shell
$ gulp watch
```

* Tests
```shell
$ npm test
```

* Watch source changes and run tests repeatedly
```shell
$ gulp tdd
```

* Package and generate minified bundles to dist directory
```shell
$ gulp minify
```

* Lint
```shell
$ npm run lint
```
