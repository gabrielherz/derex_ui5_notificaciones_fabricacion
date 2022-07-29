  sap.ui.define([
    './BaseController',
    'sap/m/ResponsivePopover',
    'sap/m/MessagePopover',
    'sap/m/MessageItem',
    'sap/ui/model/json/JSONModel',
    'sap/m/ActionSheet',
    'sap/m/Button',
    'sap/m/Link',
    'sap/m/NotificationListItem',
    'sap/m/MessagePopoverItem',
    'sap/ui/core/CustomData',
    'sap/m/MessageToast',
    'sap/ui/Device',
    'sap/ui/core/syncStyleClass',
    'sap/m/library'
  ], function(
    BaseController,
    ResponsivePopover,
    MessagePopover,
    MessageItem,
    JSONModel,
    ActionSheet,
    Button,
    Link,
    NotificationListItem,
    MessagePopoverItem,
    CustomData,
    MessageToast,
    Device,
    syncStyleClass,
    mobileLibrary
  ) {
    "use strict";
  
    // shortcut for sap.m.PlacementType
    var PlacementType = mobileLibrary.PlacementType;
  
    // shortcut for sap.m.VerticalPlacementType
    var VerticalPlacementType = mobileLibrary.VerticalPlacementType;
  
    // shortcut for sap.m.ButtonType
    var ButtonType = mobileLibrary.ButtonType;
/*
    // Template de la barra de mensajes de error
    var oMessageTemplate = new MessageItem({
      
      title: '{title}',
      subtitle: '{subtitle}',
      description: '{description}',            
      counter: '{counter}'
    });
    var oMessagePopover = new MessagePopover({
      items: {
        path: '/',
        template: oMessageTemplate
      },
      activeTitlePress: function () {
        MessageToast.show('Active title is pressed');
      },
      afterClose: function () {
        oMessagePopover.destroy();
      }
    });
    var oModelErrorMessages = new JSONModel();*/
    return BaseController.extend("projectpruebaodata.controller.App", {
  
      _bExpanded: true,
  
      onInit: function() {
        this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
  
        // if the app starts on desktop devices with small or meduim screen size, collaps the sid navigation
        if (Device.resize.width <= 1024) {
          this.onSideNavButtonPress();
        }
  
        Device.media.attachHandler(this._handleWindowResize, this);
        this.getRouter().attachRouteMatched(this.onRouteChange.bind(this));

        //// se suscribe el controller para que pueda ser invocado desde los otros controllers login, fabricación, etc
        sap.ui.getCore().getEventBus().subscribe( 
          "oEvent",         
          "App",
          this.desplegarErrores,
          this
        );

        sap.ui.getCore().getEventBus().subscribe( 
          "login",         
          "setUID",
          this.setUID,
          this
        );  
        


        /*//se navega desde el login y manda los datos para cargar la barra de notificaciones de error
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.getRoute("login").attachPatternMatched(this.desplegarErrores, this);*/
      },
  
      onExit: function() {
        Device.media.detachHandler(this._handleWindowResize, this);
      },
  
      onRouteChange: function (oEvent) {
        this.getModel('side').setProperty('/selectedKey', oEvent.getParameter('name'));
  
        if (Device.system.phone) {
          this.onSideNavButtonPress();
        }
      },
  
      onUserNamePress: function(oEvent) {
        var oSource = oEvent.getSource();
        this.getModel("i18n").getResourceBundle().then(function(oBundle){
          // close message popover
          var oMessagePopover = this.byId("errorMessagePopover");
          if (oMessagePopover && oMessagePopover.isOpen()) {
            oMessagePopover.destroy();
          }
          var fnHandleUserMenuItemPress = function (oEvent) {
            this.getBundleText("clickHandlerMessage", [oEvent.getSource().getText()]).then(function(sClickHandlerMessage){
              MessageToast.show(sClickHandlerMessage);
            });
          }.bind(this);
          var oActionSheet = new ActionSheet(this.getView().createId("userMessageActionSheet"), {
            title: oBundle.getText("userHeaderTitle"),
            showCancelButton: false,
            buttons: [
              new Button({
                text: '{i18n>userAccountUserSettings}',
                type: ButtonType.Transparent,
                press: fnHandleUserMenuItemPress
              }),
              new Button({
                text: "{i18n>userAccountOnlineGuide}",
                type: ButtonType.Transparent,
                press: fnHandleUserMenuItemPress
              }),
              new Button({
                text: '{i18n>userAccountFeedback}',
                type: ButtonType.Transparent,
                press: fnHandleUserMenuItemPress
              }),
              new Button({
                text: '{i18n>userAccountHelp}',
                type: ButtonType.Transparent,
                press: fnHandleUserMenuItemPress
              }),
              new Button({
                text: '{i18n>userAccountLogout}',
                type: ButtonType.Transparent,
                press: fnHandleUserMenuItemPress
              })
            ],
            afterClose: function () {
              oActionSheet.destroy();
            }
          });
          this.getView().addDependent(oActionSheet);
          // forward compact/cozy style into dialog
          syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oActionSheet);
          oActionSheet.openBy(oSource);
        }.bind(this));
      },
  
      onSideNavButtonPress: function() {
        var oToolPage = this.byId("app");
        var bSideExpanded = oToolPage.getSideExpanded();
        this._setToggleButtonTooltip(bSideExpanded);
        oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
      },
  
      _setToggleButtonTooltip : function(bSideExpanded) {
        /* //var modelo = this.getModel("i18n");
        var oToggleButton = this.byId('sideNavigationToggleButton');
        this.getBundleText(bSideExpanded ? "expandMenuButtonText" : "collpaseMenuButtonText").then(function(sTooltipText){
          oToggleButton.setTooltip(sTooltipText);
        });*/
      }, 
  
      // Errors Pressed
      onMessagePopoverPress: function (oEvent) {
        
        //this.oMessagePopoverButton = oEvent.getSource();
        var oMessagePopoverButton = oEvent.getSource();
        //if (!this.byId("errorMessagePopover")) {
          this.getModel("i18n").getResourceBundle().then(function(oBundle){
          
            var oMessagePopover = new MessagePopover(this.getView().createId("errorMessagePopover"), {
              placement: VerticalPlacementType.Bottom,
              items: {
                path: 'alerts>/alerts/errors',
                factory: this._createError.bind(this, oBundle)
              },
              afterClose: function () {
                oMessagePopover.destroy();
              }
            });
            this.byId("app").addDependent(oMessagePopover);
            // forward compact/cozy style into dialog
            syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oMessagePopover);
            oMessagePopover.openBy(oMessagePopoverButton);
          }.bind(this));
        //}
      },
      desplegarErrores(oEvent){
        var errorButton = this.getView().byId("errorButton");
        var oMessagePopoverButton = errorButton;
        //var oMessagePopoverButton = this.oMessagePopoverButton;
        //if (!this.byId("errorMessagePopover")) {
        
          this.getModel("i18n").getResourceBundle().then(function(oBundle){
              var oMessagePopover = new MessagePopover(this.getView().createId("errorMessagePopover"), {
              placement: VerticalPlacementType.Bottom,
              items: {
                path: 'alerts>/alerts/errors',
                factory: this._createError
                
                
              },
              afterClose: function () {
                oMessagePopover.destroy();
              }
            });
            //var oModel = oModelErrorMessages.getModel("invoice");
            //var localdata = oModel.getData();
            //localdata.Invoices.push(obj);
            //oModel.setData(localdata); 
        /*  
            oModelErrorMessages.setData( 
              oEvent.getParameter("arguments").errores
             /* {
                alerts:
                  {
                        
                  errors: [
                    {
                      title: "{i18n>userAccountOnlineGuide}",
                      subTitle: "invalid data",
                      description: "Los datos en los campos 'cantidad esperada' y 'cantidad consumida' son erróneos",
                      counter: 1
                    }
                  ]
            }
        
        }
            );*/
//////////////            
            /*var oMessagePopover = new MessagePopover(this.getView().createId("errorMessagePopover"), {
              placement: VerticalPlacementType.Bottom,
              items: {
                path: 'alerts>/alerts/errors',
                factory: this._createError.bind(this, oBundle)
              },
              afterClose: function () {
                oMessagePopover.destroy();
              }
            });
////////////////
            oMessagePopover.setModel(oModelErrorMessages, "alerts");
            
            */
            
           // this.getView().byId("errorButton").addDependent(oMessagePopover);
           this.byId("app").addDependent(oMessagePopover);
            // forward compact/cozy style into dialog
            syncStyleClass(this.getView().getController().getOwnerComponent().getContentDensityClass(), this.getView(), oMessagePopover);
            oMessagePopover.openBy(oMessagePopoverButton);
          }.bind(this));
        //}
 
      },
      //Se cambia el valor del identificador de usuario en la parte superior derecha de la barra
      setUID: function(idEvent,channel, o){
        if(o.sUID){
          this.byId("userButton").setText(o.sUID); 
        }        
      },

  
      _createError: function (oBundle, sId, oBindingContext) {
        var oBindingObject = oBindingContext.getObject();
        /*var oLink = new Link("moreDetailsLink", {
          text: oBundle.getText("moreDetailsButtonText"),
          press: function(oEvent) {
            this.getBundleText("clickHandlerMessage", [oEvent.getSource().getText()]).then(function(sClickHandlerMessage){
              MessageToast.show(sClickHandlerMessage);
            });
          }.bind(this)
        });  
        var oMessageItem = new MessagePopoverItem({
          title: oBindingObject.title,
          subtitle: oBindingObject.subTitle,
          description: oBindingObject.description,
          counter: oBindingObject.counter,
          link: oLink
        });
        */
        var oMessageItem = new MessagePopoverItem({
          type:        oBindingObject.type,
          title:       oBindingObject.title,
          subtitle:    oBindingObject.subTitle,
          description: oBindingObject.description,          
          link:      oBindingObject.target
        });
        return oMessageItem;
      },
  
      /**
       * Returns a promises which resolves with the resource bundle value of the given key <code>sI18nKey</code>
       *
       * @public
       * @param {string} sI18nKey The key
       * @param {string[]} [aPlaceholderValues] The values which will repalce the placeholders in the i18n value
       * @returns {Promise<string>} The promise
       */
      getBundleText: function(sI18nKey, aPlaceholderValues){
        return this.getBundleTextByModel(sI18nKey, this.getModel("i18n"), aPlaceholderValues);
      },
  
      _handleWindowResize: function (oDevice) {
        if ((oDevice.name === "Tablet" && this._bExpanded) || oDevice.name === "Desktop") {
          this.onSideNavButtonPress();
          // set the _bExpanded to false on tablet devices
          // extending and collapsing of side navigation should be done when resizing from
          // desktop to tablet screen sizes)
          this._bExpanded = (oDevice.name === "Desktop");
        }
      }
  
    });
  });
  