'use strict';

// Declare app level module which depends on views, and components
var myapp = angular.module('smsDash', [
  'ngMaterial', 'ngSanitize', 'ngRoute', 'ngMdIcons', 'monospaced.qrcode', 'chart.js', 'ngCsvImport', 'md.data.table', 'angular-svg-round-progressbar', 'ngCsv', 'slickCarousel', 'pascalprecht.translate', 'ngSessionStorage'
]).
config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
  
    $routeProvider.when('/home', {
        templateUrl: 'dashboard/dashboard.html?b=5',
        controller: 'DashboardCtrl'
         })
        .when('/settings', {
            templateUrl: 'settings/settings.html?c=5',
            controller: 'SettingsCtrl'
        })
         .when('/message', {
             templateUrl: 'message/message.html?b=6',
             controller: 'MessageCtrl'
         })
          .when('/register', {
              templateUrl: 'register/register.html?b=12',
              controller: 'RegisterCtrl'
          })
        .otherwise({ redirectTo: '/home' });
}])
 .config(function ($mdThemingProvider) {

    $mdThemingProvider.theme('default')
      .primaryPalette('indigo', {
          'default': '400', // by default use shade 400 from the pink palette for primary intentions
          'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
          'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
          'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
      })
      // If you specify less than all of the keys, it will inherit from the
      // default shades
      .accentPalette('purple', {
          'default': '200' // use shade 200 for default, and keep all other shades the same
      });

 })
.controller('TitleController', function ($scope) {
    $scope.title = 'My App Title';

   
})
.run(function () {
    Parse.initialize('th!s!skey');

    Parse.serverURL = 'https://smsio-gistracker.rhcloud.com/parse';
    //Parse.serverURL = 'http://localhost:1337/parse';
    Parse.liveQueryServerURL = 'ws://smsio-gistracker.rhcloud.com:8000/parse'

  
        Parse.FacebookUtils.init({
            appId: '1738512936400445',
            status: false,
            cookie: true,
            xfbml: true,
            version: 'v2.4'
        });
       
   
})
.factory('facebookService', function ($q) {
    return {
        getMyLastName: function () {
            var deferred = $q.defer();
            FB.api('/me', {
                fields: 'last_name'
            }, function (response) {
                if (!response || response.error) {
                    deferred.reject('Error occured');
                } else {
                    deferred.resolve(response);
                }
            });
            return deferred.promise;
        }
    }
});



myapp.config(function ($translateProvider) {
    $translateProvider.translations('en', {
        ADD_MESSAGE_DESC: 'You can export or import sms messages from csv csv file. To add sms one by one, click the pen icon from the right and you can also remove by making selection and click cut icon. To send sms messages, click add to devices button.',
        ABOUT_DESC: 'This application can interact with multiple mobile devices for scalability. Can send massive sms by importing file and also allow single input manually. For advance users, it allows sms API. The user can monitor all devices connection status and messages status from one place. The application can handle load balancing purpose also. This is the beta program. If you found any bugs or error, can report to thargyee@gmail.com. This system is only intended for personel use. For commercial purpose, It should be deployed on own server or hosting to make better performance and security. For offline usage, you may need to deploy these application on your own network.',
        ADD_DEVICE_DESC: 'Firstly the system need to connect with your mobile device,that will use for sending sms. You may need to install android apk on your device. After installation, scan below QR code. When the system receive device request, the confirmation dialogue will show. You may need to approve to pair device. When sucessfully connect with your device, the attached device will show on dashboard page.',
        MESSAGE_HISTORY_DESC: 'You can check transaction history here. You can filter by sucessful, pending or fail sms status.',
        API_DESC: 'The system also allow to connect through from API, Request headers should be as per example. The request data must be json in post method. User id and token are as per example data. (user id and token will differ for each account). To send sms, You need to change appropriate receiver no and message body.',
    });
    $translateProvider.translations('mmzg', {
        ADD_MESSAGE_DESC: 'ေပးပို႔မည့္ sms မ်ားကို csv file ျဖင့္အသြင္းအထုတ္ျပဳလုပ္နိုင္ပါသည္။ ညာဖက္စြန္းရွိ ခဲတံပုံ ကိုႏွိပ္ၿပီး တေစာင္ခ်င္း လဲထည့္သြင္းနိုင္ပါသည္။ ဖယ္ရွားလိုသည့္ sms မ်ားကို အမွတ္အသားျပဳကာ ကတ္ေၾကးပုံကိုႏွိပ္ၿပီး ဖယ္ရွားနိုင္ပါသည္။ ေပးပို႔ရန္ အဆင္သင့္ျဖစ္ပါက device သို႔ေပးပို႔ရန္ ခလုတ္ကို ႏွိပ္ေပးပါ။',
        ABOUT_DESC: 'ဒီစနစ္ဟာ sms အမ်ားအျပားပို႔ဖို႔ ကူညီ ေဆာင္ရြက္ေပးနိုင္ပါတယ္။ sms ေပးပို႔ဖို႔အတြက္အသုံး ျပဳမဲ့ဖုန္းကို server နဲ႔ခ်ိတ္ဆက္နိုင္ဖို႔ အင္တာနက္ဖြင့္ထားေပးဖို႔ေတာ့လိုပါမယ္။ csv ဖိုင္မွတဆင့္ sms ေစာင္ေရအမ်ားအျပားကိုအလြယ္တကူ ေပးပို႔နိုင္ပါတယ္။ ခ်ိတ္ဆက္မွုအေနနဲ႔ API မွတဆင့္လဲ တျခားစနစ္မ်ားနဲ႔ အလြယ္တကူခ်ိတ္ဆက္နိုင္ပါတယ္။  စြမ္းေဆာင္ရည္ပိုေကာင္းဖို႔အတြက္ device အမ်ားအျပား သုံးနိုင္ၿပီး device ေတြကို စနစ္အတြက္သီးျခားထားစရာ မလိုဘဲ ပုံမွန္သုံးစြဲရင္းနဲ႔ခ်ိတ္ဆက္ထားနိုင္ပါတယ္။ တေနရာထဲကေနၿပီး device ေတြရဲ့ ဆက္သြယ္မွုအေျခအေန sms ေပးပို႔ျခင္းအေျခအေနမ်ားကိုေစာင့္ၾကပ္ၾကည့္ရွုနိုင္ပါတယ္။ စနစ္ကေနၿပီး အလိုအေလ်ာက္ အလုပ္မ်ားကို device အားလုံးအတြက္ ညီမၽွေအာင္ ကိုင္တြယ္ေဆာင္ရြက္ေပးပါတယ္။ local network ဒါမဟုတ္ wifi ေပၚကေန offline သုံးစြဲဖို႔ဆိုရင္ေတာ့ ကိုယ္ပိုင္ server ေထာင္ဖို႔လိုအပ္ပါတယ္။',
        ADD_DEVICE_DESC: 'ပထမဆုံးအေနနဲ႔ သင့္ရဲ့sms ေပးပို႔မဲ့ mobile device ကိုစနစ္နဲ႔ခ်ိတ္ဆက္ဖို႔အတြက္ android apk သြင္းေပးရန္လိုပါတယ္။ မိုဘိုင္းဖုန္းရဲ့ app ကေနတဆင့္ ေအာက္မွာေဖာ္ျပထားတဲ့ QR code ကို scan လုပ္ပါ။ Device ရဲ့ ခ်ိတ္ဆက္မွုအတြက္ စနစ္မွာ confirm dialogue တက္လာပါမယ္။ လက္ခံမွုကိုရရွိရင္ device နဲ႔ဆက္သြယ္မွုရရွိပါမယ္။ device နဲ႔ခ်ိတ္ဆက္မွုရွိမရွိ home page မွာၾကည့္ရွုနိုင္ပါတယ္။',
        MESSAGE_HISTORY_DESC: 'ေပးပို႔ခဲ့ေသာ sms မ်ားစာရင္းကို ဒီေနရာမွာ ၾကည့္ရွုနိုင္ပါသည္။ ပို႔ေဆာင္မွုၿပီးဆုံး သြားေသာ sms မ်ား၊ ေပးပို႔ရန္က်န္ရွိေနေသာ sms မ်ား ႏွင့္  ေပးပို႔မွုမေအာင္ျမင္ေသာ sms မ်ားကို ရွာေဖြနိုင္ပါသည္။',
        API_DESC: 'api မွတဆင့္လဲခ်ိတ္ဆက္ နိုင္ပါတယ္။ Request header ကိုေဖာ္ျပထားတဲ့အတိုင္းထည့္သြင္းပါ။ ေပးပို႔လိုေသာ data ကို json post method နဲ႔ေပးပို႔ရပါမယ္။ user id နဲ႔ token ကေဖာ္ျပထားတဲ့အတိုင္းပါဘဲ။(account တခုခ်င္းစီအတြက္ uid နဲ႔ token မတူနိုင္ပါ)။ receiver နဲ႔ message ကို ေပးပို႔လိုေသာ ဖုန္းနံပါတ္နဲ႔ အေၾကာင္းအရာထည့္သြင္း ေပးရပါမယ္။',
    });
    $translateProvider.translations('mm', {
        ADD_MESSAGE_DESC: 'ပေးပို့မည့် sms များကို csv file ဖြင့်အသွင်းအထုတ်ပြုလုပ်နိုင်ပါသည်။ ညာဖက်စွန်းရှိ ခဲတံပုံ ကိုနှိပ်ပြီး တစောင်ချင်း လဲထည့်သွင်းနိုင်ပါသည်။ ဖယ်ရှားလိုသည့် sms များကို အမှတ်အသားပြုကာ ကတ်ကြေးပုံကိုနှိပ်ပြီး ဖယ်ရှားနိုင်ပါသည်။ ပေးပို့ရန် အဆင်သင့်ဖြစ်ပါက device သို့ပေးပို့ရန် ခလုတ်ကို နှိပ်ပေးပါ။',
        ABOUT_DESC: 'ဒီစနစ်ဟာ sms အများအပြားပို့ဖို့ ကူညီ ဆောင်ရွက်ပေးနိုင်ပါတယ်။ sms ပေးပို့ဖို့အတွက်အသုံး ပြုမဲ့ဖုန်းကို server နဲ့ချိတ်ဆက်နိုင်ဖို့ အင်တာနက်ဖွင့်ထားပေးဖို့တော့လိုပါမယ်။ csv ဖိုင်မှတဆင့် sms စောင်ရေအများအပြားကိုအလွယ်တကူ ပေးပို့နိုင်ပါတယ်။ ချိတ်ဆက်မှုအနေနဲ့ API မှတဆင့်လဲ တခြားစနစ်များနဲ့ အလွယ်တကူချိတ်ဆက်နိုင်ပါတယ်။  စွမ်းဆောင်ရည်ပိုကောင်းဖို့အတွက် device အများအပြား သုံးနိုင်ပြီး device တွေကို စနစ်အတွက်သီးခြားထားစရာ မလိုဘဲ ပုံမှန်သုံးစွဲရင်းနဲ့ချိတ်ဆက်ထားနိုင်ပါတယ်။ တနေရာထဲကနေပြီး device တွေရဲ့ ဆက်သွယ်မှုအခြေအနေ sms ပေးပို့ခြင်းအခြေအနေများကိုစောင့်ကြပ်ကြည့်ရှုနိုင်ပါတယ်။ စနစ်ကနေပြီး အလိုအလျောက် အလုပ်များကို device အားလုံးအတွက် ညီမျှအောင် ကိုင်တွယ်ဆောင်ရွက်ပေးပါတယ်။ local network ဒါမဟုတ် wifi ပေါ်ကနေ offline သုံးစွဲဖို့ဆိုရင်တော့ ကိုယ်ပိုင် server ထောင်ဖို့လိုအပ်ပါတယ်။',
        ADD_DEVICE_DESC: 'ပထမဆုံးအနေနဲ့ သင့်ရဲ့sms ပေးပို့မဲ့ mobile device ကိုစနစ်နဲ့ချိတ်ဆက်ဖို့အတွက် android apk သွင်းပေးရန်လိုပါတယ်။ မိုဘိုင်းဖုန်းရဲ့ app ကနေတဆင့် အောက်မှာဖော်ပြထားတဲ့ QR code ကို scan လုပ်ပါ။ Device ရဲ့ ချိတ်ဆက်မှုအတွက် စနစ်မှာ confirm dialogue တက်လာပါမယ်။ လက်ခံမှုကိုရရှိရင် device နဲ့ဆက်သွယ်မှုရရှိပါမယ်။ device နဲ့ချိတ်ဆက်မှုရှိမရှိ home page မှာကြည့်ရှုနိုင်ပါတယ်။',
        MESSAGE_HISTORY_DESC: 'ပေးပို့ခဲ့သော sms များစာရင်းကို ဒီနေရာမှာ ကြည့်ရှုနိုင်ပါသည်။ ပို့ဆောင်မှုပြီးဆုံး သွားသော sms များ၊ ပေးပို့ရန်ကျန်ရှိနေသော sms များ နှင့်  ပေးပို့မှုမအောင်မြင်သော sms များကို ရှာဖွေနိုင်ပါသည်။',
        API_DESC: 'api မှတဆင့်လဲချိတ်ဆက် နိုင်ပါတယ်။ Request header ကိုဖော်ပြထားတဲ့အတိုင်းထည့်သွင်းပါ။ ပေးပို့လိုသော data ကို json post method နဲ့ပေးပို့ရပါမယ်။ user id နဲ့ token ကဖော်ပြထားတဲ့အတိုင်းပါဘဲ။(account တခုချင်းစီအတွက် uid နဲ့ token မတူနိုင်ပါ)။ receiver နဲ့ message ကို ပေးပို့လိုသော ဖုန်းနံပါတ်နဲ့ အကြောင်းအရာထည့်သွင်း ပေးရပါမယ်။',
    });
    $translateProvider.preferredLanguage('mm');
});




















myapp.controller('AppCtrl', ['$scope', 'facebookService', '$mdDialog', '$q', '$timeout', '$mdSidenav', '$rootScope', '$translate', '$sessionStorage', function ($scope, facebookService, $mdDialog, $q, $timeout, $mdSidenav, $rootScope, $translate, $sessionStorage) {

    $scope.selectedLang = { desc: 'Language', value: 'en' };
    var currentLang = $sessionStorage.get('sln');
  
    if (currentLang) {
        $scope.selectedLang = JSON.parse(currentLang);
        console.log($scope.selectedLang);
        $translate.use($scope.selectedLang.value);
    }
    else {
        $sessionStorage.put('sln', JSON.stringify($scope.selectedLang));
    }

   
    $scope.setLang = function (id) {
        $scope.selectedLang.value = id;
        $translate.use(id);
        if (id == 'en') {
            $scope.selectedLang.desc = "English";         
           
        }
        else if (id == 'mmzg') {
            $scope.selectedLang.desc = "ေဇာ္ဂ်ီျမန္မာ";
       
        }
        else {
            $scope.selectedLang.desc = "ယူနီကုဒ်မြန်မာ";
        }
        $sessionStorage.put('sln', JSON.stringify($scope.selectedLang));
    }

    $scope.load = true;
    initApp().then(function (user) {
        console.log('init success');
        $rootScope.user = user;
        //listenRequest(user);
    },

        function (err) {
            $scope.load = false;
            console.log('cannot init app');
        });

    function initApp() {

        var defer = $q.defer();
        $scope.loggedin = false;
        var currentUser = Parse.User.current();
        if (currentUser) {
            createuser(currentUser).then(function (user) {

                listenRequest(user);

                $scope.user = user;
                $scope.profile = user.get('profile');
                $scope.loggedin = true;
                $scope.load = false;
                console.log('init create user');
                defer.resolve(user);
            }, function (err) {
                console.log(err);
                $scope.load = false;
                defer.reject('create user fail');
            });
        }
        else {
            FB.logout(function (response) {
                // user is now logged out
            });
            $scope.load = false;
            defer.reject('logged out');
        }
        return defer.promise;
    }

    var originatorEv;

   $scope.openMenu = function ($mdOpenMenu, ev) {
        originatorEv = ev;
        $mdOpenMenu(ev);
   };
   $scope.gomessages = function () { window.location.href = '#/message'; };
   $scope.goAddDevice = function () { window.location.href = '#/register'; };
   $scope.gosettings = function () {
       console.log('go setting');
       window.location.href = '#/settings';
   };

    function setprofile() {
        var defer = $q.defer();
        var fbuser = {};
        FB.getLoginStatus(function (response) {
            if (response.status === 'connected') {
                // the user is logged in and has authenticated your
                // app, and response.authResponse supplies
                // the user's ID, a valid access token, a signed
                // request, and the time the access token 
                // and signed request each expire
                fbuser.uid = response.authResponse.userID;
                fbuser.accessToken = response.authResponse.accessToken;

                FB.api('/me?fields=name,email,picture', function (me) {
                    fbuser.photourl = me.picture.data.url;
                    fbuser.email = me.email;
                    fbuser.name = me.name;
                    console.log('get fb user');
                    defer.resolve(fbuser);
                });


            } else if (response.status === 'not_authorized') {
                // the user is logged in to Facebook, 
                // but has not authenticated your app
                defer.reject('not_authorized');
            } else {
                // the user isn't logged in to Facebook.
                defer.reject('not_login');
            }
        });
        return defer.promise;
    }

   


    $scope.logout = function () {
        //FB.logout(function (response) {
        //    // user is now logged out
        //});

        Parse.User.logOut();
        $scope.user = null;

    };

  

    function getuser(currentUser) {
        var defer = $q.defer();
        console.log('get user');
        var userquery = new Parse.Query('Users');
        userquery.equalTo('uid', currentUser.id);
        userquery.first({
            success: function (user) {
               
                defer.resolve(user);
                console.log('get user success');
            },
            error: function (error) {
                // alert("Error: " + error.code + " " + error.message);
                defer.reject(err);
            }
        });
        return defer.promise;
    }

    //function setuser(currentUser) {

    //        console.log('user set');
    //        var userquery = new Parse.Query('Users');
    //        userquery.equalTo('id', currentUser.id);
    //        tkquery.count({
    //            success: function (count) {
    //                console.log('user count : ' + count)
    //                if (count == 0) {
    //                    console.log('user not exist, create one')
    //                    idsetup().then(function (id) {
    //                        createuser(currentUser);
    //                    }, function (err) {
    //                        console.log('cannot create user');
    //                    });
    //                }
    //                else {
    //                    getuser(currentUser);
    //                }
    //            },
    //            error: function (error) {
    //                alert("Error: " + error.code + " " + error.message);
    //            }
    //        });

    //}


    function createuser(currentUser) {
        var defer = $q.defer();

        //deluser(currentUser);

        setprofile().then(function (fbuser) {


            getuser(currentUser).then(function (olduser) {
                if (olduser) {
                    olduser.set('profile', fbuser);
                    olduser.save();
                    console.log(olduser.get('serial'));
                    return defer.resolve(olduser);
                }
                else {
                    var userClass = Parse.Object.extend('Users');
                    var newuser = new userClass();
                    var acl = new Parse.ACL(Parse.User.current());
                    acl.setPublicReadAccess(true);
                    newuser.setACL(acl);
                    console.log(currentUser.id);
                    console.log(fbuser);
                    //Add data you want to save as a hush
                    newuser.set('uid', currentUser.id);
                    newuser.set('profile', fbuser);
                    newuser.set('devices', []);
                    //Save object to DB

                    newuser.save(null, {
                        success: function (user) {
                            console.log("'New User created with objectId: " + user.id);
                            console.log(user.get('serial'));
                            return defer.resolve(user);
                        },
                        error: function (err) {
                            console.log('Failed to create new user, with error code: ' + err.message);
                            return defer.reject('fail to create user');
                        }
                    });
                }
            },
            function () {
                defer.reject('error get user');
            });




        },
            function (err) {
                defer.reject(err);
            });
        return defer.promise;
    }

    function fbin() {
        $scope.load = true;
        Parse.FacebookUtils.logIn(null, {
            success: function (user) {
                if (!user.existed()) {
                    console.log("User signed up and logged in through Facebook!");
                } else {
                    console.log("User logged in through Facebook!");
                }

                initApp().then(function (user) {
                    $rootScope.user = user;
                   // initListen(user);
                }, function (

                ) { });
            },
            error: function (user, error) {
                $scope.load = false;
                console.log("User cancelled the Facebook login or did not fully authorize.");

            }
        });
    }

    $scope.fblogin = function () {
        fbin();
    }



    $scope.resetall = function () {
        let query = new Parse.Query('Messages');
        // query.equalTo('serial', serial);
        // query.equalTo('deviceid', did);
        query.limit(1000);
        query.find().then(function (messages) {
            for (let message of messages) {
                message.destroy({});
            }
        });
        let userquery = new Parse.Query('Users');
        // query.equalTo('serial', serial);
        // query.equalTo('deviceid', did);
        userquery.limit(1000);
        userquery.find().then(function (messages) {
            for (let message of messages) {
                message.destroy({});
            }
        })
        let reqquery = new Parse.Query('DeviceRequests');
        // query.equalTo('serial', serial);
        // query.equalTo('deviceid', did);
        reqquery.limit(1000);
        reqquery.find().then(function (messages) {
            for (let message of messages) {
                message.destroy({});
            }
        })
        let devquery = new Parse.Query('Devices');
        // query.equalTo('serial', serial);
        // query.equalTo('deviceid', did);
        devquery.limit(1000);
        devquery.find().then(function (messages) {
            for (let message of messages) {
                message.destroy({});
            }
        })
    }

    var subscription = null;
    var query = new Parse.Query('DeviceRequests');
    function listenRequest(user) {
        console.log('start listen register devices');
        if (subscription) {
            subscription.unsubscribe();
        }
       
        query.equalTo('serial', user.get('serial'));
        subscription = query.subscribe();
        subscription.on('open', () => {
            console.log('listen devices success');
        });
        subscription.on('create', (newdevice) => {
            console.log('new device' + newdevice.id);
            confirmNewDevice(newdevice);

        });
    }


    function confirmNewDevice(device) {

        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
              .title('Device Register')
              .textContent('Would you like to accept this device? Requested device Id is ' + device.get('deviceid'))
              .ariaLabel('Device Register')
            //  .targetEvent(ev)
              .ok('Accept')
              .cancel('Reject');
        var devices = $scope.user.get('devices');

        if (devices) {

            if (devices.indexOf(device.get('deviceid')) == -1) {
                $mdDialog.show(confirm).then(function () {

                    $scope.deviceexist = true;

                    var newdeviceid = device.get('deviceid');
                    if (devices.indexOf(newdeviceid) <= -1) {
                        devices.push(newdeviceid);                     
                    }
                    
                    console.log('new device add')
                  

                    console.log(devices);
                    $scope.user.set('devices', devices);
                   

                    $scope.user.save(null, {
                        success: function (user) {
                            console.log('Saved device ');
                            device.set('pass', true);
                            console.log('set device token ' + $scope.user.get('apitoken'));
                            device.set('token', $scope.user.get('apitoken'));
                            device.save();
                            window.location.href = '#/home';
                        },
                        error: function (err) {
                            console.log('Failed to save device: ' + err.message);

                        }
                    });
                 //   freshStatusListen($scope.user);
                    $rootScope.$broadcast('addnewdevice');
                }, function () {
                    device.set('token', null);
                    device.set('pass', false);
                    device.save();
                    $scope.status = 'You reject to add.';
                });

            }
            else {
                device.set('pass', true);
                console.log('change device token ' + $scope.user.get('apitoken'));
                device.set('token', $scope.user.get('apitoken'));
                device.save();
                $mdDialog.show(
               $mdDialog.alert()
                 .parent(angular.element(document.querySelector('#popupContainer')))
                 .clickOutsideToClose(true)
                 .title('Device Register')
                 .textContent('This device is already registered.')
                 .ariaLabel('Device Register')
                 .ok('OK'));

                console.log('device already registered')
            }
        }

    }
}]);

