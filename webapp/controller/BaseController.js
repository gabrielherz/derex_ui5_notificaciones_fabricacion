sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/util/Storage"
], function(Controller, UIComponent, Storage) {
	"use strict";

	return Controller.extend("projectpruebaodata.controller.BaseController", {
			 
			 /**
			 * Se vuelve al login verificando la cocokie 
			 * @public
			 */
			//backToLogin: function(session,_View){
				backToLogin: function(){
				//verifico si mis coockies de sesión han sido guardadas, es decir, si me he logueado recientemente
				var oStorage = new Storage(Storage.Type.session, "login");
				//si no existe al menos la orden que siempre va a estar guardada, es porque se ha salido de la sesión
				if (!oStorage.get("idorden")){
	  /*              var loRouter =this.getOwnerComponent().getRouter();
					loRouter.nav.to("login");
	*/
					var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
					oRouter.navTo("login", {} );
					
				}
			},	
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter : function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel : function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel : function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Returns a promises which resolves with the resource bundle value of the given key <code>sI18nKey</code>
		 *
		 * @public
		 * @param {string} sI18nKey The key
		 * @param {sap.ui.core.model.ResourceModel} oResourceModel The resource model
		 * @param {string[]} [aPlaceholderValues] The values which will repalce the placeholders in the i18n value
		 * @returns {Promise<string>} The promise
		 */
		getBundleTextByModel: function(sI18nKey, oResourceModel, aPlaceholderValues){
			return oResourceModel.getResourceBundle().then(function(oBundle){
				return oBundle.getText(sI18nKey, aPlaceholderValues);
			});
		}
	});

});