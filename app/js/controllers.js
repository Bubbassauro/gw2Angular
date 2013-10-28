'use strict';

/* Controllers */
function ItemListCtrl($scope, $http) {
    $scope.orderProp = 'profit';
    $scope.reverse = true;
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
                    $scope.itemCount = results.length;
                }
                $scope.items = allItems;

                $scope.done = true;
            });
    };

    $scope.findItem = function(value) {
        var low = 0;
        var high = $scope.items.length -1;
        while (low <= high) {
            var mid = Math.ceil(low + ((high - low) / 2));
            if ($scope.items[mid].data_id > value)
                high = mid - 1;
            else if ($scope.items[mid].data_id < value)
                low = mid + 1;
            else
                return $scope.items[mid]; // found
        }
        return -1; // not found
    };

    $scope.filterOut = function(item) {
        if (!$scope.exclude)
            return true;

        var re = new RegExp($scope.exclude, "gi");
        if (item.name.match(re))
            return false;
        else
            return true;
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
        $scope.items =  data.results;
        $scope.loadFromApi();
    });
}

