'use strict';

myapp.controller('TourCtrl', ['$scope', 'facebookService', '$mdDialog', '$q', '$timeout', '$mdSidenav', function ($scope, facebookService, $mdDialog, $q, $timeout, $mdSidenav) {

    $scope.csv = {
        content: {},
        header: {},
        separator: ",",
        result: {},
        accept: '.csv',
        acceptSize: 5 * 1024,
        // encoding: 'utf8',
        // encodingVisible: true,

        //  acceptSizeExceedCallback: function () { console.log('file size exceed'); }
    };
    $scope.selected = [];
    $scope.csvoverlimit = function () { }

    function dynamicSort(property) {
        var sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a, b) {
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }
    $scope.ordercsv = function (order) {
        $scope.csvmessages.sort(dynamicSort(order));
    }
    var oldcsv = {};

    $scope.csvprocess = function (defer) {
        defer.then(function (e) {
            console.log('csv finish');
            console.log('import csv');
            $scope.csvmessages = [];
            for (var i = 0; i < $scope.csv.result.length; i++) {
                var row = $scope.csv.result[i];
                row.id = i;
                $scope.csvmessages.push(row);
            }
        }, null, function (p) { console.log('csv% ' + p) });
    }
    $scope.csvimport = function () {
        if ($scope.csv.result != oldcsv) {
            oldcsv = $scope.csv.result;


        }
    }
}]);

