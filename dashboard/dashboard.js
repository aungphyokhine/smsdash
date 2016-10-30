'use strict';

//angular.module('smsDash.dashboard', ['ngRoute'])

//.config(['$routeProvider', function ($routeProvider) {
//    $routeProvider.when('/dashboard', {
//        templateUrl: 'dashboard/dashboard.html',
//        controller: 'DashboardCtrl'
//    });
//}])

myapp.controller('DashboardCtrl', ['$scope', 'facebookService', '$mdDialog', '$q', '$timeout', '$mdSidenav', '$rootScope', function ($scope, facebookService, $mdDialog, $q, $timeout, $mdSidenav, $rootScope) {
    console.log('dashboard run');

   
    $scope.sampleAction = function (action, evt) {
        alert(action);
    }

    //$scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.labels = ["Success", "Pending", "Fail"];
    $scope.successstatus = [0, 0];
    $scope.sentstatus = [0, 0];

    $scope.showAlert = function (ev) {
        // Appending dialog to document.body to cover sidenav in docs app
        // Modal dialogs should fully cover application
        // to prevent interaction outside of dialog
        
    
   

        $mdDialog.show(
          $mdDialog.alert()
            .parent(angular.element(document.querySelector('#popupContainer')))
            .clickOutsideToClose(true)
            .title('Please add the following number to your device.')
            .htmlContent($scope.user.get('serial') + '<small></small>')
            .ariaLabel('Alert Dialog Demo')
            .ok('Finish Adding')
            .targetEvent(ev)
        );
    };




   
  


    //var currentUser = Parse.User.current();
    //var tkquery = new Parse.Query('Posts');
    //tkquery.equalTo('uid', currentUser.id);
    //tkquery.first({
    //    success: function (object) {
    //        console.log('destoryed');
    //        object.destroy({});
    //    },
    //    error: function (error) {
    //        alert("Error: " + error.code + " " + error.message);
    //    }
    //});
    $scope.showRemoveConfirm = function (ev, did) {
        var confirm = $mdDialog.confirm()
          .title('Would you like to remove this device?')
          .textContent('Your device will completely remove and all the assigned jobs will be cancel.')
          .ariaLabel('Remove Device')
          .targetEvent(ev)
          .ok('OK')
          .cancel('Cancel');

        $mdDialog.show(confirm).then(function () {
            removeDevice(did);
        }, function () {
            
        });
    }

    function removeDevice (did) {
        var devices = $scope.user.get('devices');
        var removeIdx = devices.indexOf(did);
        if (removeIdx > -1) {
            devices.splice(removeIdx, 1);
            console.log(devices);
            $scope.user.set(devices);
            $scope.user.save(null, {
                success: function (user) {
                   
                    console.log('devices change');
                    $scope.newstatus = [];
                    $scope.$apply();
                    statusCheck();
                },
                error: function (err) {
                    console.log('devices change : ' + err.message);
                    
                }
            });
        }
        
    }

    $scope.$on('addnewdevice', function (event, args) {
       
        freshStatusListen($scope.user);
    });

    $scope.devicesubscription;


    var devicesubscription = null;
    var devicquery = new Parse.Query('Devices');
    function freshStatusListen(user) {

        if (devicesubscription) {
            devicesubscription.unsubscribe();
        }

        
        devicquery.equalTo('serial', user.get('serial') + '');
        devicquery.containedIn("deviceid", $scope.user.get('devices'));

        console.log('listen status' + user.get('serial') + ',' + $scope.user.get('devices'));
        devicesubscription = devicquery.subscribe();


        devicesubscription.on('open', () => {

            console.log('listen devices status');

        });
        devicesubscription.on('update', (newdevice) => {
            $scope.statusload = false;
            // dstatus[$scope.user.get('devices').length - 1] = null;
            var did = newdevice.get('deviceid');
            console.log('did ' + did);
            var idx = $scope.user.get('devices').indexOf(did);
            console.log('idx ' + idx);
            // dstatus[idx] = newdevice.get('info');
            dstatus[idx] = {};
            dstatus[idx].id = did;
            dstatus[idx].time = newdevice.get('time');;
            dstatus[idx].info = newdevice.get('info');



            console.log('deviceupdate event' + $scope.user.get('devices').length + "," + dstatus.length);

        });
    }

    var oldstatus = [];
    $scope.newstatus = [];
    var dstatus = [];
    var colors = [];
    var Syncfail = 0;
    $scope.statuscheckTimeout;

    var messagequerysubscription = null;
    var statuscheckInterval = null;
    function initListen(user) {
        console.log('init listen' + user.get('serial'));
        $scope.load = false;
        $scope.user = user;
        
       
//////////////////this is for message...

        $scope.successstatus = [0, 0];
        $scope.sentstatus = [0, 0];


     
        var messagequery = new Parse.Query('Messages');
        messagequery.equalTo('serial', user.get('serial'));
        if (messagequerysubscription) {
            messagequerysubscription.unsubscribe();
        }

        messagequerysubscription = messagequery.subscribe();
        
        messagequerysubscription.on('create', (messages) => {
            console.log('new messages ' + $scope.sentstatus[1]);
          
            $scope.sentstatus[1] = $scope.sentstatus[1] + 1;
            //$scope.sentstatus[0] = $scope.sentstatus[0] + 1;
            $scope.$apply();

        });
        messagequerysubscription.on('update', (messages) => {
            console.log('update messages' + $scope.successstatus[0]);
            var status = messages.get('status');
            if (status == 2) {
                $scope.successstatus[0] = $scope.successstatus[0] + 1;
            }
            else if (status == -1) {
                $scope.successstatus[1] = $scope.successstatus[1] + 1;
            }
            else if (status == 1) {
                $scope.sentstatus[0] = $scope.sentstatus[0] + 1;
            }
            
            $scope.$apply();
        });

        var pendingmessagequery = new Parse.Query('Messages');
        pendingmessagequery.equalTo('serial', user.get('serial'));
        pendingmessagequery.equalTo('status', 0);
        pendingmessagequery.count((count) => {
            $scope.sentstatus[0] = count;
            console.log('pending  ' + count);
        });

        var sentmessagequery = new Parse.Query('Messages');
        sentmessagequery.equalTo('serial', user.get('serial'));
        //sentmessagequery.equalTo('status', 1);
        sentmessagequery.count((count) => {
            $scope.sentstatus[1] = count;
            console.log('sent  ' + count);
        });

        var successmessagequery = new Parse.Query('Messages');
        successmessagequery.equalTo('serial', user.get('serial'));
        successmessagequery.equalTo('status', 2);
        successmessagequery.count((count) => {
            console.log('success  ' + count);
            $scope.successstatus[0] = count;
        });

        var failmessagequery = new Parse.Query('Messages');
        failmessagequery.equalTo('serial', user.get('serial'));
        failmessagequery.equalTo('status', -1);
        failmessagequery.count((count) => {
            console.log('fail  ' + count);
            $scope.successstatus[1] = count;
        });
////////////////////////////////////this is for devices status...

        if ($scope.user.get('devices').length > 0) {
            $scope.statusload = true;
            $scope.deviceexist = true;
        }

        freshStatusListen(user);

        setTimeout(statusCheck, 50);
        if (statuscheckInterval) {
            clearInterval(statuscheckInterval);
        }
        statuscheckInterval =  setInterval(statusCheck, 1000 * 5);
        function statusCheck () {
            $scope.statusload = false;

            
           
            if ($scope.user.get('devices')){
                for (var i = 0; i < $scope.user.get('devices').length ; i++) {
                    $scope.newstatus[i] = {};
                    $scope.newstatus[i].id = $scope.user.get('devices')[i];
                   
                    //if (!colors[i]) {
                    //    colors[i] = {
                    //        color: randomColor({
                    //            luminosity: 'light',
                    //            hue: 'blue'
                    //        })
                    //    };
                    // }
                    // $scope.newstatus[i].color = colors[i].color;

                    if (dstatus[i]) {
                        console.log('sync check');
                        $scope.newstatus[i].time = dstatus[i].time;
                        $scope.newstatus[i].info = dstatus[i].info;

                        if (oldstatus[i] != dstatus[i]) {
                            console.log('sync success');
                            $scope.newstatus[i].syncfail = 0;
                            $scope.newstatus[i].active = 0;
                            oldstatus[i] = dstatus[i];
                        }
                        else {
                            if (!$scope.newstatus[i].syncfail) {
                                $scope.newstatus[i].syncfail = 0;
                            }
                            var failcount = $scope.newstatus[i].syncfail;
                            $scope.newstatus[i].syncfail = failcount + 1;
                            console.log('sync fail : ' + $scope.newstatus[i].syncfail);
                            if ($scope.newstatus[i].syncfail > 3) {
                                $scope.newstatus[i].active = -1;
                                console.log('set sync fail');
                            }
                            else{
                                $scope.newstatus[i].active = 1;
                            }
                       

                        }
                       
                        $scope.newstatus[i].gpdata = [{ name: 'sent', value: $scope.newstatus[i].info.success },
                            { name: 'fail', value: $scope.newstatus[i].info.fail }];
                        //{ name: 'total', value: $scope.newstatus[i].info.total }];
                        //$('#info' + dstatus[i].id).sparkline([dstatus[i].info.success, dstatus[i].info.fail, dstatus[i].info.total]);
                    }
                    else {
                  

                        $scope.newstatus[i].active = -1;
                        $scope.newstatus[i].time = "not available"
                    }


                }
                $scope.$apply();
            }
            
        }
      
        
    }
    
    $scope.load = true;
    initListen($rootScope.user);


   


  






















    $scope.page = { limit: 5, pageno: 1 };

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
        paginate($scope.currentpageidx);
    }
    $scope.getmsg = function (pageidx) {
        paginate(pageidx);
    };
    $scope.currentpageidx = 1;
    function paginate(pageidx) {
        $scope.currentpageidx = pageidx;
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

    $scope.deleteRow = function () {
      
      
        $scope.csvmessages = $scope.csvmessages.filter(function (obj) {
            return $scope.selected.indexOf(obj) === -1;
        });
  
        paginate($scope.currentpageidx);
       
    }

    function insertSMS(sms) {
        console.log('insertSMS');
        if (!$scope.csvmessages) {
            $scope.csvmessages = [];
        }
       
        $scope.csvmessages.push(sms);
        console.log($scope.csvmessages.length);
        var lastpage = Math.ceil($scope.csvmessages.length / $scope.page.limit);
        paginate(lastpage);
        console.log(sms);

           
    }
    $scope.getCsv = function () {
        var data = [];
        for (var i = 0; i < $scope.csvmessages.length; i++) {
            var sms = $scope.csvmessages[i];
            data.push({Receiver:sms.Receiver,Message:sms.Message,Date:sms.Date});
        }
        return data;
    }
    $scope.editRow = function () {

    }

    function DialogController($scope, $mdDialog) {
        
        $scope.hide = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function () {
            $mdDialog.cancel();
        };
        $scope.addSMS = function () {
            insertSMS({ Receiver: $scope.sms.receiver, Message: $scope.sms.body, Date: $scope.sms.date,ID:new Date().getTime() });
            $scope.sms.body = "";
            $scope.insertstatus = 'Succssfully Added!';
            setTimeout(function () { $scope.insertstatus = '';}, 5000);
        }

        $scope.cancelSMS = function () {
            $mdDialog.hide();
        };
    }

    $scope.smsInput = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'dashboard/dialogue.html?a=2',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function () {
            $scope.status = 'You cancelled the dialog.';
        });
    };
   
    function sendMsg() {
        var devices = $rootScope.user.get('devices');

        if (devices) {
            var serial = $rootScope.user.get('serial');
            var messagelength = $scope.csvmessages.length;
            var avg = Math.ceil(messagelength / devices.length);

            var deviceslength = devices.length;
            var didx = 0;
            while ($scope.csvmessages.length > 0) {
                //var csvdata = $scope.csvmessages[i];
                var csvdata = $scope.csvmessages.pop();
          
                var did = devices[didx];
                didx++;
                   
                    console.log('save message : ' + serial + ',' + did);

                    var messageClass = Parse.Object.extend('Messages');
                    var message = new messageClass();
                    message.set('token', $rootScope.user.get('apitoken'));
                    message.set('serial', serial);
                    message.set('deviceid', did);

                    message.set('receiver', csvdata.Receiver);
                    message.set('body', csvdata.Message);
                    //message.set('date', csvdata.Date);
                   // message.set('time', csvdata.date);
                    message.set('status', 0);
                    //Save object to DB
                  
                    message.save(null, {
                        success: function (msg) {
                            console.log("save message : " + msg.id);
                            console.log('receiver : ' + msg.get('receiver') + " did : " + msg.get('deviceid'));
                        },
                        error: function (err) {
                            console.log('Failed to save message, with error code: ' + err.message);

                        }
                    });

                    if (didx >= deviceslength) {
                        didx = 0;
                    }
                
            }
            $scope.pagemessages = null;
            $scope.csvmessages = null;
        }

    }


    $scope.sendSms = function () {


        setTimeout(sendMsg, 50);


    };
    $scope.clearsms = function () {
        // var serial = $scope.user.get('serial');
        // var did = $scope.user.get('devices')[0];
        var query = new Parse.Query('Messages');
        // query.equalTo('serial', serial);
        // query.equalTo('deviceid', did);
        query.find().then(function (messages) {
            for (var message of messages) {
                message.destroy({});
            }
        })
    }

 
    $scope.slide = 0;
    $scope.slickConfig = {
        enabled: true,
        autoplay: true,
        draggable: false,
        autoplaySpeed: 10000,
        method: {},
        event: {
            beforeChange: function (event, slick, currentSlide, nextSlide) {
            },
            afterChange: function (event, slick, currentSlide, nextSlide) {
                $scope.slide = currentSlide;
                console.log(currentSlide);
            }
        }
       
    };
    setTimeout(function () { $scope.slideready = true;}, 500);
}]);

