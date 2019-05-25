/*
    ArcGIS Widget
    ========================

    @file      : arcgis.js
    @version   : 1.2.1
    @author    : Ivo Sturm
    @date      : 30-01-2019
    @copyright : First Consulting
    @license   : Apache v2
	
	Documentation
	========================	
	This widget caters for simple usage of predefined ArcGIS layers, using the JavaScript API. The full API is loaded into the filesystem, because it gave too many problems with the Mendix Dojo implementation.
	
	Releases
	========================
	v1.0	First version. Features supported: 
	- Loosely connect ArcGIS and Mendix database with single ArcGIS ObjectID in Mendix;
	- Plot both Map Server and Feature Server Layers;
	- Toggling Layer visibility;
	- Show all objects in Layer or only restrict to objects in Mendix
		o	XPath;
		o	DataSource;
		o	ListenToGrid;
	- Fully customize InfoWindow;
		o	On Click Microflow to trigger Mendix logic from infowindow;
	- Customize marker by changing symbol and color;
	- Legend;
		o	Set a label in the legend per Color
	- Search widget with autocomplete to easily zoom to certain address;
	- Custom styling settings to incorporate company specific coloring;
	
	v1.1.0	Upgrade to Mendix 7
	- change in lib/esri/kernel.js file
	- introduced relative paths for all libraries loaded, since in Mendix 7 Mendix sometimes tried to retrieve from clientsystem instead of ArcGIS folders..
	- got rid of deprecated store.caller and changed it to origin.
	
	v1.1.1
	- added enabling / disabling for custom styling of polygons (coloring) and point (coloring + marker type)
	
	v1.2.0
	- no change, only updated uglified js version which gave multiDefine errors
	
	v1.2.1
	- changed relative path for dojox folders to ArcGIS/lib/dojox since as of Mendix 7.22 some dojox modules have been removed from Mendix hence should be retrieved from widget instead.
 	
	Not in this version
	========================
	- Editing / Drawing
	- Authentication
		
*/
var dojoConfig = {
    async: false,
    locale: 'en',
    paths: {
        'react': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react.min',
        'react-dom': 'https://cdnjs.cloudflare.com/ajax/libs/react/15.5.4/react-dom.min',
        'openlayers': 'https://cdnjs.cloudflare.com/ajax/libs/ol3/4.1.0/ol',
        'dojox': '../../widgets/ArcGIS/lib/dojox',
        'esri': '../../widgets/ArcGIS/lib/esri',
        'moment': '../../widgets/ArcGIS/lib/moment'
    }
};

require(dojoConfig, [], function () {
    return define("ArcGIS/widget/ArcGIS",

        // it is import to load the js files in the correct order. So, if js file A needs B, first load B then A, else Mendix will search for the file in it's own filesystem / mxclientsystem and will fail
        [
            'dojo/_base/declare',
            'mxui/dom',
            'dojo/dom',
            'dojo/on',
            'dojo/dom-class',
            'dojo/parser',
            'mxui/widget/_WidgetBase',
            'dijit/_TemplatedMixin',
            'dojo/dom-style',
            'dojo/dom-construct',
            'dojo/_base/array',
            'dojo/_base/event',
            'dojo/_base/lang',
            'dojo/_base/unload',
            'dojo/cookie',
            'dojo/json',
            'dijit/registry',
            'dojo/text!./template/ArcGIS.html',
            'dojo/Deferred',
            // now all ArcGIS files
            'ArcGIS/lib/dojox/gfx/Mover',
            'ArcGIS/lib/dojox/gfx/Moveable',
            'ArcGIS/lib/dojox/gfx/_base',
            'ArcGIS/lib/dojox/gfx/matrix',
            'ArcGIS/lib/dojox/gfx/renderer',
            'ArcGIS/lib/dojox/gfx/svg',
            'ArcGIS/lib/dojox/gfx/filters',
            'ArcGIS/lib/dojox/gfx/svgext',
            'ArcGIS/lib/dojox/gfx',
            'ArcGIS/lib/dojox/collections/_base',
            'ArcGIS/lib/dojox/collections/ArrayList',
            'ArcGIS/lib/dojox/grid/util',
            'dojox/main',
            'ArcGIS/lib/dojox/grid/cells/_base',
            'ArcGIS/lib/dojox/grid/cells',
            'ArcGIS/lib/dojox/grid/_Events',
            'ArcGIS/lib/dojox/grid/_Scroller',
            'ArcGIS/lib/dojox/html/metrics',
            'ArcGIS/lib/dojox/grid/_Builder',
            'ArcGIS/lib/dojox/grid/_View',
            'ArcGIS/lib/dojox/grid/Selection',
            'ArcGIS/lib/dojox/grid/_SelectionPreserver',
            'ArcGIS/lib/dojox/grid/DataSelection',
            'ArcGIS/lib/dojox/grid/_RowSelector',
            'ArcGIS/lib/dojox/grid/_Layout',
            'ArcGIS/lib/dojox/grid/_ViewManager',
            'ArcGIS/lib/dojox/grid/_RowManager',
            'ArcGIS/lib/dojox/grid/_FocusManager',
            'ArcGIS/lib/dojox/grid/_EditManager',
            'ArcGIS/lib/dojox/grid/_Grid',
            'ArcGIS/lib/dojox/grid/DataGrid',
            'ArcGIS/lib/dojox/html/entities',
            'ArcGIS/lib/esri/nls/jsapi',
            'ArcGIS/lib/esri/kernel',
            'ArcGIS/lib/esri/lang',
            'ArcGIS/lib/esri/deferredUtils',
            'ArcGIS/lib/esri/config',
            'ArcGIS/lib/esri/SpatialReference',
            'ArcGIS/lib/esri/ImageSpatialReference',
            'ArcGIS/lib/esri/geometry/Geometry',
            'ArcGIS/lib/esri/sniff',
            'ArcGIS/lib/esri/srUtils',
            'ArcGIS/lib/esri/WKIDUnitConversion',
            'ArcGIS/lib/esri/geometry/scaleUtils',
            'ArcGIS/lib/esri/geometry/Point',
            'ArcGIS/lib/esri/geometry/ScreenPoint',
            'ArcGIS/lib/esri/geometry/webMercatorUtils',
            'ArcGIS/lib/esri/geometry/mathUtils',
            'ArcGIS/lib/esri/geometry/Extent',
            'ArcGIS/lib/esri/geometry/Polyline',
            'ArcGIS/lib/esri/geometry/Polygon',
            'ArcGIS/lib/esri/geometry/Multipoint',
            'ArcGIS/lib/esri/geometry/screenUtils',
            'ArcGIS/lib/esri/geometry/geodesicUtils',
            'ArcGIS/lib/esri/geometry/jsonUtils',
            'ArcGIS/lib/esri/geometry/normalizeUtils',
            'ArcGIS/lib/esri/geometry/Rect',
            'ArcGIS/lib/esri/units',
            'ArcGIS/lib/esri/geometry',
            'ArcGIS/lib/esri/basemaps',
            'ArcGIS/lib/esri/Evented',
            'ArcGIS/lib/esri/fx',
            'ArcGIS/lib/esri/tileUtils',
            'ArcGIS/lib/esri/urlUtils',
            'ArcGIS/lib/esri/PluginTarget',
            'ArcGIS/lib/esri/Color',
            'ArcGIS/lib/esri/arcade/ImmutableArray',
            'ArcGIS/lib/esri/core/tsSupport/extendsHelper',
            'ArcGIS/lib/esri/arcade/ImmutablePointArray',
            'ArcGIS/lib/esri/arcade/ImmutablePathArray',
            'ArcGIS/lib/moment/moment',
            'ArcGIS/lib/esri/plugins/moment',
            'ArcGIS/lib/esri/moment',
            'ArcGIS/lib/esri/arcade/FunctionWrapper',
            'ArcGIS/lib/esri/arcade/languageUtils',
            'ArcGIS/lib/esri/arcade/Dictionary',
            'ArcGIS/lib/esri/layers/gfxSniff',
            'ArcGIS/lib/esri/request',
            'ArcGIS/lib/esri/layers/layer',
            'ArcGIS/lib/esri/domUtils',
            'ArcGIS/lib/esri/symbols/Symbol',
            'ArcGIS/lib/esri/symbols/MarkerSymbol',
            'ArcGIS/lib/esri/symbols/LineSymbol',
            'ArcGIS/lib/esri/symbols/SimpleLineSymbol',
            'ArcGIS/lib/esri/symbols/SimpleMarkerSymbol',
            'ArcGIS/lib/esri/layers/GraphicsLayer',
            'ArcGIS/lib/esri/layers/LOD',
            'ArcGIS/lib/esri/layers/TileInfo',
            'ArcGIS/lib/esri/layers/TimeReference',
            'ArcGIS/lib/esri/TimeExtent',
            'ArcGIS/lib/esri/layers/LayerTimeOptions',
            'ArcGIS/lib/esri/layers/TimeInfo',
            'ArcGIS/lib/esri/layers/LayerInfo',
            'ArcGIS/lib/esri/layerUtils',
            'ArcGIS/lib/esri/layers/ArcGISMapServiceLayer',
            'ArcGIS/lib/esri/layers/ImageParameters',
            'ArcGIS/lib/esri/layers/MapImage',
            'ArcGIS/lib/esri/layers/DynamicMapServiceLayer',
            'ArcGIS/lib/esri/layers/LayerSource',
            'ArcGIS/lib/esri/layers/DataSource',
            'ArcGIS/lib/esri/layers/QueryDataSource',
            'ArcGIS/lib/esri/layers/LayerMapSource',
            'ArcGIS/lib/esri/layers/TableDataSource',
            'ArcGIS/lib/esri/layers/RasterDataSource',
            'ArcGIS/lib/esri/layers/JoinDataSource',
            'ArcGIS/lib/esri/layers/LayerDataSource',
            'ArcGIS/lib/esri/layers/DynamicLayerInfo',
            'ArcGIS/lib/esri/layers/ArcGISDynamicMapServiceLayer',
            'ArcGIS/lib/esri/layers/TiledMapServiceLayer',
            'ArcGIS/lib/esri/layers/TileMap',
            'ArcGIS/lib/esri/layers/ArcGISTiledMapServiceLayer',
            'ArcGIS/lib/esri/layers/MapImageLayer',
            'ArcGIS/lib/esri/layers/OpenStreetMapLayer',
            'ArcGIS/lib/esri/ServerInfo',
            'ArcGIS/lib/esri/OAuthCredential',
            'ArcGIS/lib/esri/arcgis/OAuthInfo',
            'ArcGIS/lib/esri/IdentityManagerBase',
            'ArcGIS/lib/esri/Credential',
            'ArcGIS/lib/esri/IdentityManagerDialog',
            'ArcGIS/lib/esri/OAuthSignInHandler',
            'ArcGIS/lib/esri/IdentityManager',
            'ArcGIS/lib/esri/layers/VectorTileLayerImpl',
            'ArcGIS/lib/esri/layers/VectorTileLayerWrapper',
            //'ArcGIS/lib/esri/layers/VectorTileLayer',
            'ArcGIS/lib/esri/Credential',
            'ArcGIS/lib/esri/InfoTemplate',
            'ArcGIS/lib/esri/InfoWindowBase',
            'ArcGIS/lib/esri/symbols/PictureMarkerSymbol',
            'ArcGIS/lib/esri/symbols/CartographicLineSymbol',
            'ArcGIS/lib/esri/symbols/FillSymbol',
            'ArcGIS/lib/esri/symbols/PictureFillSymbol',
            'ArcGIS/lib/esri/symbols/SimpleFillSymbol',
            'ArcGIS/lib/esri/symbols/Font',
            'ArcGIS/lib/esri/symbols/TextSymbol',
            'ArcGIS/lib/esri/symbols/jsonUtils',
            'ArcGIS/lib/esri/graphic',
            'ArcGIS/lib/esri/tasks/SpatialRelationship',
            'ArcGIS/lib/esri/tasks/query',
            'ArcGIS/lib/esri/PopupBase',
            'ArcGIS/lib/esri/dijit/Popup',
            'ArcGIS/lib/esri/tasks/Task',
            'ArcGIS/lib/esri/graphicsUtils',
            'ArcGIS/lib/esri/tasks/FeatureSet',
            'ArcGIS/lib/esri/tasks/QueryTask',
            'ArcGIS/lib/esri/tasks/RelationshipQuery',
            'ArcGIS/lib/esri/tasks/StatisticDefinition',



            'ArcGIS/lib/esri/dijit/_EventedWidget',
            'ArcGIS/lib/esri/dijit/PopupRenderer',
            'ArcGIS/lib/esri/PopupInfo',
            'ArcGIS/lib/esri/dijit/PopupTemplate',
            'ArcGIS/lib/esri/PopupManager',
            'ArcGIS/lib/esri/plugins/popupManager',
            'ArcGIS/lib/esri/_coremap',
            'ArcGIS/lib/esri/MouseEvents',
            'ArcGIS/lib/esri/TouchEvents',
            'ArcGIS/lib/esri/PointerEvents',
            'ArcGIS/lib/esri/MapNavigationManager',
            'ArcGIS/lib/esri/map',
            'ArcGIS/lib/esri/dijit/Attribution',
            'ArcGIS/lib/esri/OperationBase',
            'ArcGIS/lib/esri/undoManager',
            'ArcGIS/lib/esri/toolbars/_toolbar',
            'ArcGIS/lib/esri/toolbars/navigation',
            'ArcGIS/lib/esri/toolbars/_Box',
            'ArcGIS/lib/esri/toolbars/_GraphicMover',
            'ArcGIS/lib/esri/toolbars/_VertexMover',
            'ArcGIS/lib/esri/toolbars/_VertexEditor',
            'ArcGIS/lib/esri/toolbars/TextEditor',
            'ArcGIS/lib/esri/toolbars/edit',
            'ArcGIS/lib/esri/toolbars/draw',
            'ArcGIS/lib/esri/arcade/Feature',
            'ArcGIS/lib/esri/arcade/functions/string',
            'ArcGIS/lib/esri/arcade/functions/date',
            'ArcGIS/lib/esri/arcade/functions/maths',
            'ArcGIS/lib/esri/arcade/functions/fieldStats',
            'ArcGIS/lib/esri/arcade/functions/stats',
            'ArcGIS/lib/esri/arcade/functions/geometry',
            'ArcGIS/lib/esri/arcade/treeAnalysis',
            'ArcGIS/lib/esri/arcade/arcadeCompiler',
            'ArcGIS/lib/esri/arcade/lib/esprima',
            'ArcGIS/lib/esri/arcade/parser',
            'ArcGIS/lib/esri/arcade/arcadeRuntime',
            'ArcGIS/lib/esri/arcade/arcade',
            'ArcGIS/lib/esri/renderers/arcadeUtils',
            'ArcGIS/lib/esri/renderers/Renderer',
            'ArcGIS/lib/esri/renderers/SimpleRenderer',
            'ArcGIS/lib/esri/renderers/UniqueValueRenderer',
            'ArcGIS/lib/esri/renderers/ClassBreaksRenderer',
            'ArcGIS/lib/esri/renderers/ScaleDependentRenderer',
            'ArcGIS/lib/esri/renderers/DotDensityRenderer',
            'ArcGIS/lib/esri/renderers/HeatmapRenderer',
            'ArcGIS/lib/esri/renderers/TemporalRenderer',
            'ArcGIS/lib/esri/renderers/VectorFieldRenderer',
            'ArcGIS/lib/esri/renderers/SymbolAger',
            'ArcGIS/lib/esri/renderers/TimeClassBreaksAger',
            'ArcGIS/lib/esri/renderers/TimeRampAger',
            'ArcGIS/lib/esri/renderers/jsonUtils',
            'ArcGIS/lib/esri/dijit/_EventedWidget',
            'ArcGIS/lib/esri/dijit/Legend',
            'ArcGIS/lib/esri/tasks/Task',
            'ArcGIS/lib/esri/tasks/IdentifyResult',
            'ArcGIS/lib/esri/tasks/IdentifyParameters',
            'ArcGIS/lib/esri/tasks/IdentifyTask',
            'ArcGIS/lib/esri/layers/Domain',
            'ArcGIS/lib/esri/layers/CodedValueDomain',
            'ArcGIS/lib/esri/layers/RangeDomain',
            'ArcGIS/lib/esri/layers/Field',
            'ArcGIS/lib/esri/layers/InheritedDomain',
            'ArcGIS/lib/esri/layers/FeatureTemplate',
            'ArcGIS/lib/esri/layers/FeatureType',
            'ArcGIS/lib/esri/layers/FeatureEditResult',
            'ArcGIS/lib/esri/symbols/ShieldLabelSymbol',
            'ArcGIS/lib/esri/layers/LabelClass',
            'ArcGIS/lib/esri/layers/RenderMode',
            'ArcGIS/lib/esri/layers/GridLayout',
            'ArcGIS/lib/esri/layers/OnDemandMode',
            'ArcGIS/lib/esri/layers/SnapshotMode',
            'ArcGIS/lib/esri/layers/StreamMode',
            'ArcGIS/lib/esri/layers/SelectionMode',
            'ArcGIS/lib/esri/layers/TrackManager',
            'ArcGIS/lib/esri/layers/HeatmapManager',
            'ArcGIS/lib/esri/layers/FeatureLayer',
            'ArcGIS/lib/esri/layers/LayerDrawingOptions',
            'ArcGIS/lib/esri/dijit/editing/TemplatePickerItem',
            'ArcGIS/lib/esri/dijit/editing/TemplatePicker',
            'ArcGIS/lib/esri/dijit/BasemapToggle',
            'ArcGIS/lib/esri/dijit/BasemapLayer',
            'ArcGIS/lib/esri/dijit/Scalebar',
            'ArcGIS/lib/esri/styles/basic',
            'ArcGIS/lib/esri/tasks/AddressCandidate',
            'ArcGIS/lib/esri/tasks/locator',
            'ArcGIS/lib/esri/promiseList',
            'dojo/text!../lib/esri/dijit/Search/templates/Search.html',
            'ArcGIS/lib/esri/dijit/Search',
            // below libraries are needed, since the dojo parsing from a template is broken as from Mendix 6.10
            'dijit/layout/BorderContainer',
            'dijit/layout/ContentPane',
            'dijit/Toolbar',
            'dijit/form/Button',
            'dijit/layout/AccordionContainer',
            'ArcGIS/lib/esri/arcgis/utils'
        ],
        function (declare, dom, dojoDom, on, domClass, parser, _WidgetBase, _TemplatedMixin, domStyle, domConstruct, arrayUtils, event, lang, baseUnload, cookie, JSON, registry, widgetTemplate) {
            'use strict';

            return declare('ArcGIS.widget.ArcGIS', [_WidgetBase, _TemplatedMixin], {
                // load the HTML template into the widget. Since Mx 6.10 deprecated, use dojo/text! instead
                templateString: widgetTemplate,
                _progressID: null,
                _handle: null,
                _contextObj: null,
                _gisMap: null,
                _defaultPosition: null,
                _logNode: "ArcGIS Widget: ",
                visibleLayerIds: [],
                legendLayers: [],
                arcGisLayerArr: [],
                layerArr: [],
                hostName: null,
                midFix: "/arcgis/rest/services/",
                deferred: null,
                popupTemplate: null,
                _SpatialReference: null,
                queryOutFieldsArr: [],
                fieldInfosArr: [],
                _singleObjectZoom: 12,
                defaultZoom: 3,
                _editBtn: null,
                _removeBtn: null,
                _mfBtn: null,
                _newMxObjects: [],
                _queryDefinition: null,
                _queryLayerObj: null,
                _originalRenderer: null, // used to store updated symbols for graphis in, see renderer functions

                constructor: function (params, srcNodeRef) {
                    if (this.consoleLogging) {
                        console.log(this.id + ".constructor");
                    }
                },
                postCreate: function () {

                    if (this.consoleLogging) {
                        console.log(this.id + ".postCreate");
                    }

                    var mapid = "477a43fcce8f43c5a593366fccdffae0"; // vin map demo
                    //var mapid = "59aa0bd74151487eb0d8484f694189f1";

                    //esri.arcgis.utils.arcgisUrl = "https://dsraenterprise2.canadacentral.cloudapp.azure.com/portal/sharing/content/items";

                    var mapDeferred = esri.arcgis.utils.createMap(mapid, "ArcGIS_widget_ArcGIS_0", {
                        mapOptions: {
                            nav: false,
                            isKeyboardNavigation: true,
                            logo: false
                        }
                    });

                    mapDeferred.then(function (response) {

                        console.log("map has loaded");
                        var map = response.map

                        //add the scalebar
                        console.log("adding Scalebar");
                        var scalebar = new esri.dijit.Scalebar({
                            map: map,
                            scalebarUnit: "english"
                        });

                        // add search
                        debugger;
                        console.log("adding search box");
                        var searchDiv = domConstruct.create('div', {
                            className: 'searchDiv'
                        }, document.getElementsByClassName("mapcontainer")[0]);

                        console.log("adding Search");

                        var search = new esri.dijit.Search({
                            map: map,
                            showInfoWindowOnSelect: true,
                            enableInfoWindow: true
                        }, "searchme");
                        search.startup();

                        console.log("adding legend");

                        var layers = response.itemInfo.itemData.operationalLayers;
                        var layerInfo = [];
                        dojo.forEach(layers, function (layer) {
                            if (!layer.featureCollection) {
                                layerInfo.push({
                                    "layer": layer.layerObject,
                                    "title": layer.title
                                });
                            }
                        });
                        var legendDijit = new esri.dijit.Legend({
                            map: map,
                            layerInfos: layerInfo
                        }, "legendme");
                        legendDijit.startup();

                    });


                },

                update: function (obj, callback) {

                    if (this.consoleLogging) {
                        console.log(this.id + ".update");
                    }

                    callback();
                },


                _execMf: function (mxobj, context) {
                    if (context.consoleLogging) {
                        console.log(context._logNode + "._execMf");
                    }
                    // if called from callback, context from widget is lost, hence set explicitly as context inputparameter
                    var guid = null;
                    if (mxobj) {
                        guid = mxobj.getGuid();
                    }
                    if (guid) {
                        mx.data.action({
                            params: {
                                applyto: 'selection',
                                actionname: context.onClickMF,
                                guids: [guid]
                            },
                            origin: context.mxform,
                            callback: lang.hitch(context, function (obj) {

                            }),
                            error: function (error) {
                                console.debug(error.description);
                            }
                        }, this);
                    }
                },

                uninitialize: function () {
                    if (this.consoleLogging) {
                        console.log(this.id + ".uninitialize");
                    }
                }
            });
        });
});
require(['ArcGIS/widget/ArcGIS'], function () {});
