sap.ui.define([
	"sap/ui/core/library",
	"sap/ui/core/UIComponent",
	"./model/models",
	"sap/ui/core/routing/History",
	"sap/ui/Device",
	"sap/ui/model/resource/ResourceModel"
], function(library, UIComponent, models, History, Device) {
	"use strict";

    return UIComponent.extend("projectpruebaodata.Component", {
		metadata: {
			manifest: "json",
			interfaces: [library.IAsyncContentCreation]
		},

		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			//se crean los accesos a los odatas definidos en el Manifest
			this.setModel(this.getModel("login"), "login");
			//this.setModel(this.getModel("loginHistorico"), "loginHistorico");


			// create the views based on the url/hash
			this.getRouter().initialize();



		},

		myNavBack: function () {
			var oHistory = History.getInstance();
			var oPrevHash = oHistory.getPreviousHash();
			if (oPrevHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("masterSettings", {}, true);
			}
		},

		getContentDensityClass: function () {
			if (!this._sContentDensityClass) {
				if (!Device.support.touch){
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},
		getDataModel:function(sModel){

			return this.getModel(sModel);
			
		}
	});
});
