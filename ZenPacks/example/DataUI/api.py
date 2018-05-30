import persistent

from Products.ZenUtils.Ext import DirectRouter, DirectResponse


class DataUIRouter(DirectRouter):
    """JSON API router.

    This router is accessed via POST to a URL such as the following.

        https://zenoss5.example.com/zport/dmd/example_DataUI_router

    With an application/json data such as the following.

        {
            "action": "DataUIRouter",
            "method": "saveSettings",
            "data": [
                {
                    "url": "https://example.com/a/useful/url"
                }
            ]
        }

    Note that the "example_DataUI_router" portion of the URL comes from the
    name we give our "directRouter" in configure.zcml when we register it.

    """

    # Name of property where we'll store a DataUISettings object.
    OBJ_NAME = "example_DataUI"

    def loadSettings(self):
        """Return saved settings."""
        storage = self.getStorage()
        return DirectResponse.succeed(
            data={
                "url": storage.url,
            })

    def saveSettings(self, url=""):
        """Save new settings."""
        storage = self.getStorage()
        storage.url = url

        return DirectResponse.succeed()

    def getStorage(self):
        """Return our storage object. Create it first if necessary."""
        dmd = self.context.getDmd()

        obj = getattr(dmd, self.OBJ_NAME, None)
        if obj is None:
            obj = DataUIStorage()
            setattr(dmd, self.OBJ_NAME, obj)

        return getattr(dmd, self.OBJ_NAME)


class DataUIStorage(persistent.Persistent):
    """Persistent object where we'll store settings."""

    # Properties with their default values.
    url = ""
