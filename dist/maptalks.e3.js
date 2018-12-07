/*!
 * maptalks.e3 v0.4.5
 * LICENSE : MIT
 * (c) 2016-2017 maptalks.org
 */
/*!
 * requires maptalks@^0.25.0 
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks'), require('echarts')) :
	typeof define === 'function' && define.amd ? define(['exports', 'maptalks', 'echarts'], factory) :
	(factory((global.maptalks = global.maptalks || {}),global.maptalks,global.echarts));
}(this, (function (exports,maptalks,echarts) { 'use strict';

function _defaults(obj, defaults) { var keys = Object.getOwnPropertyNames(defaults); for (var i = 0; i < keys.length; i++) { var key = keys[i]; var value = Object.getOwnPropertyDescriptor(defaults, key); if (value && value.configurable && obj[key] === undefined) { Object.defineProperty(obj, key, value); } } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : _defaults(subClass, superClass); }

var options = {
    'container': 'front',
    'renderer': 'dom',
    'hideOnZooming': false,
    'hideOnMoving': false,
    'hideOnRotating': false
};

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

    E3Layer.prototype.toJSON = function toJSON() {
        return {
            'type': this.getJSONType(),
            'id': this.getId(),
            'ecOptions': this._ecOptions,
            'options': this.config()
        };
    };

    E3Layer.fromJSON = function fromJSON(json) {
        if (!json || json['type'] !== 'E3Layer') {
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
        }
        if (!this._ec) {
            this._ec = echarts.init(this._container);
            this._prepareECharts();
            this._ec.setOption(this.layer._ecOptions, false);
        } else if (this._isVisible()) {
            this._ec.resize();
        }
        this.layer.fire('layerload');
    };

    _class.prototype.drawOnInteracting = function drawOnInteracting() {
        if (this._isVisible()) {
            this._ec.resize();
        }
    };

    _class.prototype.needToRedraw = function needToRedraw() {
        var map = this.getMap();
        var renderer = map._getRenderer();
        return map.isInteracting() || renderer && (renderer.isStateChanged && renderer.isStateChanged() || renderer.isViewChanged && renderer.isViewChanged());
    };

    _class.prototype.getMap = function getMap() {
        return this.layer.getMap();
    };

    _class.prototype._isVisible = function _isVisible() {
        return this._container && this._container.style.display === '';
    };

    _class.prototype.show = function show() {
        if (this._container) {
            this._container.style.display = '';
        }
    };

    _class.prototype.hide = function hide() {
        if (this._container) {
            this._container.style.display = 'none';
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
            this._coordSystemName = 'maptalks' + maptalks.Util.GUID();
            echarts.registerCoordinateSystem(this._coordSystemName, this._getE3CoordinateSystem(this.getMap()));
            this._registered = true;
        }
        var series = this.layer._ecOptions.series;
        if (series) {
            for (var i = series.length - 1; i >= 0; i--) {
                series[i]['coordinateSystem'] = this._coordSystemName;

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
        var parentContainer = this.layer.options['container'] === 'front' ? this.getMap()._panels['frontStatic'] : this.getMap()._panels['backStatic'];
        parentContainer.appendChild(container);
    };

    _class.prototype._removeLayerContainer = function _removeLayerContainer() {
        if (this._container) {
            maptalks.DomUtil.removeDomNode(this._container);
        }
        delete this._levelContainers;
    };

    _class.prototype._resetContainer = function _resetContainer() {
        var size = this.getMap().getSize();

        this._container.style.width = size.width + 'px';
        this._container.style.height = size.height + 'px';
    };

    _class.prototype._getE3CoordinateSystem = function _getE3CoordinateSystem(map) {
        var CoordSystem = function CoordSystem(map) {
            this.map = map;
            this._mapOffset = [0, 0];
        };
        var me = this;
        CoordSystem.create = function (ecModel) {
            ecModel.eachSeries(function (seriesModel) {
                if (seriesModel.get('coordinateSystem') === me._coordSystemName) {
                    seriesModel.coordinateSystem = new CoordSystem(map);
                }
            });
        };

        CoordSystem.getDimensionsInfo = function () {
            return ['x', 'y'];
        };

        CoordSystem.dimensions = ['x', 'y'];

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
            '_dragrotatestart': this.onDragRotateStart,
            '_dragrotateend': this.onDragRotateEnd,
            '_movestart': this.onMoveStart,
            '_moveend': this.onMoveEnd,
            '_resize': this._resetContainer
        };
    };

    _class.prototype._clearAndRedraw = function _clearAndRedraw() {
        if (this._container && this._container.style.display === 'none') {
            return;
        }
        this._ec.clear();
        this._ec.resize();
        this._prepareECharts();
        this._ec.setOption(this.layer._ecOptions, false);
    };

    _class.prototype.onZoomStart = function onZoomStart() {
        if (!this.layer.options['hideOnZooming']) {
            return;
        }
        this.hide();
    };

    _class.prototype.onZoomEnd = function onZoomEnd() {
        if (!this.layer.options['hideOnZooming']) {
            return;
        }
        this.show();
        this._clearAndRedraw();
    };

    _class.prototype.onDragRotateStart = function onDragRotateStart() {
        if (!this.layer.options['hideOnRotating']) {
            return;
        }
        this.hide();
    };

    _class.prototype.onDragRotateEnd = function onDragRotateEnd() {
        if (!this.layer.options['hideOnRotating']) {
            return;
        }
        this.show();
        this._clearAndRedraw();
    };

    _class.prototype.onMoveStart = function onMoveStart() {
        if (!this.layer.options['hideOnMoving']) {
            return;
        }
        this.hide();
    };

    _class.prototype.onMoveEnd = function onMoveEnd() {
        if (!this.layer.options['hideOnMoving']) {
            return;
        }
        this.show();
        this._clearAndRedraw();
    };

    return _class;
}());

exports.E3Layer = E3Layer;

Object.defineProperty(exports, '__esModule', { value: true });

typeof console !== 'undefined' && console.log('maptalks.e3 v0.4.5, requires maptalks@^0.25.0.');

})));
