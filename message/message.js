'use strict';

myapp.controller('MessageCtrl', ['$scope', 'facebookService', '$mdDialog', '$q', '$timeout', '$mdSidenav', '$rootScope', function ($scope, facebookService, $mdDialog, $q, $timeout, $mdSidenav, $rootScope) {


    $scope.settings = {
        showCreateDate: true,
        showNo: true,
        showMessage: true,
        filter:{
        showSuccess: true,
        showFail: true,
        showPending: true
        }
    };
    $scope.page = { limit: 5, pageno: 1, order: null, data: null, total: 0 };

    $scope.$watch('settings.filter', function (newVal, oldVal) {
        getSMS();
    }, true);
    getSMS();
    $scope.getData = function () {
        console.log('change data');
        getSMS();
    }
    function getSMS() {
        $scope.statusload = true;
        var query = new Parse.Query('Messages');
        query.equalTo('serial', $rootScope.user.get('serial'));
        if (!($scope.settings.filter.showSuccess && $scope.settings.filter.showPending && $scope.settings.filter.showFail)) {
            var filter = [];
            if ($scope.settings.filter.showSuccess) {
                filter.push(2);
            }
            if ($scope.settings.filter.showFail) {
                filter.push(-1);
            }
            if ($scope.settings.filter.showPending) {
                filter.push(0);

            }
            query.containedIn("status", filter);
        }

        query.count(function (count) { $scope.page.total = count });

        if ($scope.page.order) {
            if ($scope.page.order == "receiver") {
                query.ascending("receiver");
            }
            else if ($scope.page.order == "-receiver") {
                query.descending("receiver");
            }
            else if ($scope.page.order == "time") {
                query.ascending("time");
            }
            else if ($scope.page.order == "-time") {
                query.descending("time");
            }
            
        }
        if ($scope.page.pageno != 1) {
            query.skip($scope.page.limit * ($scope.page.pageno - 1));
        } 
        query.limit($scope.page.limit);

        query.find(function (msgs)
        {
            $scope.statusload = false;
            $scope.page.data = [];
            var start = $scope.page.limit * ($scope.page.pageno - 1);
           
            for (var i = 0; i < msgs.length; i++) {
                var message = {
                    no: start + i + 1,
                    did: msgs[i].get('deviceid'),
                    receiver: msgs[i].get('receiver'),
                    body: msgs[i].get('body'),
                    time: msgs[i].get('time'),
                    status: msgs[i].get('status')
                };
                $scope.page.data.push(message);
            }
            $scope.$apply();
            console.log($scope.page.data);
        },
            function ()
            {
                $scope.statusload = false;
            });
    }


    
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
    $scope.getmsg = function (pageidx) {
        paginate(pageidx);
    };

    function paginate(pageidx) {
        $scope.pagemessages = [];
        var start = (pageidx - 1) * $scope.page.limit;
        var end = pageidx * $scope.page.limit;
        if (end > $scope.csvmessages.length) {
            end = $scope.csvmessages.length;
        }

        for (var i = start; i < end; i++) {
            $scope.pagemessages.push($scope.csvmessages[i]);
        }
        console.log($scope.pagemessages);
    }


    var oldcsv = {};
   
    $scope.pagemessages = [];
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
            paginate(1);
        }, null, function (p) { console.log('csv% ' + p) });
    }
    $scope.csvimport = function () {
        if ($scope.csv.result != oldcsv) {
            oldcsv = $scope.csv.result;
            

        }
       
    }

}]);

