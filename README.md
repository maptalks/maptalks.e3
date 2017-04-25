# maptalks.e3

[![CircleCI](https://circleci.com/gh/maptalks/maptalks.e3.svg?style=shield)](https://circleci.com/gh/maptalks/maptalks.e3)
[![NPM Version](https://img.shields.io/npm/v/maptalks.e3.svg)](https://github.com/maptalks/maptalks.e3)

A maptalks Layer to render with great [echarts](https://github.com/ecomfe/echarts) library.

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
// ecOptions is echarts' options
var e3Layer = new maptalks.E3Layer('e3', ecOptions)
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
new maptalks.e3Layer(id, ecOptions, options)
```

* id **String** layer id
* ecOptions **Object** [echarts options](http://echarts.baidu.com/echarts2/doc/doc-en.html)
* options **Object** options
    * renderer **String** renderer of the layer, only 'dom' is supported now. ('dom' by default)
    * container **String** specify the container for layer dom elements: 'front' or 'back' ('front' by default)
    * Other options defined in [maptalks.Layer](http://docs.maptalks.org/api/maptalks.Layer.html)

### `getEChartsOption()`

get layer's echarts options

**Returns** `Object`

### `setEChartsOption(ecOptions)`

set a new echarts option to the layer

* ecOptions **Object** echarts options

**Returns** `this`

### `toJSON()`

export the E3Layer's JSON.

```javascript
var json = e3layer.toJSON();
```

**Returns** `Object`

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
