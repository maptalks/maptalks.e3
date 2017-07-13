# maptalks.e3

[![CircleCI](https://circleci.com/gh/maptalks/maptalks.e3/tree/master.svg?style=shield)](https://circleci.com/gh/maptalks/maptalks.e3)
[![NPM Version](https://img.shields.io/npm/v/maptalks.e3.svg)](https://github.com/maptalks/maptalks.e3)

A maptalks Layer to render with great [echarts 3](https://github.com/ecomfe/echarts) library.

![screenshot](https://cloud.githubusercontent.com/assets/13678919/25565572/afd6d500-2dfb-11e7-977c-951727539b5c.jpg)

## Examples

* [Airlines](https://maptalks.github.io/maptalks.e3/demo/fly.html). (based on [original](http://echarts.baidu.com/demo.html#geo-lines))
* [Bus lines in beijing](https://maptalks.github.io/maptalks.e3/demo/bus.html). (based on [original](http://echarts.baidu.com/demo.html#lines-bmap-effect))

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

## API Reference

```E3Layer``` is a subclass of [maptalks.Layer](https://maptalks.github.io/docs/api/Layer.html) and inherits all the methods of its parent.

### `Constructor`

```javascript
new maptalks.E3Layer(id, ecOptions, options)
```

* id **String** layer id
* ecOptions **Object** [echarts options](http://echarts.baidu.com/echarts2/doc/doc-en.html)
* options **Object** options
    * renderer **String** renderer of the layer, only 'dom' is supported now. ('dom' by default)
    * container **String** specify the container for layer dom elements: 'front' or 'back' ('front' by default)
    * hideOnZooming **Boolean** whether hide e3layer on zooming, to improve zooming performance.
    * hideOnMoving **Boolean** whether hide e3layer on moving, to improve moving performance.
    * hideOnRotating **Boolean** whether hide e3layer on drag rotating, to improve drag rotating performance.
    * Other options defined in [maptalks.Layer](https://maptalks.github.io/docs/api/Layer.html)

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
