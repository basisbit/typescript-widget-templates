var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define(["require", "exports", "jimu/WidgetManager", "dojo/_base/lang", "dojo/_base/html", "./SelectWidget"], function (require, exports, WidgetManager, lang, html, SelectWidget) {
    "use strict";
    var Widget = (function (_super) {
        __extends(Widget, _super);
        function Widget(args) {
            var _this = _super.call(this, lang.mixin({ baseClass: "jimu-widget-select" }, args)) || this;
            _this.fetchDataByName(_this.config.remoteControlledBy);
            console.log(_this.widgetName + ' constructor');
            return _this;
        }
        Widget.prototype.startup = function () {
            _super.prototype.startup.call(this);
            console.log(this.widgetName + ' startup', this.config, this.map);
        };
        Widget.prototype.postCreate = function () {
            _super.prototype.postCreate.call(this);
            console.log(this.widgetName + ' postCreate', this.config);
        };
        Widget.prototype.onOpen = function () {
            _super.prototype.onOpen.call(this);
            console.log(this.widgetName + ' onOpen');
        };
        Widget.prototype.onClose = function () {
            _super.prototype.onClose.call(this);
            console.log(this.widgetName + ' onClose');
        };
        Widget.prototype.onMinimize = function () {
            _super.prototype.onMinimize.call(this);
            console.log(this.widgetName + ' onMinimize');
        };
        Widget.prototype.onMaximize = function () {
            _super.prototype.onMaximize.call(this);
            console.log(this.widgetName + ' onMaximize');
        };
        Widget.prototype.onSignIn = function (credential) {
            _super.prototype.onSignIn.call(this);
            /* jshint unused:false*/
            console.log(this.widgetName + ' onSignIn');
        };
        Widget.prototype.onSignOut = function () {
            _super.prototype.onSignOut.call(this);
            console.log(this.widgetName + ' onSignOut');
        };
        Widget.prototype.onReceiveData = function (name, widgetId, data, historyData) {
            console.log(this.manifest.name + " received a '" + data.command + "' command from " + name + ".", widgetId, historyData);
            this.callingWidgetId = widgetId;
            if (data.command == "selectBufferPoint") {
                // uncheck other layers
                this.layerItems.map(function (layerItem) {
                    if (layerItem.featureLayer !== data.layer) {
                        html.removeClass(layerItem.selectableCheckBox, 'checked');
                    }
                });
                // select layer
                this.selectDijit.setFeatureLayers([data.layer]);
                // open RemoteSelect widget
                var ws = WidgetManager.getInstance();
                ws.triggerWidgetOpen(this.id);
                // after making the selection, return to original widget ("widgetId" parameter) and trigger buffer operation there
                this.selectionCompleteEventHandler = this.selectionCompleteBackToBuffer;
                data.layer.on("selection-complete", lang.hitch(this, this.selectionCompleteEventHandler));
            }
        };
        Widget.prototype.selectionCompleteBackToBuffer = function (selection) {
            if (this.callingWidgetId) {
                if (selection.features.length > 0) {
                    this.publishData({
                        command: "generateBuffers"
                    });
                    var ws = WidgetManager.getInstance();
                    ws.triggerWidgetOpen(this.callingWidgetId);
                    this.selectionCompleteEventHandler = undefined; // DOES NOT REMOVE THE EVENT HANDLER
                    // KRÜCKE: There is no way to remove the event handler, and it will trigger also when directly using the widget outside the workflow... 
                    // It won't do anything without a callingWidgetId, but every time the RemoteSelect widget is opened, another event handler is added.. :(
                    this.callingWidgetId = undefined;
                }
            }
        };
        return Widget;
    }(SelectWidget));
    return Widget;
});
//# sourceMappingURL=Widget.js.map