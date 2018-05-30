(function(){

    // Wait for ExtJS framework to be ready.
    Ext.onReady(function() {

        // Wait for "Configure" button on Events screen to be available.
        Ext.ComponentMgr.onAvailable("configure-button", function(button) {

            // Add our item to the button's menu before it's rendered.
            button.on("beforerender", function() {
                button.menu.add({
                    text: "Example DataUI Settings",
                    handler: function() {
                        var dialog = Ext.create("example.DataUI.SettingsDialog");

                        // Load current settings from API, then show window.
                        dialog.loadAndShow();
                    }
                });
            });
        });
    });

    // Define the window that appears when we click our button.
    Ext.define("example.DataUI.SettingsDialog", {
        extend: "Ext.Window",

        title: "Example DataUI Settings",
        layout: "fit",
        autoHeight: true,
        width: 550,

        form: {
            xtype: "form",
            defaults: {anchor: "100%"},
            defaultType: "textfield",
            items: [{
                fieldLabel: "Example URL",
                name: "url"
            }],
            buttons: [{
                text: "Submit",
                handler: function() {
                    Zenoss.remote.DataUIRouter.saveSettings(
                        // DataUIRouter.save() arguments.
                        this.up("form").getForm().getValues(),

                        // API response callback function.
                        function() { this.close(); },

                        // Scope (this) to pass into callback function.
                        this.up("window"));
                }
            }]
        },

        // Our Window's "constructor".
        initComponent: function() {
            this.callParent();

            // Add form to the window here so we can use this.form elsewhere.
            this.form = this.add(this.form);
        },

        loadAndShow: function() {
            Zenoss.remote.DataUIRouter.loadSettings(
                // DataUIRouter.loadSettings() arguments.
                {},

                // API response callback function.
                function(response) {
                    this.form.getForm().setValues({
                        "url": response.data.url
                    });

                    this.show();
                },

                // Scope (this) to pass into callback function.
                this);
        }
    });

})();
