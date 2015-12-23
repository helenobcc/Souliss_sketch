/*! HABmin 2014-06-20 */
Ext.define("openHAB.automation.automation",{extend:"Ext.panel.Panel",layout:"border",icon:"images/compass.png",id:"maintabAutomation",cls:"empty",autoDestroy:!0,initComponent:function(){this.title=language.mainTab_Automation,this.tooltip=language.mainTab_AutomationTip;var a=Ext.create("openHAB.automation.ruleList"),b=Ext.create("openHAB.automation.ruleLibrary"),c=Ext.create("openHAB.automation.ruleFileList"),d=Ext.create("openHAB.automation.notificationList"),e=Ext.create("Ext.Panel",{split:!0,border:!1,region:"west",width:600,stateId:"automationWindowSizer",stateful:!0,layout:{type:"accordion",hideCollapseTool:!0},items:[a,b,c,d]}),f=Ext.create("Ext.panel.Panel",{region:"center",id:"automationPropertyContainer",header:!1,border:!1,layout:"fit",setNewProperty:function(a){this.removeAll(!0),this.add(a)},removeProperty:function(){this.removeAll(!0)}});this.items=[e,f],this.callParent()}}),Ext.define("openHAB.automation.notificationList",{extend:"Ext.panel.Panel",layout:"fit",icon:"images/bell.png",initComponent:function(){this.title=language.notification_ListTitle,this.callParent()}}),Ext.define("openHAB.automation.ruleEditor",{extend:"Ext.panel.Panel",layout:"fit",initComponent:function(){function a(a){return null==a?void handleStatusNotification(NOTIFICATION_ERROR,language.rule_EditorErrorNoModel):void Ext.Ajax.request({url:HABminBaseURL+"/config/rules/model/source/"+a,headers:{Accept:"application/json"},method:"GET",success:function(b){var c=Ext.decode(b.responseText);return null==c?void handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_EditorErrorLoadingRule,a)):(f.setValue(c.source),f.setFocus(),e.getComponent("save").disable(),e.getComponent("cancel").disable(),e.getComponent("undo").disable(),e.getComponent("redo").disable(),void(null==c.source||0==c.source.length?handleStatusNotification(NOTIFICATION_OK,sprintf(language.rule_EditorCreatedOk,a)):handleStatusNotification(NOTIFICATION_OK,sprintf(language.rule_EditorLoadedOk,a))))},failure:function(){handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_EditorErrorLoadingRule,a))}})}var b,c,d=10;b=this.modelName,c=this.ruleName;var e=Ext.create("Ext.toolbar.Toolbar",{items:[{icon:"images/cross.png",itemId:"cancel",cls:"x-btn-icon",disabled:!0,tooltip:language.rule_EditorCancelTip,handler:function(){a(b,c)}},{icon:"images/disk.png",itemId:"save",cls:"x-btn-icon",disabled:!0,tooltip:language.rule_EditorSaveTip,handler:function(){var a={};a.model=b,a.source=f.getValue(),Ext.Ajax.request({url:HABminBaseURL+"/config/rules/model/source/"+b,headers:{Accept:"application/json"},method:"PUT",jsonData:a,success:function(a){var c=Ext.decode(a.responseText);return null==c?void handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_EditorErrorSavingRule,b)):(e.getComponent("save").disable(),e.getComponent("cancel").disable(),void handleStatusNotification(NOTIFICATION_OK,sprintf(language.rule_EditorSaveOk,b)))},failure:function(){handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_EditorErrorSavingRule,b))}}),f.setFocus()}},{icon:"images/arrow-circle-225-left.png",itemId:"undo",cls:"x-btn-icon",disabled:!0,tooltip:language.rule_EditorUndoTip,handler:function(){f.undo(),f.setFocus()}},{icon:"images/arrow-circle-315.png",itemId:"redo",cls:"x-btn-icon",disabled:!0,tooltip:language.rule_EditorRedoTip,handler:function(){f.redo(),f.setFocus()}},{icon:"images/edit-size-up.png",itemId:"font-large",cls:"x-btn-icon",disabled:!1,tooltip:language.rule_EditorIncreaseFontTip,handler:function(){d>32||(d+=1,f.setFontSize(d),f.setFocus())}},{icon:"images/edit-size-down.png",itemId:"font-small",cls:"x-btn-icon",disabled:!1,tooltip:language.rule_EditorDecreaseFontTip,handler:function(){6>d||(d-=1,f.setFontSize(d),f.setFocus())}},{icon:"images/edit-code.png",itemId:"insert",cls:"x-btn-icon",disabled:!1,tooltip:language.rule_EditorAddTemplateTip,handler:function(){f.insertText('rule "<name here>"\nwhen\n\nthen\n\nend\n'),f.setFocus()}},{icon:"images/document-node.png",itemId:"itemlist",cls:"x-btn-icon",disabled:!1,tooltip:language.rule_EditorAddItemTip,handler:function(){var a=Ext.widget("form",{layout:{type:"vbox",align:"stretch"},border:!1,bodyPadding:10,fieldDefaults:{labelAlign:"top",labelWidth:100,labelStyle:"font-weight:bold"},defaults:{margins:"0 0 10 0"},items:[{margin:"0 0 0 0",xtype:"combobox",fieldLabel:language.rule_EditorAddItemName,itemId:"name",name:"name",store:itemConfigStore,allowBlank:!1,valueField:"name",displayField:"name",queryMode:"local",forceSelection:!1,editable:!0,typeAhead:!0}],buttons:[{text:language.cancel,handler:function(){this.up("window").destroy()}},{text:language.rule_EditorInsertItem,handler:function(){this.up("form").getForm().isValid()&&(f.insertText(a.getForm().findField("name").getSubmitValue()),f.setFocus(),this.up("window").destroy())}}]}),b=Ext.widget("window",{title:language.rule_EditorSelectItemName,closeAction:"destroy",width:325,resizable:!1,draggable:!1,modal:!0,layout:{type:"vbox",align:"stretch"},items:[a]});b.show()}},{icon:"images/clock.png",itemId:"cronlist",cls:"x-btn-icon",disabled:!1,tooltip:language.rule_EditorAddTimerTip,handler:function(){var a=Ext.widget("form",{layout:{type:"vbox",align:"stretch"},border:!1,bodyPadding:10,fieldDefaults:{labelAlign:"top",labelWidth:100,labelStyle:"font-weight:bold"},defaults:{margins:"0 0 10 0"},items:[{margin:"0 0 0 0",xtype:"combobox",fieldLabel:language.rule_EditorTimeRule,itemId:"rule",name:"rule",store:cronRuleStore,allowBlank:!1,valueField:"rule",displayField:"label",queryMode:"local",forceSelection:!0,editable:!0,typeAhead:!0}],buttons:[{text:language.cancel,handler:function(){this.up("window").destroy()}},{text:language.rule_EditorInsertTimer,handler:function(){this.up("form").getForm().isValid()&&(f.insertText('"'+a.getForm().findField("rule").getSubmitValue()+'"'),f.setFocus(),this.up("window").destroy())}}]}),b=Ext.widget("window",{title:language.rule_EditorSelectTimer,closeAction:"destroy",width:375,resizable:!1,draggable:!1,modal:!0,layout:{type:"vbox",align:"stretch"},items:[a]});b.show()}}]}),f=Ext.create("Ext.ux.aceeditor.Panel",{tbar:e,theme:"eclipse",parser:"openhabrules",layout:"fit",printMargin:!0,fontSize:d+"px",editorId:"aceRuleEditor",listeners:{change:function(){e.getComponent("save").enable(),e.getComponent("cancel").enable(),e.getComponent("undo").enable(),e.getComponent("redo").enable()}}});this.items=[f],this.callParent(),a(this.modelName,this.ruleName)}}),Ext.define("openHAB.automation.ruleFileList",{extend:"Ext.panel.Panel",layout:"fit",icon:"images/document-copy.png",initComponent:function(){function a(){b.loadData([],!1),Ext.Ajax.request({url:HABminBaseURL+"/config/rules/model/list",headers:{Accept:"application/json"},method:"GET",success:function(a){var c=Ext.decode(a.responseText);if(null!=c)for(var d=[].concat(c.rule),e=0;e<d.length;e++)if(null!=d[e].rules)for(var f=[].concat(d[e].rules),g=0;g<f.length;g++){var h={};h.model=d[e].model,h.rule=f[g].name,b.add(h)}else{var h={};h.model=d[e].model,b.add(h)}}})}this.title=language.rule_FileListTitle,Ext.define("RuleModelModel",{extend:"Ext.data.Model",fields:[{name:"model"},{name:"rule"}]});var b=Ext.create("Ext.data.ArrayStore",{model:"RuleModelModel"}),c=Ext.create("Ext.toolbar.Toolbar",{items:[{icon:"images/plus-button.png",itemId:"add",text:language.add,cls:"x-btn-icon",disabled:!1,tooltip:language.rule_FileListAddTip,handler:function(){Ext.define("RuleModelsModel",{extend:"Ext.data.Model",fields:[{name:"name"},{name:"icon"},{name:"iconCls"}]});for(var a=[],c=0,d=0;d<b.getCount();d++){for(var e=!1,f=b.getAt(d).get("model"),g=0;g<a.length;g++)if(a[g].name==f){e=!0;break}e===!1&&(a[c]={},a[c].name=f,c++)}var h=Ext.widget("form",{layout:{type:"vbox",align:"stretch"},border:!1,bodyPadding:10,fieldDefaults:{labelAlign:"top",labelWidth:100,labelStyle:"font-weight:bold"},defaults:{margins:"0 0 10 0"},items:[{margin:"0 0 0 0",xtype:"combobox",fieldLabel:"Model name:",itemId:"model",name:"model",store:{model:"RuleModelsModel",data:a},allowBlank:!1,valueField:"name",displayField:"name",queryMode:"local",forceSelection:!1,editable:!0,typeAhead:!0}],buttons:[{text:language.cancel,handler:function(){this.up("window").destroy()}},{text:language.rule_FileListCreateButton,handler:function(){if(this.up("form").getForm().isValid()){var a=h.getForm().findField("model").getSubmitValue(),b=null,b=Ext.create("openHAB.automation.ruleEditor",{modelName:a});null!=b&&Ext.getCmp("automationPropertyContainer").setNewProperty(b),this.up("window").destroy()}}}]}),i=Ext.widget("window",{title:language.rule_FileListCreateButton,closeAction:"destroy",width:225,resizable:!1,draggable:!1,modal:!0,layout:{type:"vbox",align:"stretch"},items:[h]});i.show()}},{xtype:"tbfill"},{icon:"images/arrow-circle-315.png",itemId:"refresh",cls:"x-btn-icon",disabled:!1,tooltip:language.refresh,handler:function(){a()}}]}),d=Ext.create("Ext.grid.Panel",{store:b,header:!1,split:!0,tbar:c,collapsible:!1,multiSelect:!1,columns:[{text:language.rule_FileListModel,flex:1,dataIndex:"model"},{text:language.rule_FileListRule,flex:3,dataIndex:"rule"}],listeners:{itemclick:function(a,b){if(null!=b){var c=Ext.create("openHAB.automation.ruleEditor",{modelName:b.get("model"),ruleName:b.get("rule")});null!=c&&Ext.getCmp("automationPropertyContainer").setNewProperty(c)}}}});this.items=d,this.callParent(),a()}}),Ext.define("openHAB.automation.ruleLibrary",{extend:"Ext.panel.Panel",layout:"fit",icon:"images/drawer.png",initComponent:function(){this.title=language.rule_LibraryTitle;var a=Ext.create("Ext.grid.Panel",{header:!1,split:!0,collapsible:!1,multiSelect:!1,columns:[{text:language.rule_LibraryRule,flex:4,dataIndex:"label"}],listeners:{select:function(){}}});this.items=a,this.callParent()}}),Ext.define("openHAB.automation.ruleList",{extend:"Ext.panel.Panel",layout:"fit",icon:"images/application-list.png",items:[],initComponent:function(){function a(a,c,d){"yes"===a&&Ext.Ajax.request({url:HABminBaseURL+"/config/designer/"+d.config.id,headers:{Accept:"application/json"},method:"DELETE",success:function(){handleStatusNotification(NOTIFICATION_OK,sprintf(language.rule_ListDeleteOk,d.config.name))},failure:function(){handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_ListDeleteError,d.config.name))},callback:function(){designStore.reload(),b.getComponent("delete").disable(),Ext.getCmp("automationPropertyContainer").removeProperty()}})}this.title=language.rule_ListTitle;var b=Ext.create("Ext.toolbar.Toolbar",{items:[{icon:"images/minus-button.png",itemId:"delete",text:language.delete,cls:"x-btn-icon",disabled:!0,tooltip:language.rule_ListDeleteTip,handler:function(){var b=c.getSelectionModel().getSelection()[0];if(null!=b){var d=b.get("name");Ext.Msg.show({title:language.rule_ListConfirmDeleteTitle,msg:sprintf(language.rule_ListConfirmDeleteMsg,d),buttons:Ext.Msg.YESNO,config:{obj:this,name:d,id:b.get("id")},fn:a,icon:Ext.MessageBox.QUESTION})}}},{icon:"images/plus-button.png",itemId:"add",text:language.add,cls:"x-btn-icon",disabled:!1,tooltip:language.rule_ListAddTip,handler:function(){var a=Ext.create("openHAB.automation.ruleProperties",{blockly:{blocks:{block:[{type:"openhab_rule",deletable:!1,movable:!1,fields:[{name:"NAME",value:language.rule_DesignerNewRule}]}]}}});null!=a&&Ext.getCmp("automationPropertyContainer").setNewProperty(a)}}]}),c=Ext.create("Ext.grid.Panel",{store:designStore,header:!1,split:!0,tbar:b,collapsible:!1,multiSelect:!1,columns:[{flex:1,dataIndex:"name"}],listeners:{itemclick:function(a,c){null!=c&&Ext.Ajax.request({url:HABminBaseURL+"/config/designer/"+c.get("id"),headers:{Accept:"application/json"},method:"GET",success:function(a){var b=Ext.decode(a.responseText);if(null!=b){var c=Ext.create("openHAB.automation.ruleProperties",{ruleId:b.id,blockly:{blocks:b}});null!=c&&Ext.getCmp("automationPropertyContainer").setNewProperty(c)}},failure:function(){handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_ListGetError,options.config.name))},callback:function(){b.getComponent("delete").enable()}})}}});this.items=c,this.callParent()}}),Ext.define("openHAB.automation.ruleProperties",{extend:"Ext.ux.blockly.Blockly",tabTip:"Rule Properties",header:!1,border:!1,autoDestroy:!0,ruleId:null,initComponent:function(){var a=this,b=[{id:0,label:"Item command was received ..."},{id:1,label:"Item state was updated ..."},{id:1,label:"Item state changed from ..."},{id:2,label:"The openHAB system has ..."},{id:3,label:"The time is ..."},{id:4,label:"A periodic timer running ..."}],c=Ext.create("Ext.data.Store",{storeId:"ruleTriggerType",fields:[{type:"number",name:"id"},{type:"text",name:"label"}]});c.loadData(b);var d=[{name:"Logic",title:language.rule_DesignerToolboxLogic,icon:"images/sum.png"},{name:"Loops",title:language.rule_DesignerToolboxLoops,icon:"images/edit-indent.png"},{name:"Math",title:language.rule_DesignerToolboxMath,icon:"images/edit-mathematics.png"},{name:"Items",title:language.rule_DesignerToolboxItems,icon:"images/edit-list.png"},{name:"Functions",title:language.rule_DesignerToolboxFunctions,icon:"images/edit-code.png"},{name:"Library",title:language.rule_DesignerToolboxLibrary,icon:"images/book-open.png"}],e=[{category:"Logic",block:{type:"controls_if"}},{category:"Logic",block:{type:"logic_compare"}},{category:"Logic",block:{type:"logic_operation"}},{category:"Logic",block:{type:"logic_negate"}},{category:"Logic",block:{type:"openhab_iftimer"}},{category:"Logic",block:{type:"logic_boolean"}},{category:"Math",block:{type:"math_number"}},{category:"Math",block:{type:"math_arithmetic"}},{category:"Math",block:{type:"math_round"}},{category:"Math",block:{type:"math_constrain"}},{category:"Items",block:{type:"openhab_itemset"}},{category:"Items",block:{type:"openhab_itemget"}},{category:"Items",block:{type:"openhab_itemcmd"}},{category:"Items",block:{type:"openhab_persistence_get"}},{category:"Items",block:{type:"variables_set"}},{category:"Items",block:{type:"variables_get"}},{category:"Items",block:{type:"openhab_constantget"}},{category:"Items",block:{type:"openhab_constantset"}},{category:"Items",block:{type:"openhab_state_onoff"}},{category:"Items",block:{type:"openhab_state_openclosed"}},{category:"Items",block:{type:"text"}}],f=Ext.create("Ext.toolbar.Toolbar",{items:[{icon:"images/cross.png",itemId:"cancel",text:language.cancel,cls:"x-btn-icon",disabled:!0,tooltip:language.rule_DesignerCancelTip,handler:function(){}},{icon:"images/disk.png",itemId:"save",text:language.save,cls:"x-btn-icon",disabled:!0,tooltip:language.rule_DesignerSaveTip,handler:function(){var b=a.getBlocks();if(null==b||null==b.block||0==b.block.length)return void handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_DesignerErrorReadingRule));if(null==b.block[0].fields||0==b.block[0].fields.length)return void handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_DesignerErrorReadingRuleName));for(var c,d=0;d<b.block[0].fields.length;d++)if("NAME"==b.block[0].fields[d].name){c=b.block[0].fields[d].value;break}if(null==c||""==c)return void handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_DesignerErrorReadingRuleName));var e={};null!=a.ruleId&&(e.id=a.ruleId),e.block=b.block[0],e.name=c,Ext.Ajax.request({url:HABminBaseURL+"/config/designer/"+(null==a.ruleId?"":a.ruleId),headers:{Accept:"application/json"},method:null==a.ruleId?"POST":"PUT",jsonData:e,success:function(b){var d=Ext.decode(b.responseText);return null==d?void handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_DesignerErrorSavingRule,c)):(null==a.ruleId?a.ruleId=d.id:a.ruleId!=d.id&&handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_DesignerIdError,c)),f.getComponent("save").disable(),f.getComponent("cancel").disable(),void handleStatusNotification(NOTIFICATION_OK,sprintf(language.rule_DesignerSaveOk,c)))},failure:function(){handleStatusNotification(NOTIFICATION_ERROR,sprintf(language.rule_DesignerErrorSavingRule,c))},callback:function(){designStore.reload()}})}}]});this.tbar=f,null==this.blockly&&(this.blockly={}),this.blockly.toolbox=!0,this.blockly.collapse=!0,this.blockly.toolboxCategories=d,this.blockly.toolboxTools=e,this.blockly.trashcan=!0,this.blockly.path="js/extux/blockly/",this.blockly.listeners={workspacechanged:function(){f.getComponent("cancel").enable(),f.getComponent("save").enable()}},this.callParent()}});