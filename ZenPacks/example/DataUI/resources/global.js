(function(){

    var URL = null;

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

            // Load the configured URL for our column renderer to use.
            Zenoss.remote.DataUIRouter.loadSettings({}, function(response) {
                URL = response.data.url;
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


    // Custom event column and detail renderer.
    function numberRenderer(value) {
        // Create a link if we have a URL and number.
        if (URL && value) {
            return Ext.String.format(
                "<a href='{0}/{1}' target='_blank'>{1}</a>",
                URL, value);
        }

        // Just use the number if that's all we have.
        if (value) {
            return value;
        }

        return "n/a";
    }

    // Register our custom event column renderer.
    Zenoss.events.registerCustomColumn("example.DataUI.number", {
        renderer: numberRenderer
    });

    // Register our custom event detail renderer.
    if (!Zenoss.hasOwnProperty('event_detail_custom_renderers')) {
        Zenoss.event_detail_custom_renderers = {};
    }

    Zenoss.event_detail_custom_renderers["example.DataUI.number"] = numberRenderer

})();
