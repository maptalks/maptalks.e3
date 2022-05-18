/*!
 * maptalks.e3 v0.5.1
 * LICENSE : MIT
 * (c) 2016-2022 maptalks.com
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('maptalks'), require('echarts')) :
  typeof define === 'function' && define.amd ? define(['exports', 'maptalks', 'echarts'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.maptalks = {}, global.maptalks, global.echarts));
})(this, (function (exports, maptalks, echarts) { 'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () { return e[k]; }
          });
        }
      });
    }
    n["default"] = e;
    return Object.freeze(n);
  }

  var maptalks__namespace = /*#__PURE__*/_interopNamespace(maptalks);
  var echarts__namespace = /*#__PURE__*/_interopNamespace(echarts);

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;

    _setPrototypeOf(subClass, superClass);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  var options = {
    'container': 'front',
    'renderer': 'dom',
    'hideOnZooming': false,
    'hideOnMoving': false,
    'hideOnRotating': false
  };
  var E3Layer = function (_maptalks$Layer) {
    _inheritsLoose(E3Layer, _maptalks$Layer);

    function E3Layer(id, ecOptions, options) {
      var _this;

      _this = _maptalks$Layer.call(this, id, options) || this;
      _this._ecOptions = ecOptions;
      return _this;
    }

    var _proto = E3Layer.prototype;

    _proto.getEChartsOption = function getEChartsOption() {
      return this._ecOptions;
    };

    _proto.setEChartsOption = function setEChartsOption(ecOption) {
      this._ecOptions = ecOption;

      if (this._getRenderer()) {
        this._getRenderer()._clearAndRedraw();
      }

      return this;
    };

    _proto.getEChartsInstance = function getEChartsInstance() {
      if (this._getRenderer()) {
        return this._getRenderer()._ec;
      }

      return null;
    };

    _proto.toJSON = function toJSON() {
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
  }(maptalks__namespace.Layer);
  E3Layer.mergeOptions(options);
  E3Layer.registerJSONType('E3Layer');
  E3Layer.registerRenderer('dom', function () {
    function _class(layer) {
      this.layer = layer;
    }

    var _proto2 = _class.prototype;

    _proto2.render = function render() {
      if (!this._container) {
        this._createLayerContainer();
      }

      if (!this._ec) {
        this._ec = echarts__namespace.init(this._container);

        this._prepareECharts();

        this._ec.setOption(this.layer._ecOptions, false);
      } else if (this._isVisible()) {
        this._ec.resize();
      }

      this.layer.fire('layerload');
    };

    _proto2.drawOnInteracting = function drawOnInteracting() {
      if (this._isVisible()) {
        this._ec.resize();
      }
    };

    _proto2.needToRedraw = function needToRedraw() {
      var map = this.getMap();

      var renderer = map._getRenderer();

      return map.isInteracting() || renderer && (renderer.isStateChanged && renderer.isStateChanged() || renderer.isViewChanged && renderer.isViewChanged());
    };

    _proto2.getMap = function getMap() {
      return this.layer.getMap();
    };

    _proto2._isVisible = function _isVisible() {
      return this._container && this._container.style.display === '';
    };

    _proto2.show = function show() {
      if (this._container) {
        this._container.style.display = '';
      }
    };

    _proto2.hide = function hide() {
      if (this._container) {
        this._container.style.display = 'none';
      }
    };

    _proto2.remove = function remove() {
      this._ec.clear();

      this._ec.dispose();

      delete this._ec;

      this._removeLayerContainer();
    };

    _proto2.clear = function clear() {
      this._ec.clear();
    };

    _proto2.setZIndex = function setZIndex(z) {
      this._zIndex = z;

      if (this._container) {
        this._container.style.zIndex = z;
      }
    };

    _proto2.isCanvasRender = function isCanvasRender() {
      return false;
    };

    _proto2._prepareECharts = function _prepareECharts() {
      if (!this._registered) {
        this._coordSystemName = 'maptalks' + maptalks__namespace.Util.GUID();
        echarts__namespace.registerCoordinateSystem(this._coordSystemName, this._getE3CoordinateSystem(this.getMap()));
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

    _proto2._createLayerContainer = function _createLayerContainer() {
      var container = this._container = maptalks__namespace.DomUtil.createEl('div');
      container.style.cssText = 'position:absolute;left:0px;top:0px;';

      if (this._zIndex) {
        container.style.zIndex = this._zIndex;
      }

      this._resetContainer();

      var parentContainer = this.layer.options['container'] === 'front' ? this.getMap()._panels['frontStatic'] : this.getMap()._panels['backStatic'];
      parentContainer.appendChild(container);
    };

    _proto2._removeLayerContainer = function _removeLayerContainer() {
      if (this._container) {
        maptalks__namespace.DomUtil.removeDomNode(this._container);
      }

      delete this._levelContainers;
    };

    _proto2._resetContainer = function _resetContainer() {
      var size = this.getMap().getSize();
      this._container.style.width = size.width + 'px';
      this._container.style.height = size.height + 'px';
    };

    _proto2._getE3CoordinateSystem = function _getE3CoordinateSystem(map) {
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
      maptalks__namespace.Util.extend(CoordSystem.prototype, {
        dimensions: ['x', 'y'],
        setMapOffset: function setMapOffset(mapOffset) {
          this._mapOffset = mapOffset;
        },
        dataToPoint: function dataToPoint(data) {
          var coord = new maptalks__namespace.Coordinate(data);
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
          return new echarts__namespace.graphic.BoundingRect(0, 0, size.width, size.height);
        },
        getRoamTransform: function getRoamTransform() {
          return echarts__namespace.matrix.create();
        }
      });
      return CoordSystem;
    };

    _proto2.getEvents = function getEvents() {
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

    _proto2._clearAndRedraw = function _clearAndRedraw() {
      if (this._container && this._container.style.display === 'none') {
        return;
      }

      this._ec.clear();

      this._ec.resize();

      this._prepareECharts();

      this._ec.setOption(this.layer._ecOptions, false);
    };

    _proto2.onZoomStart = function onZoomStart() {
      if (!this.layer.options['hideOnZooming']) {
        return;
      }

      this.hide();
    };

    _proto2.onZoomEnd = function onZoomEnd() {
      if (!this.layer.options['hideOnZooming']) {
        return;
      }

      this.show();

      this._clearAndRedraw();
    };

    _proto2.onDragRotateStart = function onDragRotateStart() {
      if (!this.layer.options['hideOnRotating']) {
        return;
      }

      this.hide();
    };

    _proto2.onDragRotateEnd = function onDragRotateEnd() {
      if (!this.layer.options['hideOnRotating']) {
        return;
      }

      this.show();

      this._clearAndRedraw();
    };

    _proto2.onMoveStart = function onMoveStart() {
      if (!this.layer.options['hideOnMoving']) {
        return;
      }

      this.hide();
    };

    _proto2.onMoveEnd = function onMoveEnd() {
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

}));
