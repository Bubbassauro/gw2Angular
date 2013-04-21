'use strict';

/* Controllers */
function ItemListCtrl($scope, $http) {
    $scope.orderProp = 'profit';
    $scope.itemCount = 0;
    $scope.limit = 50;
    $scope.items = [];
    $scope.done = false;

    var apiUrl = 'http://www.gw2spidy.com/api/v0.9/json/';

    //Use this to run tests locally
    //var apiUrl = 'http://localhost:8888?callback=JSON_CALLBACK&from=http://localhost:8000/app/data/';

    $scope.loadFromApi = function () {

        $http({
            method: 'JSONP',
            url: apiUrl + 'all-recipes/all?callback=JSON_CALLBACK',
            cache: true
        }).then(function (response) {

                var results = response.data.results;
                var allItems = [];

                // join recipes and items info
                for (var r = 0; r < results.length; r++) {
                    var row = results[r];
                    // calculate profit
                    row.profit = (row.result_item_min_sale_unit_price * .85) - row.crafting_cost;
                    // get item details
                    var details = $scope.findItem(row.result_item_data_id);
                    if (details) {
                        row.rarity = details.rarity;
                        row.offer_availability = details.offer_availability;
                        row.sale_availability = details.sale_availability;
                        row.type_id = details.type_id;
                    }
                    allItems.push(row);
                }
                $scope.items = allItems;
                $scope.itemCount = results.length;
                $scope.done = true;
            });
    };

    $scope.findItem = function (id) {
        for (var i = 0; i < $scope.all.length; i++) {
            if ($scope.all[i].data_id == id) {
                return $scope.all[i];
            }
        }
    }

    // load rarities
    $http({
        method : 'JSONP',
        url : apiUrl + 'rarities?callback=JSON_CALLBACK',
        cache : true
    }).success(function (data) {
        $scope.rarities = data.results;
    });

    // load types
    $http({
        method : 'JSONP',
        url : apiUrl + 'types?callback=JSON_CALLBACK',
        cache : true
    }).success(function (data) {
        $scope.types = data.results;
    });

    // load disciplines
    $http({
        method : 'JSONP',
        url : apiUrl + 'disciplines?callback=JSON_CALLBACK',
        cache : true
    }).success(function (data) {
        $scope.disciplines = data.results;
    });

    // load all items
    $http({
        method : 'JSONP',
        url : apiUrl + 'all-items/all?callback=JSON_CALLBACK',
        cache : true
    }).success(function (data) {
        $scope.all = data.results;
        $scope.items =  data.results;
        $scope.loadFromApi();
    });
}

