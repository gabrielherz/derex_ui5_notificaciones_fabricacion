sap.ui.define([
	'./BaseController',
	'sap/ui/model/json/JSONModel',
	'sap/ui/Device',
	'./../model/formatter',
    "./../utils/Validator",
    'sap/ui/core/MessageType',
    'sap/ui/model/odata/ODataModel',
    'sap/m/MessageBox',
    "sap/ui/util/Storage"


], function (BaseController, JSONModel, Device, formatter, Validator, MessageType, ODataModel, MessageBox, Storage) {
	"use strict";
	return BaseController.extend("projectpruebaodata.controller.login", {
		formatter: formatter,

		onInit: function () {
			var oViewModel = new JSONModel({
				isPhone : Device.system.phone
			});
			this.setModel(oViewModel, "view");
			Device.media.attachHandler(function (oDevice) {
				this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
			}.bind(this));


            this.oDataServiceUrl = this.getOwnerComponent().getManifestEntry("sap.app").dataSources.matchcodes.uri;
			this.oDataModel = new ODataModel( this.oDataServiceUrl, true );
            sap.ui.getCore().setModel(this.oDataModel);

            /*var oModel = this.getView().byId("idordenlogin").getModel();
var oAufnrSet = oModel.createEntry("AufnrSet", {
            properties: {"aufnr":"12345678"},
            success: function (oData, response) {}.bind(this),
            error: function (oError) {}.bind(this)
});		
	
    this.getView().byId("idordenlogin").setBindingContext(oAufnrSet);*/
    /*var oView = this.getView().byId("idordenlogin");
			oView.bindElement("/AufnrSet('900000110993')");*/

            sap.ui.getCore().attachValidationError(function (oEvent) {
                oEvent.getParameter("element").setValueState(ValueState.Error);    
            });    
            sap.ui.getCore().attachValidationSuccess(function (oEvent) {    
                oEvent.getParameter("element").setValueState(ValueState.None);    
            });
               // JSON dummy data
               var oData = {
                text   : null,
                number : 0,
                date   : null
            };
      //para mostrar los mensajes de error en los componentes html al validar (no son las notificaciones d ela barra de notificaciones)
            var oModel = new JSONModel();
            oModel.setData(oData);
      
            this.getView().setModel(oModel);

       //instancia para manejo de coockies
            var oStorage = new Storage(Storage.Type.session, "login");
		},
		onSearch: function(oEvent) 
        {
            //this.setMatchcodeList(oEvent, oEvent.getSource().getValue(), "/AufnrSet" , new sap.m.StandardListItem({title: "{aufnr}"}),  new sap.ui.model.Filter("aufnr", sap.ui.model.FilterOperator.Contains,  oEvent.getSource().getValue()));
            this.inputId = oEvent.getSource().getId();
            if( this.inputId.indexOf("idorden") != -1){                   
                    this.setMatchcodeList(oEvent, oEvent.getSource().getValue(), "/AufnrSet" , new sap.m.StandardListItem({title: "{aufnr}"}),  new sap.ui.model.Filter("aufnr", sap.ui.model.FilterOperator.Contains, oEvent.getSource().getValue()));
            }
            if( this.inputId.indexOf("idpuestotrabajo") != -1){                   
                this.setMatchcodeList(oEvent, oEvent.getSource().getValue(), "/CramnSet" , new sap.m.StandardListItem({title: "{Arbpl}", description: "{Werks}{Ktext}" }),  new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, oEvent.getSource().getValue()));
            } 
            if( this.inputId.indexOf("uid") != -1){                   
                this.setMatchcodeList(oEvent, oEvent.getSource().getValue(), "/EwapernrSet" , new sap.m.StandardListItem({title: "{Pernr}", description: "{Vorna}" }),  new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.Contains, oEvent.getSource().getValue()));
            } 
            /*
            var sInputValue = oEvent.getSource().getValue();
            this.inputId = oEvent.getSource().getId();
            var path;var oTableStdListTemplate;
            var oFilterTableNo;
            this.oDialog = sap.ui.xmlfragment("projectpruebaodata.view.matchcode", this);
            path = "/AufnrSet";
            oTableStdListTemplate = new sap.m.StandardListItem({title: "{aufnr}"});// //create a filter for the binding
            oFilterTableNo = new sap.ui.model.Filter("aufnr", sap.ui.model.FilterOperator.Contains, sInputValue);
            
            this.oDialog.unbindAggregation("items");
            this.oDialog.bindAggregation("items", {
            path: path,
            template: oTableStdListTemplate,
            filters: [oFilterTableNo]}
            );// }// open value help dialog filtered by the input value
            this.oDialog.open(sInputValue);
            */
        },
        handleTableValueHelpConfirm: function(e) 
        {
           var s = e.getParameter("selectedItem");
            if (s) {                
                if( this.inputId.indexOf("idorden") != -1){  
                    this.byId(this.inputId).setValue(s.getBindingContext().getObject().aufnr);
                }
                if( this.inputId.indexOf("idpuestotrabajo") != -1){                                     
                    this.byId(this.inputId).setValue(s.getBindingContext().getObject().Arbpl);
                }
                if( this.inputId.indexOf("uid") != -1){                   
                    this.byId(this.inputId).setValue(s.getBindingContext().getObject().Pernr);                  
                } 
           //this.readRefresh(e);
            }
            this.oDialog.destroy();     
            this.oDialog = null;
        },
        handleTableValueHelpSearch: function(e) 
        {         
            var lv_value = e.getParameters().value;   
            if(lv_value){  
                if( this.inputId.indexOf("idorden") != -1){                 
                        this.setMatchcodeList(e, lv_value, "/AufnrSet" , new sap.m.StandardListItem({title: "{aufnr}"}),  new sap.ui.model.Filter("aufnr", sap.ui.model.FilterOperator.Contains, lv_value));
                }
                if( this.inputId.indexOf("idpuestotrabajo") != -1){                                     
                        this.setMatchcodeList(e, lv_value, "/CramnSet" , new sap.m.StandardListItem({title: "{Arbpl}", description: "{Werks}{Ktext}" }),  new sap.ui.model.Filter("Arbpl", sap.ui.model.FilterOperator.Contains, lv_value));                    
                }     
                if( this.inputId.indexOf("uid") != -1){                                     
                    this.setMatchcodeList(e, lv_value, "/EwapernrSet" , new sap.m.StandardListItem({title: "{Pernr}", description: "{Vorna}" }),  new sap.ui.model.Filter("Pernr", sap.ui.model.FilterOperator.Contains, lv_value));
                } 
               
           
            }
        },
        setMatchcodeList: function(oEvent, value, entityName, oTableStdListTemplate, oFilterTableNo){
            //si es la primera vez que se construye 
            if(!this.inputId){
                this.inputId = oEvent.getSource().getId();
            }
            var sInputValue = value; //oEvent.getSource().getValue();
            
            var path;var oTableStdListTemplate;
            var oFilterTableNo;
            if(!this.oDialog){
               // || !this.oDialog.isBinding() ){            
                this.oDialog = sap.ui.xmlfragment("projectpruebaodata.view.matchcode", this);
            }
           
            path = entityName; //"/AufnrSet";     
            if(this.oDialog.isBinding() ){
                this.oDialog.unbindAggregation("items");
            }
            
            this.oDialog.bindAggregation("items", {
            path: path,
            template: oTableStdListTemplate,
            filters: [oFilterTableNo]}
            );// }// abre el matchcode con el valor introducido en el input
            this.oDialog.open(sInputValue);
        }, 
        onLoginSubmit(oEvent){
            
            var validator = new Validator();
        
            // Valida todos los campos del formulario idFormLogin
            if (validator.validate(this.byId("idFormLogin"))) {    
   
  //      if (!this.oDataModelLogin){
            var urlLogin = "http://dxsapdev.derex:8010" + this.getOwnerComponent().getManifestEntry("sap.app").dataSources.login.uri;			
            var _this = this
              
                var params = {};
                params.Aufnr    = _this.byId("idorden").getValue();
                params.Arbpl    = _this.byId("idpuestotrabajo").getValue();
                params.Pernr    = _this.byId("uid").getValue();
                params.Password = _this.byId("password").getValue();
                
                ////no me funciona odatamodel
/*                this.oDataModelLogin = new ODataModel(urlLogin , true );          
                console.log(this.oDataModelLogin.getSecurityToken());
               //this.oDataModelLogin.setHeaders({"x-csrf-token":  _this.oDataModelLogin.getSecurityToken()   });
                this.oDataModelLogin.create('/dataLoginSet', params, {
                    success : function(oData, oResponse) {
                        
                    },
                    error : function(err, oResponse) {

                        _this._showServiceError(_this,err);      
                        /*
                        //var mensajes=obj.loginView.oDataModelLogin.attachRequestFailed( ).mMessages;
                        if(!err.message){
                            err.message="¡Error en conexión!";
                        }
                        obj.loginView.getView().getModel("alerts").setProperty("/alerts/errors", 
                        [ {
                            type: MessageType.Error,
                            title: "Error al intentar acceder",
                            subTitle: "Error Login",
                            description: err.message,                                                
                            target: ""                        
                            } ]
                        );
           			
				}
			});
       */
            //se consulta el webservcie para así obtener el token
            OData.request  ({  
                requestUri:      urlLogin+'dataLoginSet',  
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
                        requestUri: urlLogin+'dataLoginSet',
                        method: "POST",
                        headers: {   "X-Requested-With": "XMLHttpRequest",                        
                                    "Content-Type": "application/atom+xml", 
                                    "DataServiceVersion": "2.0",  
                                    "Accept": "application/atom+xml,application/atomsvc+xml,application/xml", 
                                    "X-CSRF-Token": header_xcsrf_token    
                                },  
                        data:  
                                {  
                                    Aufnr    : _this.byId("idorden").getValue(),
                                    Arbpl    : _this.byId("idpuestotrabajo").getValue(),
                                    Pernr    : _this.byId("uid").getValue(),
                                    Password : _this.byId("password").getValue(),
                                }  
                    },
                    function (data, response) 
                    { 
                        //se cambia el nombre del botón desplegable de la barra del lado superior derecho
                        sap.ui.getCore().getEventBus().publish("login",         
                                                                "setUID",
                                                                {sUID:(_this.byId("uid").getValue())});
                        //guardo el token en la coockie para usarla en el resto de la sesión                        
                        oStorage.put("login", "{ token: "+header_xcsrf_token+","
                        //también se guardan el resto de valores introducidos en la coockie
                                                 +"Aufnr:"+ _this.byId("idorden").getValue()+","
                                                 +"Arbpl:"+ _this.byId("idpuestotrabajo").getValue()+","
                                                 +"Pernr:"+ _this.byId("uid").getValue()       
                                                +" }");
                        var oRouter = sap.ui.core.routing.Router.getRouter("alogin");                        
                        oRouter.navTo("fabricacion",oContext,false);
                    },  
                    function (err)  
                    {                                 
                        _this._showServiceError(_this,err);                             
                    })

                });   
                                //}
            }
        
        },

    /**
         * Shows a {@link sap.m.MessageBox} when a service call has failed.
         * Only the first error message will be display.
         * @param {string} sDetails a technical error to be displayed on request
         * @private
         */
        _showServiceError: function(_this,sMsgError) {
            var i18n = this.getView().getModel("i18n");
            if( sMsgError.response.statusCode !== "404" 
                || (oParams.response.statusCode === 404 
                && oParams.response.responseText.indexOf("Cannot POST") === 0)) {                                               
                MessageBox.error(
                    jQuery.parseXML(sMsgError.response.body).querySelector("message").textContent
                    );
            }else{
                MessageBox.error(i18n.getProperty("msgError404"));
            }
            
        },

        validar(oInput, sValueState, sMensaje){
            var sTarget = oInput.getBindingContext().getPath() + "/" + oInput.getBindingPath("value");
            this.removeMessageFromTarget(sTarget);
            if (!oInput.getValue()){
            return [ {
                type: sValueState,
                title: sMensaje,
                subTitle: "¡Campo Obligatorio!",
                description: "The value of the working hours field should not exceed 40 hours.",                                                
                target: sTarget
                
                } ]
            }
            try {
                oBinding.getType().validateValue(oInput.getValue());
            } catch (oException) {
                //sValueState = "Warning";
                return [ {
                        type: sValueState,
                        title: sMensaje,
                        subTitle: "¡Campo Obligatorio!",
                        description: "The value of the working hours field should not exceed 40 hours.",                                                
                        target: sTarget
                        
                        } ]
                    }
                    oInput.setValueState(sValueState);    
            }
        
	});
});