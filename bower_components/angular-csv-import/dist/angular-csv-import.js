/*! angular-csv-import - v0.0.31 - 2016-07-07
* Copyright (c) 2016 ; Licensed  */
'use strict';

var csvImport = angular.module('ngCsvImport', []);

csvImport.directive('ngCsvImport', function($q) {
	return {
		restrict: 'E',
		transclude: true,
		replace: true,
		scope:{
			content:'=?',
			header: '=?',
			headerVisible: '=?',
			separator: '=?',
			separatorVisible: '=?',
			result: '=?',
			encoding: '=?',
			encodingVisible: '=?',
			accept: '=?',
			callback: '=?',
			process: '=?'
		},
		template: '<div>'+
		  '<div ng-show="headerVisible"><div class="label">Header</div><input type="checkbox" ng-model="header"></div>'+
			'<div ng-show="encoding && encodingVisible"><div class="label">Encoding</div><span>{{encoding}}</span></div>'+
			'<div ng-show="separator && separatorVisible">'+
			'<div class="label">Seperator</div>'+
			'<span><input class="separator-input" type="text" ng-change="changeSeparator" ng-model="separator"><span>'+
			'</div>'+
			'<div><input id="fileinput" class="btn cta gray" type="file" multiple accept="{{accept}}"/></div>'+
			'</div>',
		link: function (scope, element) {
		 
		    var defer = $q.defer();

			scope.separatorVisible = scope.separatorVisible || false;
			scope.headerVisible = scope.headerVisible || false;

			angular.element(element[0].querySelector('.separator-input')).on('keyup', function (e) {
			   
			    if (scope.content != null) {
			       
					var content = {
						csv: scope.content,
						header: scope.header,
						separator: e.target.value,
						encoding: scope.encoding
					};
					defer.notify(30);
					scope.result = csvToJSON(content, defer);
					defer.notify(90);
					scope.$apply();
					scope.callback(e);
					defer.resolve(e);
					scope.process(defer.promise);
				}
			});

			element.on('change', function(onChangeEvent) {
				if (!onChangeEvent.target.files.length){
					return;
				}
				 
				defer.notify(10);
				console.log('csv load');
				scope.filename = onChangeEvent.target.files[0].name;
				var reader = new FileReader();
				reader.onload = function(onLoadEvent) {
					scope.$apply(function() {
						var content = {
							csv: onLoadEvent.target.result.replace(/\r\n|\r/g,'\n'),
							header: scope.header,
							separator: scope.separator
						};
						scope.content = content.csv;
						defer.notify(30);
						scope.result = csvToJSON(content, defer);
						defer.notify(90);
						scope.result.filename = scope.filename;
						scope.$$postDigest(function () {
						    
						    scope.callback(onChangeEvent);
						    defer.resolve(onChangeEvent);
						    scope.process(defer.promise);
						    document.getElementById("fileinput").value = "";
						});
					});
				};

				if ( (onChangeEvent.target.type === "file") && (onChangeEvent.target.files != null || onChangeEvent.srcElement.files != null) )  {
					reader.readAsText((onChangeEvent.srcElement || onChangeEvent.target).files[0], scope.encoding);
				} else {
					if ( scope.content != null ) {
						var content = {
							csv: scope.content,
							header: !scope.header,
							separator: scope.separator
						};
						defer.notify(30);
						scope.result = csvToJSON(content, defer);
						defer.notify(90);
						scope.$$postDigest(function(){
						    scope.callback(onChangeEvent);
						    defer.resolve(onChangeEvent);
						    scope.process(defer.promise);
						    document.getElementById("fileinput").value = "";
						});
					}
				}
			});

			var csvToJSON = function (content, defer) {
			    setTimeout(function () { }, 30000);

				var lines=content.csv.split(new RegExp('\n(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
				var result = [];
				var start = 0;
				var columnCount = lines[0].split(content.separator).length;

				var headers = [];
				if (content.header) {
					headers=lines[0].split(content.separator);
					start = 1;
				}
				defer.notify(32);
			
				for (var i=start; i<lines.length; i++) {
					var obj = {};
					var currentline=lines[i].split(new RegExp(content.separator+'(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));
					if ( currentline.length === columnCount ) {
						if (content.header) {
							for (var j=0; j<headers.length; j++) {
								obj[headers[j]] = currentline[j];
							}
						} else {
							for (var k=0; k<currentline.length; k++) {
								obj[k] = currentline[k];
							}
						}
						result.push(obj);
					}
					defer.notify(32 + ((i/lines.length)*60));
				}
				return result;
			};
		}
	};
});
