/**
 * Check if the given string is valid JSON
 * @method JSON.isValid
 * @param json {String}
 * @return true | false
 */
var JSON = JSON || {};
JSON.isValid = function (json) {
    var obj = JSON.parse(json);
    // typeof null === "object" returns true, so we must check that too :-(
    if (typeof obj === "object" && obj !== null) {
        return true;
    }
    return false;
};/**
 * Replace all characters in search
 * @method String.replaceAll
 * @param search {String}
 * @param replace {String}
 */
String.prototype.replaceAll = function (search, replace) {
    if (replace === undefined) {
        return this.toString();
    }
    return this.split(search).join(replace);
}/**
 * Provides a simple "error-first" callback api
 * @constructor
 * @param onError {Function}
 * @param onSuccess {Funcion}
 */
function Callback(onError, onSuccess) {
    // private static

    // private

    // public
    var _exports = {
        /**
         * @method Callback.error
         * @param error {Object}
         */
        "error": function (error) {
            onError(error);
        },
        /**
         * @method Callback.success
         * @param data {Object}
         */
        "success": function (data) {
            onSuccess(data);
        }
    };

    return _exports;
}/**
 * Model modifies domain-specific data and trigger events to presenter.
 * @constructor
 */
function Model() {
    // private static
    var _items = {};
    var _presenter = undefined;

    // private

    // public
    var _exports = {
        /**
         * Clear all items
         * @method Model.clear
         */
        "clear": function () {
            _items = {};
        },
        /**
         * Retrieves item from storage
         * @method Model.get
         * @param id {String}
         */
        "get": function (id) {
            var item = _items[id] || {
                "id": id,
                "data": undefined
            };
            this.trigger("model-get", item);
            return item;
        },
        /**
         * Remove item from storage
         * @method Model.remove
         * @param id {String}
         */
        "remove": function (id) {
            delete _items[id];
            this.trigger("model-remove", id);
        },
        /**
         * Set item into storage (item must have an id attribute)
         * @method Model.set
         * @param item {Object}
         */
        "set": function (item) {
            _items[item.id] = item;
            this.trigger("model-set", item);
        },
        /**
         * @method Model.setPresenter
         * @param presenter {Presenter}
         */
        "setPresenter": function (presenter) {
            _presenter = presenter;
        },
        /**
         *
         */
        "trigger": function (name, item) {
            _presenter.trigger(name, item);
            console.log("Model triggers " + name + " [" + JSON.stringify(item) + "]");
        }
    };

    return _exports;
}/**
 * @constructor
 */
function View() {
    // private static
    var _items = {};
    var _presenter = undefined;

    // private

    // public
    var _exports = {
        /**
         * @method View.get
         * @param id {String}
         */
        "get": function (id) {
            var item = document.getElementById(id);
            this.trigger("view-get", item);
            return item;
        },
        /**
         * @method View.remove
         * @param id {String}
         */
        "remove": function (id) {
            var item = document.getElementById(id);
            document.removeChild(item);
            this.trigger("view-remove", id);
        },
        /**
         * @method View.set
         * @param id {String}
         * @param text {String}
         */
        "set": function (id, text) {
            var node = document.getElementById(id);
            if (typeof node === "object") {
                node.innerHTML = text;
                this.trigger("view-set", text);
            }
        },
        /**
         * @method View.setPresenter
         * @param presenter {Presenter}
         */
        "setPresenter": function (presenter) {
            _presenter = presenter;
        },
        /**
         *
         */
        "trigger": function (name, item) {
            _presenter.trigger(name, item);
            console.log("View triggers " + name + " [" + item + "]");
        }
    };

    return _exports;
}/**
 * Presenter observes models and updates views when models change.
 * @constructor
 */
function Presenter(model, view) {

    // private static
    var _model = model;
    var _view = view;
    var _triggers = {};

    // public
    var _exports = {
        "init": function () {
            _model.setPresenter(this);
            _view.setPresenter(this);
        },
        /**
         * Install event handler which can be triggered.
         * @method Presenter.on
         * @param name {String}
         * @param fn {Function}
         */
        "on": function (name, fn) {
            _triggers[name] = fn;
        },
        /**
         * Trigger event handler
         * @method Presenter.trigger
         * @param name {String}
         * @param item {Object}
         */
        "trigger": function (name, item) {
            var fn = _triggers[name] || function () {};
            fn(item);
        }
    };

    return _exports;
}// initialize MVP pattern
var __model = new Model();
var __view = new View();
var __presenter = new Presenter(__model, __view);
__presenter.init();

// register model events
__presenter.on("model-set", function (item) {
    // retrieve from model
    var data = item["data"];
    var id = item["id"];
    // update view
    __view.set("content", data);
    //
});

// register view events
__presenter.on("setup-save-click", function () {
    // retrieve from view
    var id = "input-field";
    var value = __view.get(id).value;
    // update model
    __model.set({
        "id": id,
        "data": value
    });
});
