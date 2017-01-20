import * as maptalks from 'maptalks';
import echarts from 'echarts';

const options = {
    'container' : 'front',
    'renderer' : 'dom'
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
export class E3Layer extends maptalks.Layer {

    constructor(id, ecOptions, options) {
        super(id, options);
        this._ecOptions = ecOptions;
    }

    getEChartsOption() {
        return this._ecOptions;
    }

    setEChartsOption(ecOption) {
        this._ecOptions = ecOption;
        if (this._getRenderer()) {
            this._getRenderer()._clearAndRedraw();
        }
        return this;
    }

    /**
     * Export the E3Layer's JSON.
     * @return {Object} layer's JSON
     */
    toJSON() {
        return {
            'type'      : this.getJSONType(),
            'id'        : this.getId(),
            'ecOptions' : this._ecOptions,
            'options'   : this.config()
        };
    }

    /**
     * Reproduce a E3Layer from layer's JSON.
     * @param  {Object} json - layer's JSON
     * @return {maptalks.E3Layer}
     * @static
     * @private
     * @function
     */
    static fromJSON(json) {
        if (!json || json['type'] !== this.getJSONType()) { return null; }
        return new E3Layer(json['id'], json['ecOptions'], json['options']);
    }
}

E3Layer.mergeOptions(options);

E3Layer.registerJSONType('E3Layer');

E3Layer.registerRenderer('dom', class {

    constructor(layer) {
        this.layer = layer;
    }

    render() {
        if (!this._container) {
            this._createLayerContainer();
            this._ec = echarts.init(this._container);
            this._prepareECharts();
        }
        this._ec.setOption(this.layer._ecOptions, false);
        this.layer.fire('layerload');
    }

    getMap() {
        return this.layer.getMap();
    }

    show() {
        if (this._container) {
            this._clearAndRedraw();
            this._container.style.display = '';
        }
    }

    hide() {
        if (this._container) {
            this._container.style.display = 'none';
            this.clear();
        }
    }

    remove() {
        this._ec.clear();
        this._ec.dispose();
        delete this._ec;
        this._removeLayerContainer();
    }

    clear() {
        this._ec.clear();
    }

    setZIndex(z) {
        this._zIndex = z;
        if (this._container) {
            this._container.style.zIndex = z;

        }
    }

    isCanvasRender() {
        return false;
    }

    _prepareECharts() {
        if (!this._registered) {
            echarts.registerCoordinateSystem(
                'maptalks', this._getE3CoordinateSystem(this.getMap())
            );
            this._registered = true;
        }
        const series = this.layer._ecOptions.series;
        if (series) {
            for (var i = series.length - 1; i >= 0; i--) {
                //change coordinateSystem to maptalks
                series[i]['coordinateSystem'] = 'maptalks';
                //disable update animations
                series[i]['animation'] = false;
            }
        }
    }

    _createLayerContainer() {
        const container = this._container = maptalks.DomUtil.createEl('div');
        container.style.cssText = 'position:absolute;left:0px;top:0px;';
        if (this._zIndex) {
            container.style.zIndex = this._zIndex;
        }
        this._resetContainer();
        const parentContainer = this.layer.options['container'] === 'front' ? this.getMap()._panels['frontLayer'] : this.getMap()._panels['backLayer'];
        parentContainer.appendChild(container);
    }

    _removeLayerContainer() {
        if (this._container) {
            maptalks.DomUtil.removeDomNode(this._container);
        }
        delete this._levelContainers;
    }

    _resetContainer() {
        var point = this.getMap().offsetPlatform(),
            size = this.getMap().getSize();
        maptalks.DomUtil.offsetDom(this._container, point.multi(-1));
        this._container.style.width = size.width + 'px';
        this._container.style.height = size.height + 'px';
    }

    /**
     * Coordinate System for echarts 3
     * based on echarts's bmap plugin
     * https://github.com/ecomfe/echarts/blob/f383dcc1adb4c7b9e1888bda3fc976561a788020/extension/bmap/BMapCoordSys.js
     */
    _getE3CoordinateSystem(map) {
        var CoordSystem = function (map) {
            this.map = map;
            this._mapOffset = [0, 0];
        };

        CoordSystem.create = function (ecModel/*, api*/) {
            ecModel.eachSeries(function (seriesModel) {
                if (seriesModel.get('coordinateSystem') === 'maptalks') {
                    seriesModel.coordinateSystem = new CoordSystem(map);
                }
            });
        };

        maptalks.Util.extend(CoordSystem.prototype, {
            dimensions: ['x', 'y'],

            setMapOffset(mapOffset) {
                this._mapOffset = mapOffset;
            },

            dataToPoint(data) {
                var coord = new maptalks.Coordinate(data);
                var px = this.map.coordinateToContainerPoint(coord);
                var mapOffset = this._mapOffset;
                return [px.x - mapOffset[0], px.y - mapOffset[1]];
            },

            pointToData(pt) {
                var mapOffset = this._mapOffset;
                var data = this.map.containerPointToCoordinate({
                    x: pt[0] + mapOffset[0],
                    y: pt[1] + mapOffset[1]
                });
                return [data.x, data.y];
            },

            getViewRect() {
                var size = this.map.getSize();
                return new echarts.graphic.BoundingRect(0, 0, size.width, size.height);
            },

            getRoamTransform() {
                return echarts.matrix.create();
            }
        });

        return CoordSystem;
    }

    getEvents() {
        return {
            '_zoomstart' : this.onZoomStart,
            '_zoomend'   : this.onZoomEnd,
            '_moveend'   : this.onMoveEnd,
            '_resize'    : this._clearAndRedraw
        };
    }

    onMoveEnd() {
        if (!this.layer.isVisible()) {
            return;
        }
        this._resetContainer();
        this._ec.resize();
    }

    _clearAndRedraw() {
        if (!this.layer.isVisible()) {
            return;
        }
        this._ec.clear();
        this._resetContainer();
        this._ec.resize();
        this.render();
    }

    onZoomStart() {
        if (!this.layer.isVisible()) {
            return;
        }
        this.hide();
    }

    onZoomEnd() {
        if (!this.layer.isVisible()) {
            return;
        }
        this.show();
    }
});
