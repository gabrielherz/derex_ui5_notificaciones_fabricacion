sap.ui.define([
    './BaseController',
    'sap/base/util/deepExtend',
	'../model/formatter',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel',
	'sap/m/ColumnListItem',
	'sap/m/Input',
	'sap/m/MessageToast',
    'sap/ui/model/odata/ODataModel',
    "sap/ui/util/Storage",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function(BaseController,deepExtend, Formatter, Controller, JSONModel, ColumnListItem, Input, MessageToast, ODataModel, Storage, Filter,FilterOperator) {
	"use strict";
	return BaseController.extend("projectpruebaodata.controller.fabricacion", {
		formatter: Formatter,
        
		onInit: function () {
           
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            //obtiene el nombre de la vista y lo extrae del namespace con pop, luego lo pasa a getRoute para así obtener su route y su target indicado en el manifest
            oRouter.getRoute(this.getMetadata().getName().split('.').pop());
            //oRouter.getRoute("fabricacion").attachMatched(this.backToLogin, this);
            //this.backToLogin(Storage.Type.session, this);
            var _this=this;
            this.url = "http://dxsapdev.derex:8010" + this.getOwnerComponent().getManifestEntry("sap.app").dataSources.fabricacion.uri ;			            
			this.oDataModel = new ODataModel( this.url, true );   

            this.getView().setModel(this.oDataModel);

/*
                _this.getOwnerComponent().getModel('alerts').setProperty("/alerts/errors", 
                [ {
                    type: "Error",
                    title: "Error al consultar datos",
                    subTitle: "Error Consulta al servidor",
                    description: e.message, //"Error de Conexión",                                                
                    target: ""                        
                    } ] )                
                );  */
			this.oTable = this.byId("idFabricacionTabla");
			
			this.oReadOnlyTemplate = this.byId("idFabricacionTabla").removeItem(0);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			this.oEditableTemplate = new ColumnListItem({
				cells: [					
					 new Input({
						value: "{Enmng}",
						description: "{Meins} / {i18n>fabricacion_tab_col_5}"
					})
				]
			});
        },
        /*
        //se vuelve al login verificando la cocokie
        backToLogin: function(_View){
            //verifico si mis coockies de sesión han sido guardadas, es decir, si me he logueado recientemente
            var oStorage = new Storage(Storage.Type.session, "login");
            //si no existe al menos la orden que siempre va a estar guardada, es porque se ha salido de la sesión
            if (!oStorage.get("idorden")){

                var oRouter = sap.ui.core.UIComponent.getRouterFor(_View);
			    oRouter.navTo("login", {} );
            }
        },
*/
        rebindTable: function(oTemplate, sKeyboardMode) {
			this.oTable.bindItems({
				//path: "/ordenFabricacionSet?$filter=Aufnr eq '900000094870' and Arbpl eq 'PREP_ACO' and Pernr eq '10000095'",                
                path: "/ordenFabricacionSet",
                filters: [ new Filter("Aufnr", FilterOperator.EQ, '900000094870') ,
                           new Filter("Arbpl", FilterOperator.EQ, 'PREP_ACO') ,
                           new Filter("Pernr", FilterOperator.EQ, '10000095') ,
                        ],
                //parameters:{"$filter" : "Aufnr eq '900000094870' and Arbpl eq 'PREP_ACO' and Pernr eq '10000095'"},
                //parameters:{$filter : "Aufnr eq '900000094870'"},
                /*filters : [
                    { path : 'Aufnr', operator : 'EQ', value1 : '900000094870'}
                ],*/
				template: oTemplate,
				templateShareable: true,
				key: "Aufnr"
			}).setKeyboardMode(sKeyboardMode);
		},

		onEdit: function() {
			this.aProductCollection = deepExtend([], this.getView().getModel().getProperty("/ordenFabricacionSet"));
			this.byId("editButton").setVisible(false);
			this.byId("saveButton").setVisible(true);
			this.byId("cancelButton").setVisible(true);
            
			this.rebindTable(this.oEditableTemplate, "Edit");
		},
        enviarModificaciones(){
            
            var ordenFabricacion=[];
            //SE COMPARA EL NUEVO VALOR INTRODUCIDO EN EL INPUT con el valor antiguo obtenido originalmente al cargar la tabla, este valor antiguo se encuentra en las propiedades dle Model
            var lenghtItems=this.oTable.getItems().length;
            var json={  "Aufnr" :  this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Aufnr ,
                        "Arbpl" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Arbpl,
                        "Pernr" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Pernr,
                        "ordenfabricacionset" : ""
                    };                  
            for(var i=0;i < lenghtItems;i++){    
            if( this.oTable.getItems()[i].getCells()[0].getValue()
                != this.getView().getModel().getProperty(this.oTable.getItems()[i].getBindingContext().getPath()).Enmng       ){
                    
                    ordenFabricacion.push({
                        "Aufnr" :  this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Aufnr ,
                        "Arbpl" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Arbpl,
                        "Pernr" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Pernr,
                        "Matnr" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Matnr,
                        "Maktx" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Maktx,
                        "ChargD" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).ChargD,
                        "Bdmng" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Bdmng,
                        "Enmng" : this.oTable.getItems()[i].getCells()[0].getValue(),
                        "Erfmg" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Erfmg,
                        "Meins" : this.getView().getModel().getProperty(this.oTable.getItems()[0].getBindingContext().getPath()).Meins
                    });
                    
                   
            }
        }
        json.ordenfabricacionset= ordenFabricacion ;
    
  /*      this.oDataModel.create("/ordenFabricacionSet",json,{
            success: function(result){
                console.log("ok");
                // everything is OK 
            },
            error: function(err){
                // some error occuerd 
            },
            async: true,  // execute async request to not stuck the main thread
            urlParameters: {}  // send URL parameters if required 
        }); 
*/


        OData.request  ({  
            requestUri:      this.url + "ordenFabricacionSet",  
            method: "GET",  
                    
            headers: {   "X-Requested-With": "XMLHttpRequest",                        
                    "Content-Type": "application/atom+xml", 
                    "DataServiceVersion": "2.0",                      
                    //se pasa el parámetro fetch para así obtener el token CSRF
                    "X-CSRF-Token": "Fetch"   },  
            },  
            //si se conecta con el servidor, se continúa ya haciendo el post con el token obtenido en el get 
            function (data, response) {
                    var header_xcsrf_token = response.headers['x-csrf-token'];                    

                OData.request 
                ({                  
                    requestUri: this.url + "ordenFabricacionSet",
                    method: "POST",
                    headers: {   "X-Requested-With": "XMLHttpRequest",                        
                                "Content-Type": "application/atom+xml", 
                                "DataServiceVersion": "2.0",  
                                "Accept": "application/atom+xml,application/atomsvc+xml,application/xml", 
                                "X-CSRF-Token": header_xcsrf_token    
                            },  
                    data:  json
                            
                },
                function (data, response) 
                { 
                    console.log("bien");
                },  
                function (err)  
                {      
                    console.log(err.message);                           
            //        _this._showServiceError(_this,err);                             
                })

            });   
            
        },

		onSave: function() {
			this.byId("saveButton").setVisible(false);
			this.byId("cancelButton").setVisible(false);
			this.byId("editButton").setVisible(true);
			//this.rebindTable(this.oReadOnlyTemplate, "Navigation");
            this.enviarModificaciones();
		},

		onCancel: function() {
			this.byId("cancelButton").setVisible(false);
			this.byId("saveButton").setVisible(false);
			this.byId("editButton").setVisible(true);
			this.oModel.setProperty("/ordenFabricacionSet", this.aProductCollection);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		},

		onSumbit: function() {
			
		},

		onExit: function() {
			this.aProductCollection = [];
			this.oEditableTemplate.destroy();
			this.oModel.destroy();
		},

		onPaste: function(oEvent) {
			var aData = oEvent.getParameter("data");
			MessageToast.show("Se han pegado los datos: " + aData);
		}
	})

	

});