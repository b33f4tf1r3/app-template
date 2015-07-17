// initialize MVP pattern
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
