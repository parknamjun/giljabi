var AjaxDownloadFile = function (configurationSettings) {
    // Standard settings.
    this.settings = {
        // JQuery AJAX default attributes.
        url: "",
        type: "POST",
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        data: {},
        // Custom events.
        onSuccessStart: function (response, status, xhr, self) {
        },
        onSuccessFinish: function (response, status, xhr, self, filename) {
        },
        onErrorOccured: function (response, status, xhr, self) {
        }
    };
    this.download = function () {
        var self = this;
        $.ajax({
            type: this.settings.type,
            url: this.settings.url,
            headers: this.settings.headers,
            data: this.settings.data,
            success: function (response, status, xhr) {
                // Start custom event.
                self.settings.onSuccessStart(response, status, xhr, self);

                // Check if a filename is existing on the response headers.
                var filename = "";
                var disposition = xhr.getResponseHeader("Content-Disposition");
                if (disposition && disposition.indexOf("attachment") !== -1) {
                    var filenameRegex = /filename[^;=\n]*=(([""]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1])
                        filename = matches[1].replace(/[""]/g, "");
                }

                var type = xhr.getResponseHeader("Content-Type");
                var blob = new Blob([response], {type: type});

                if (typeof window.navigator.msSaveBlob !== "undefined") {
                    // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed.
                    window.navigator.msSaveBlob(blob, filename);
                } else {
                    var URL = window.URL || window.webkitURL;
                    var downloadUrl = URL.createObjectURL(blob);

                    if (filename) {
                        // Use HTML5 a[download] attribute to specify filename.
                        var a = document.createElement("a");
                        // Safari doesn"t support this yet.
                        if (typeof a.download === "undefined") {
                            window.location = downloadUrl;
                        } else {
                            a.href = downloadUrl;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                        }
                    } else {
                        window.location = downloadUrl;
                    }

                    setTimeout(function () {
                        URL.revokeObjectURL(downloadUrl);
                    }, 100); // Cleanup
                }

                // Final custom event.
                self.settings.onSuccessFinish(response, status, xhr, self, filename);
            },
            error: function (response, status, xhr) {
                // Custom event to handle the error.
                self.settings.onErrorOccured(response, status, xhr, self);
            }
        });
    };
    // Constructor.
    {
        // Merge settings.
        $.extend(this.settings, configurationSettings);
        // Make the request.
        this.download();
    }
};