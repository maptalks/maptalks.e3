/*!
 * maptalks.e3 v0.1.0
 * LICENSE : MIT
 * (c) 2016-2017 maptalks.org
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks'), require('echarts')) :
	typeof define === 'function' && define.amd ? define(['exports', 'maptalks', 'echarts'], factory) :
	(factory((global.maptalks = global.maptalks || {}),global.maptalks,global.echarts));
}(this, (function (exports,maptalks,echarts) { 'use strict';

echarts = 'default' in echarts ? echarts['default'] : echarts;

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var options = {
    'container': 'front',
    'renderer': 'dom'
};

/**
 * ECharts3 plugin for maptalks.js
 *
 * Thanks to Echarts Team (https://github.com/ecomfe/echarts)
 *
 * @author Fu Zhen (fuzhen@maptalks.org)
 *
 * MIT License
 */
var E3Layer = function (_maptalks$Layer) {
    _inherits(E3Layer, _maptalks$Layer);

    function E3Layer(id, ecOptions, options) {
        _classCallCheck(this, E3Layer);

        var _this = _possibleConstructorReturn(this, _maptalks$Layer.call(this, id, options));

        _this._ecOptions = ecOptions;
        return _this;
    }

    E3Layer.prototype.getEChartsOption = function getEChartsOption() {
        return this._ecOptions;
    };

    E3Layer.prototype.setEChartsOption = function setEChartsOption(ecOption) {
        this._ecOptions = ecOption;
        if (this._getRenderer()) {
            this._getRenderer()._clearAndRedraw();
        }
        return this;
    };

    /**
     * Export the E3Layer's JSON.
     * @return {Object} layer's JSON
     */


    E3Layer.prototype.toJSON = function toJSON() {
        return {
            'type': this.getJSONType(),
            'id': this.getId(),
            'ecOptions': this._ecOptions,
            'options': this.config()
        };
    };

    /**
     * Reproduce a E3Layer from layer's JSON.
     * @param  {Object} json - layer's JSON
     * @return {maptalks.E3Layer}
     * @static
     * @private
     * @function
     */


    E3Layer.fromJSON = function fromJSON(json) {
        if (!json || json['type'] !== this.getJSONType()) {
            return null;
        }
        return new E3Layer(json['id'], json['ecOptions'], json['options']);
    };

    return E3Layer;
}(maptalks.Layer);

E3Layer.mergeOptions(options);

E3Layer.registerJSONType('E3Layer');

E3Layer.registerRenderer('dom', function () {
    function _class(layer) {
        _classCallCheck(this, _class);

        this.layer = layer;
    }

    _class.prototype.render = function render() {
        if (!this._container) {
            this._createLayerContainer();
            this._ec = echarts.init(this._container);
            this._prepareECharts();
        }
        this._ec.setOption(this.layer._ecOptions, false);
        this.layer.fire('layerload');
    };

    _class.prototype.getMap = function getMap() {
        return this.layer.getMap();
    };

    _class.prototype.show = function show() {
        if (this._container) {
            this._clearAndRedraw();
            this._container.style.display = '';
        }
    };

    _class.prototype.hide = function hide() {
        if (this._container) {
            this._container.style.display = 'none';
            this.clear();
        }
    };

    _class.prototype.remove = function remove() {
        this._ec.clear();
        this._ec.dispose();
        delete this._ec;
        this._removeLayerContainer();
    };

    _class.prototype.clear = function clear() {
        this._ec.clear();
    };

    _class.prototype.setZIndex = function setZIndex(z) {
        this._zIndex = z;
        if (this._container) {
            this._container.style.zIndex = z;
        }
    };

    _class.prototype.isCanvasRender = function isCanvasRender() {
        return false;
    };

    _class.prototype._prepareECharts = function _prepareECharts() {
        if (!this._registered) {
            echarts.registerCoordinateSystem('maptalks', this._getE3CoordinateSystem(this.getMap()));
            this._registered = true;
        }
        var series = this.layer._ecOptions.series;
        if (series) {
            for (var i = series.length - 1; i >= 0; i--) {
                //change coordinateSystem to maptalks
                series[i]['coordinateSystem'] = 'maptalks';
                //disable update animations
                series[i]['animation'] = false;
            }
        }
    };

    _class.prototype._createLayerContainer = function _createLayerContainer() {
        var container = this._container = maptalks.DomUtil.createEl('div');
        container.style.cssText = 'position:absolute;left:0px;top:0px;';
        if (this._zIndex) {
            container.style.zIndex = this._zIndex;
        }
        this._resetContainer();
        var parentContainer = this.layer.options['container'] === 'front' ? this.getMap()._panels['frontLayer'] : this.getMap()._panels['backLayer'];
        parentContainer.appendChild(container);
    };

    _class.prototype._removeLayerContainer = function _removeLayerContainer() {
        if (this._container) {
            maptalks.DomUtil.removeDomNode(this._container);
        }
        delete this._levelContainers;
    };

    _class.prototype._resetContainer = function _resetContainer() {
        var point = this.getMap().offsetPlatform(),
            size = this.getMap().getSize();
        maptalks.DomUtil.offsetDom(this._container, point.multi(-1));
        this._container.style.width = size.width + 'px';
        this._container.style.height = size.height + 'px';
    };

    /**
     * Coordinate System for echarts 3
     * based on echarts's bmap plugin
     * https://github.com/ecomfe/echarts/blob/f383dcc1adb4c7b9e1888bda3fc976561a788020/extension/bmap/BMapCoordSys.js
     */


    _class.prototype._getE3CoordinateSystem = function _getE3CoordinateSystem(map) {
        var CoordSystem = function CoordSystem(map) {
            this.map = map;
            this._mapOffset = [0, 0];
        };

        CoordSystem.create = function (ecModel /*, api*/) {
            ecModel.eachSeries(function (seriesModel) {
                if (seriesModel.get('coordinateSystem') === 'maptalks') {
                    seriesModel.coordinateSystem = new CoordSystem(map);
                }
            });
        };

        maptalks.Util.extend(CoordSystem.prototype, {
            dimensions: ['x', 'y'],

            setMapOffset: function setMapOffset(mapOffset) {
                this._mapOffset = mapOffset;
            },
            dataToPoint: function dataToPoint(data) {
                var coord = new maptalks.Coordinate(data);
                var px = this.map.coordinateToContainerPoint(coord);
                var mapOffset = this._mapOffset;
                return [px.x - mapOffset[0], px.y - mapOffset[1]];
            },
            pointToData: function pointToData(pt) {
                var mapOffset = this._mapOffset;
                var data = this.map.containerPointToCoordinate({
                    x: pt[0] + mapOffset[0],
                    y: pt[1] + mapOffset[1]
                });
                return [data.x, data.y];
            },
            getViewRect: function getViewRect() {
                var size = this.map.getSize();
                return new echarts.graphic.BoundingRect(0, 0, size.width, size.height);
            },
            getRoamTransform: function getRoamTransform() {
                return echarts.matrix.create();
            }
        });

        return CoordSystem;
    };

    _class.prototype.getEvents = function getEvents() {
        return {
            '_zoomstart': this.onZoomStart,
            '_zoomend': this.onZoomEnd,
            '_moveend': this.onMoveEnd,
            '_resize': this._clearAndRedraw
        };
    };

    _class.prototype.onMoveEnd = function onMoveEnd() {
        if (!this.layer.isVisible()) {
            return;
        }
        this._resetContainer();
        this._ec.resize();
    };

    _class.prototype._clearAndRedraw = function _clearAndRedraw() {
        if (!this.layer.isVisible()) {
            return;
        }
        this._ec.clear();
        this._resetContainer();
        this._ec.resize();
        this.render();
    };

    _class.prototype.onZoomStart = function onZoomStart() {
        if (!this.layer.isVisible()) {
            return;
        }
        this.hide();
    };

    _class.prototype.onZoomEnd = function onZoomEnd() {
        if (!this.layer.isVisible()) {
            return;
        }
        this.show();
    };

    return _class;
}());

exports.E3Layer = E3Layer;

Object.defineProperty(exports, '__esModule', { value: true });

})));
