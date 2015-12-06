var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {

        console.log('Received Event: ' + id);
    }
    
};
      var deviceInfo = function() {
    device.screenWidth = screen.width;
    device.screenHeight = screen.height;
    device.colorDepth = screen.colorDepth;
    return device;
};
            
(function() {
    var app = angular.module('kustomNote', ['onsen.directives', 'ngTouch','ngSanitize', 'angular-carousel']).service('noteService', function ($http, $q) {
        var result = "";
        return {
            checkNotes: function (notes) {
                var count = 0;
                angular.forEach(notes, function (note, key) {
                    if (note.length > 0) {
                        count += note.length;
                    }
                });
                return count;
            },
            noteSubmit: function (submission, user, $scope) {
                var deferred = $q.defer();

                $http.post("https://beta.kustomnote.com/newNoteAJAX/?token=" + user.token + "&email=" + user.email, submission,{
                        headers: {"Content-Type": undefined },
                        transformRequest: function (data) {
                            return data;
                        }
                    }).success(function (data, status, headers, config) {
                        console.log(data);
                        data.result = "success";

                        deferred.resolve(data);

                    }).error(function (data, status, headers, config) {
                    	console.log(data);
                        data.result = "error";
                    });

                return deferred.promise;
            },
            noteSaveToLocal: function ($scope, template, noteIndex) {

                $scope.datastore.get('notes', function (data) {
                    if (data) {
                        notes = data.notes;
                    }
                    else {
                        notes = {};
                    }
                });

                var note = template;
                var title_fields = "";

                if (!angular.isArray(notes[note.id])) {
                    notes[note.id] = [];
                }

                var noteCount = notes[note.id].length;

                if (angular.isDefined(note.notebook)) {
                	if (note.notebook && $scope.notebook) {
                    note.notebookIndex = $scope.notebooks.indexOf(note.notebook);
                    note.notebook = notse.notebook.guid;
                   }else{
                   	note.notebookIndex = 0;
                   	note.notebook = new Array();
                   }
                }

                angular.forEach(note.fields, function (field, key) {

                    if (!angular.isArray(field.value)) {
                        field.value = [field.value];
                    }
                    angular.forEach(field.clones, function (clone, k) {
                        if (!angular.isArray(clone.value)) {
                            clone.value = [clone.value];
                        }
                    });

                    if (field.type == "number" || field.type == "number_range") {
                        field.displayValue = field.value;
                        field.value = parseInt(field.value);
                    }

                    if (field.type == "music" || field.type == "movie" || field.type == "google_contact") {
                        field.displayValue = [$("#mock_id_field_" + field.id).val()];
                        field.value = [$("#" + field.id).val()];
                    }

                    if (field.type == "select_multiple" || field.type == "select_single") {
                        field.selected = [];
                        angular.forEach(field.value, function (value, key) {
                            field.selected.push(field.possible_values.indexOf(value));
                        });
                    }

                    if (field.in_title == true) {
                        if (angular.isDefined(field.displayValue)) {
                            title_fields += field.displayValue[0] + " ";
                        }
                        else {
                            title_fields += field.value[0] + " ";
                        }
                    }

                    if (field.type == "file") {
                        field.value = [];
                        if (field.files === $scope.files1) {
                            angular.forEach(field.files, function(file, key) {
                                field.value.push(file.name);
                            });
                        }
                    }

                    if (field.type == "google_calendar") {
                        field.allDay = field.value[0];
                        field.setReminder = field.value[1];

                        field.timezone = "";

                        if (!field.allDay && field.fromTime && field.toTime) {
                            var d = new Date();
                            var t = d.getTimezoneOffset();
                            var tz = t / 60;

                            note.utc_offset = t;

                            if (tz < 0) {
                                var timezone = "+";
                            }
                            else {
                                var timezone = "-";
                            }

                            if (Math.abs(tz) < 10) {
                                timezone += "0";
                            }

                            timezone += tz;

                            if (tz % 1 === 0) {
                                timezone += ":00";
                            }
                            else {
                                timezone += ":30";
                            }
                            field.timezone = timezone;
                        }
                        else if (!field.allDay) {
                            field.value[0] = !field.value[0];
                            field.allDay = field.value[0];
                        }
                    }
                });

                if (angular.isDefined(note.reminder_email) && angular.isDefined(note.reminder_datetime)) {
                    var d = new Date();
                    note.utc_offset = d.getTimezoneOffset();
                }

                note.title_fields = title_fields;
 /*               try{
                var fd = new FormData();
                //fd={"note": angular.toJson(note)};
                fd.append("note", angular.toJson($scope.note));

                }catch(e){console.log(e);}
   */             	
                if (noteIndex >= 0) {
                    notes[note.id].splice(noteIndex, 1, note);
                    note.noteId = note.id + "_" + noteIndex;
                }
                else {
                    note.noteId = note.id + "_" + noteCount;
                    notes[note.id].push(note);
                    noteIndex = noteCount;
                }

                if (!note.title_fields && !note.title_prefix && !note.title_suffix) {
                    note.title_fields = note.title + "-" + noteIndex;
                }

                $scope.datastore.save({key: "notes", notes: notes});

								var selectedItem = {templateId:note.id, index:noteIndex};
								
								
								console.log(notes);
								console.log(selectedItem);

							//	$scope.gotoEditNote(selectedItem);

                return noteIndex;
            },
            noteSave: function ($scope, template, noteIndex) {
                $scope.datastore.get('notes', function (data) {
                    if (data) {
                        notes = data.notes;
                    }
                    else {
                        notes = {};
                    }
                });

                var note = template;
                var title_fields = "";

                if (!angular.isArray(notes[note.id])) {
                    notes[note.id] = [];
                }

                var noteCount = notes[note.id].length;

                if (angular.isDefined(note.notebook)) {
                	if (note.notebook && $scope.notebook) {
                    note.notebookIndex = $scope.notebooks.indexOf(note.notebook);
                    note.notebook = note.notebook.guid;
                   }else{
                   	note.notebookIndex = 0;
                   	note.notebook = new Array();
                   }
                }

                angular.forEach(note.fields, function (field, key) {

                    if (!angular.isArray(field.value)) {
                        field.value = [field.value];
                    }
                    angular.forEach(field.clones, function (clone, k) {
                        if (!angular.isArray(clone.value)) {
                            clone.value = [clone.value];
                        }
                    });

                    if (field.type == "number" || field.type == "number_range") {
                        field.displayValue = field.value;
                        field.value = parseInt(field.value);
                    }

                    if (field.type == "music" || field.type == "movie" || field.type == "google_contact") {
                        field.displayValue = [$("#mock_id_field_" + field.id).val()];
                        field.value = [$("#" + field.id).val()];
                    }

                    if (field.type == "select_multiple" || field.type == "select_single") {
                        field.selected = [];
                        angular.forEach(field.value, function (value, key) {
                            field.selected.push(field.possible_values.indexOf(value));
                        });
                    }

                    if (field.in_title == true) {
                        if (angular.isDefined(field.displayValue)) {
                            title_fields += field.displayValue[0] + " ";
                        }
                        else {
                            title_fields += field.value[0] + " ";
                        }
                    }

                    if (field.type == "file") {
                        field.value = [];
                        if (field.files === $scope.files1) {
                            angular.forEach(field.files, function(file, key) {
                                field.value.push(file.name);
                            });
                        }
                    }

                    if (field.type == "google_calendar") {
                        field.allDay = field.value[0];
                        field.setReminder = field.value[1];

                        field.timezone = "";

                        if (!field.allDay && field.fromTime && field.toTime) {
                            var d = new Date();
                            var t = d.getTimezoneOffset();
                            var tz = t / 60;

                            note.utc_offset = t;

                            if (tz < 0) {
                                var timezone = "+";
                            }
                            else {
                                var timezone = "-";
                            }

                            if (Math.abs(tz) < 10) {
                                timezone += "0";
                            }

                            timezone += tz;

                            if (tz % 1 === 0) {
                                timezone += ":00";
                            }
                            else {
                                timezone += ":30";
                            }
                            field.timezone = timezone;
                        }
                        else if (!field.allDay) {
                            field.value[0] = !field.value[0];
                            field.allDay = field.value[0];
                        }
                    }
                });

                if (angular.isDefined(note.reminder_email) && angular.isDefined(note.reminder_datetime)) {
                    var d = new Date();
                    note.utc_offset = d.getTimezoneOffset();
                }

                note.title_fields = title_fields;
                try{
                var fd = new FormData();
                //fd={"note": angular.toJson(note)};
                fd.append("note", angular.toJson($scope.note));

                }catch(e){console.log(e);}
                	
                if (noteIndex >= 0) {
                    notes[note.id].splice(noteIndex, 1, note);
                    note.noteId = note.id + "_" + noteIndex;
                }
                else {
                    note.noteId = note.id + "_" + noteCount;
                    notes[note.id].push(note);
                    noteIndex = noteCount;
                }

                if (!note.title_fields && !note.title_prefix && !note.title_suffix) {
                    note.title_fields = note.title + "-" + noteIndex;
                }

                $scope.datastore.save({key: "notes", notes: notes});
                
								var selectedItem = {templateId:note.id, index:noteIndex};
								//$scope.gotoViewNote(selectedItem);

                //return fd;
                return noteIndex;
            },
            checkFiles: function (files, refFiles) {
                var values = [];
                angular.forEach(files, function(file, key) {
                    if (file.name != refFiles[key].name || file.size != refFiles[key].size) {
                        return [];
                    }
                    else {
                        values.push(file.name);
                    }
                });
                return values;
            },
            processFiles: function (files, fd) {
                angular.forEach(files, function (file, key) {
                    fd.append("uploadedFile_" + key, file);
                });
                return fd;
            },
            noteDelete: function (templateId, i, $scope, m_path) {
            		if($scope.notes[templateId])
                {	
                	$scope.notes[templateId].splice(i, 1);

                	if ($scope.notes[templateId].length <= 0) {
                  	  delete $scope.notes[templateId];
                	}
                }

                $scope.datastore.save({key: "notes", notes: $scope.notes});
                if (angular.isDefined(m_path)) {
                	console.log(m_path);
                   $scope.navOut(m_path);
                   //$scope.getRecentNotes("recent_notes.html", true, 1);
                }
            },
            noteEdit: function (templateId, i, $scope) {
            	var selectedItem = {templateId:templateId, index:i};
              $scope.gotoEditNote(selectedItem);
            },
            insertCheckbox: function (field, i, possible_value) {
                field.possible_values.push(possible_value);
            },
            addField: function (field, i) {
                field.hasClones = true;

                if (!angular.isArray(field.clones)) {
                    field.clones = [];
                }

                field.clones.push({"value": [], "cloned": true});

                return field;
            },
            removeField: function (field, i) {
                field.clones.splice(i, 1);

                if (field.clones.length <= 0) {
                    field.hasClones = false;
                }
                return field;
            },
            setFiles: function (element) {
                // Turn the FileList object into an Array
                var files = new Array();
                for (var i = 0; i < element.files.length; i++) {
                    files.push(element.files[i])
                }
                return files;
            },
            smartSuggest: function (field_id, social_id, type, user) {
                var mock = $("#mock_id_field_" + field_id);
                switch (type) {
                    case "movie":
                        var src = 'https://kustomnote.com/movieSearch/';
                        break;
                    case "music":
                        var src = 'https://kustomnote.com/musicSearch/';
                        break;
                    case "google_contact":
                        var src = 'https://kustomnote.com/contactsSearch/' + social_id + '/?token=' + user.token + '&email=' + user.email + '&';
                        break;
                    default:
                        var src = "";
                }
                                                                                                                      console.log(mock.attr("id"));
                if (mock.length > 0) {
                    mock.smartSuggest({
                        src: src,
                        fillBox: true,
                        fillBoxWith: 'fill_text',
                        executeCode: true,
                        minChars: 3,
                        target_id: field_id,
                        timeoutLength: 250
                    });
                }
            },
            googleCalendar: function (field_id, social_id, user) {
                var deferred = $q.defer();

                $.get('https://kustomnote.com/calendarsAJAX/' + social_id + '/?token=' + user.token + '&email=' + user.email)
                    .success(function (data, status, headers, config) {
                        deferred.resolve(data);
                    })
                    .error(function (data, status, headers, config) {
                        deferred.resolve({calendars: [{id: "", name: "No Calendars Found"}]});
                    });
                return deferred.promise;
            }
        };
    });
    
    document.addEventListener('deviceready', function() {
        angular.bootstrap(document, ['kustomNote']);       
    }, false);
    
    // Main Controller
    app.controller('MainController',['$scope', '$rootScope', '$timeout', 'newNoteData','noteService',
       function ($scope, $rootScope, $timeout, newNoteData, noteService)  {
            $scope.newFieldsArray = new Array();
					$scope.loader = {loading: false, text: "Loading..."};
        	$scope.alerts = [];    
	        $scope.templates = [];
	        $(".loader-background").show();
      		$scope.onLoad = function () {
                document.addEventListener("deviceready", onDeviceReady, false);
            };
			
            function onDeviceReady() {
            	//$scope.getTemplates("home.html", true);
            		document.addEventListener("online", onOnline, false);
                document.addEventListener("offline", onOffline, false);
                document.addEventListener("orientationChanged", updateOrientation);

                $scope.navigator = navigator;
                if (angular.isDefined($rootScope.user) && $rootScope.user.access.offline == false) {
                    $scope.datastore.remove("notes");
                }
                if (navigator.network.connection.type != "none" && angular.isDefined($rootScope.user)) {
                		$scope.online = true;
                    if (angular.isDefined($rootScope.user) && angular.isDefined($rootScope.user.token) && angular.isDefined($rootScope.user.email)) {
                        if (angular.isDefined($scope.notes) && $.isEmptyObject($scope.notes) == false) {
                            $scope.$apply(function () {
                                for(var key in $scope.notes) {
								                    if (angular.isArray($scope.notes[key])) {
								                        var note = $scope.notes[key][0];
								                        $scope.noteDelete(note.id, 0, $scope);
								                    }
								                    else {
								                        continue;
								                    }
								                    break;
								                }
																
																//$scope.onlineCtrl();
                                //$scope.getTemplates("home.html", true);
                               // $scope.getRecentNotes("recent_notes.html", true, 1);
                                setTimeout(function(){	
	                            		var lastScreen = localStorage.getItem("lastScreen");
	                            		$scope.gotoLastScreen(lastScreen);
	                            	}, 100);
                            });
                        }
                        else {
                            //$scope.$apply(function () {
                            	setTimeout(function(){	
                            		var lastScreen = localStorage.getItem("lastScreen");
                            		$scope.gotoLastScreen(lastScreen);
                            	}, 100);
                            		
                                //$scope.getTemplates("home.html", true);
                            //});
                        }
                    }
                    else {
                        $scope.$apply(function () {
                            //$scope.getTemplates("home.html", true);
                            
                        });
                    }
                }

                $scope.device = deviceInfo();
                $rootScope.platform = $scope.device.platform;

                if ($scope.device.platform == "iOS" && $scope.device.version[0] >= 5) {
                    $("#app-container").addClass("ios");
                }
                else if ($scope.device.platform == "Android" && window.devicePixelRatio != 1) {
                    var viewportScale = window.devicePixelRatio;
                    $('#viewport').attr('content', 'user-scalable=no, initial-scale=' + viewportScale + ', width=device-width');
                }
     				}
     		
     				function updateOrientation(e)
            {
                switch(e.orientation)
                {
                    case 0: // portrait
                    case 180: // portrait
                        $scope.portrait = "portrait";
                        break;
                    case -90: // landscape
                    case 90: // landscape
                        $scope.orientation = "landscape";
                        break;
                }
            }

            function onOnline() {
                $scope.onlineCtrl();
                $scope.getTemplates();
            }

            function onOffline() {
                $scope.offlineCtrl();
            }

            function openMenu() {
                $scope.$apply(function () {
                    $scope.menuOpen = !$scope.menuOpen;
                });
            }

						$scope.gotoLastScreen = function (lastScreen) {
                if(lastScreen == "recent_notes")
                {
                		$scope.ons.navigator.pushPage("recent_notes.html",{animation: 'slide'});
                }
                if(lastScreen == "setting")
                {
                    $scope.ons.navigator.pushPage("setting.html",{animation: 'slide'});
                }
                if(lastScreen == "advanced_search")
                {
                    $scope.ons.navigator.pushPage("advanced_search.html",{animation: 'slide'});
                }
                if(lastScreen == "simple_search")
                {
                    $scope.ons.navigator.pushPage("search.html",{animation: 'slide'});
                }
                if(lastScreen == "home")
                {
                    $scope.ons.navigator.pushPage("home.html",{animation: 'slide'});
                }
            };

            $scope.onlineCtrl = function () {
                $scope.offline = false;

                var title = 'Connection Detected!';
                var msg = 'Would you like to synchronize with your Kustom Note account?';
                var btns = ["Later", "Yes"];

                $scope.addConfirm(title, msg, btns, onlineConfirm);
            };

            var onlineConfirm = function (button) {
                                     
                $scope.datastore.get('notes', function (data) {
                    if (data && angular.isDefined(data.notes) && $.isEmptyObject(data.notes) == false) {
                        $scope.notes = data.notes;
                        $scope.checkNotes();
                        if (button == 2) {
                            $scope.syncNotes($scope.notes);
                            // synchronize
                        }
                    }
                });
            };

            $scope.offlineCtrl = function () {
                $scope.offline = true;

                if ($rootScope.user.access.offline == false) {
                    $scope.datastore.remove("notes");
                }

                var title = 'No Connection Detected!';
                var msg = 'You do not appear to have an active connection. Continuing in offline mode.';
                var btns = "OK";

                $scope.addMessage(title, msg, btns, offlineConfirm);
            };

            var offlineConfirm = function (button) {
                $scope.safeApply(function () {
                    //$scope.navOut("login.html");
                });
            };

            $scope.problemCtrl = function () {
                $scope.offline = true;

                if ($rootScope.user.access.offline == false) {
                    $scope.datastore.remove("notes");
                }

                var title = 'Problem Connecting!';
                var msg = 'Cannot connect to your account. Continuing in offline mode.';
                var btns = "OK";

                $scope.addConfirm(title, msg, btns, $scope.getRecentNotes("recent_notes.html", true, 1));
            };
            
     		$scope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            };

            $scope.checkNotes = function () {
                $scope.datastore.get('notes', function (data) {
                    if (data && angular.isDefined(data) && $.isEmptyObject(data.notes) == false) {
                        $scope.notes = data.notes;
                    }
                    else {
                        $scope.notes = {};
                    }
                }); 
                return  !$.isEmptyObject($scope.notes);
            };

            $scope.log = function (e) {
            };
     		$scope.validateUser = function (email, pass) {

                $scope.loader.loading = true;
                $scope.loader.text = "Validating Login Credentials...";
        		$.post("https://kustomnote.com/userLoginAJAX/?mobile_login=1", {email: email, password: pass})
                    .success(function (data, status, headers, config) {
                        $scope.offline = false;
                        $scope.loader.loading = false;
                        console.log(data);
                        if (data.status == "ok") {
                            $rootScope.user = {email: email, pass: pass, token: data.token, access: {offline: data.allow_offline}};
                            $scope.datastore.save({key: "userInfo", value: $rootScope.user});
                            //$scope.getTemplates("home.html", true);
                            $scope.getRecentNotes("recent_notes.html", true, 1);
                            //$scope.ons.navigator.pushPage("home.html",{title: "Home", animation: 'slide'});
                        }
                        else {
                            if (angular.isDefined($rootScope.user)) {
                                $rootScope.user.token = "";
                            }
                            var title = "KustomNote"
                            var msg = 'Wrong email or password, please try again!';
	            							var btns = "OK";
        	    							$scope.addMessage(title, msg, btns, function(){});
														$scope.$apply();
                            //$scope.addAlert("error", "No KustomNote account matches this email and password combination.", true, "login");
                            //$scope.ons.navigator.pushPage("login.html",{animation: 'slide'});
                        }
                    }).error(function (data, status, headers, config, a) {
                        $scope.addAlert("error", "Could not connect with your account", true, "login");

                        if (status == 401) {
                            if (angular.isDefined($rootScope.user)) {
                                $rootScope.user.token = "";
                            }
                        }
                        if (angular.isDefined($rootScope.user) && $rootScope.user.email == email && $rootScope.user.pass == pass) {
                            $scope.addAlert("info", "Going to offline mode", true, "offline");
                            $scope.offline = true;
                            //$scope.ons.navigator.pushPage("login.html",{animation: 'slide'});
                        }
                        $scope.loader.loading = false;
                    });
            };
            
            $scope.setTemplates = function (data, nav) {
                $scope.templates = angular.copy(data);

                angular.forEach($scope.templates, function (value, key) {
                    value.index = key;
                });

                $scope.datastore.save({key: "templates", value: {templates: $scope.templates}});
                $timeout(function () {
                    $scope.$broadcast('templatesUpdated', $scope.templates);
                });

                if (angular.isDefined(nav)) {
                    //$scope.navOut(nav);
                    try{
                   setTimeout( function(){$scope.ons.navigator.pushPage(nav,{animation: 'fade'});}, 1000);
                    }catch(e){console.log(e);}
                }
            };
            
            $scope.addRecentNotes = function (data){ 
            	
            	for (var index in data)
            	{
            		$scope.recentNotes.push(data[index]);
            	}

            	$scope.setRecentNotes($scope.recentNotes)
            };
            
            $scope.setRecentNotes = function (data, nav) {
                $scope.recentNotes = angular.copy(data);

                angular.forEach($scope.recentNotes, function (value, key) {
                    value.index = key;
                });

                $scope.datastore.save({key: "recentNotes", value: {recentNotes: $scope.recentNotes}});
                $timeout(function () {
                    $scope.$broadcast('recentNotesUpdated', $scope.recentNotes);
                });

                if (angular.isDefined(nav)) {
                    try{
                   		setTimeout( function(){$scope.ons.navigator.pushPage(nav,{animation: 'fade'});}, 1000);
                    }catch(e){console.log(e);}
                }
            };
            
            $scope.getMoreRecentNotes = function(page){ 
            	$scope.loader.loading = true;
            	console.log("https://kustomnote.com/noteSearchAJAX/?token=" + $rootScope.user.token + "&email=" + $rootScope.user.email + "&page="+page);
            	$.get("https://kustomnote.com/noteSearchAJAX/?token=" + $rootScope.user.token + "&email=" + $rootScope.user.email + "&page="+page, {}, {timeout: 15000})
                        .success(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
                        	$scope.online = true;
                        	$scope.$apply();
                            if (status == "success") {
                                $scope.addRecentNotes(data.notes);
                                $scope.breakCheck = false;
                            }
                            else {
                                 $rootScope.user.token = "";
                                $scope.datastore.get('recentNotes', function (data) {
                                    if (data) {
                                        $scope.problemCtrl();
                                    }
                                    else {
                                        //$scope.ons.navigator.pushPage("login.html");
                                        $scope.addAlert("error", "No offline data found.", "offline");
                                    }
                                }); 
                            }
                        }).error(function (data, status, headers, config) {
                            $scope.loader.loading = false;
														$scope.online = false;
														$scope.$apply();
                            if (!$scope.breakCheck && angular.isDefined($rootScope.user.email) && angular.isDefined($rootScope.user.pass) && $rootScope.user.token != "") {
                                $rootScope.user.token = "";
                                $scope.breakCheck = true;
                                $scope.validateUser($rootScope.user.email, $rootScope.user.pass);
                            }
                            else {
                                $rootScope.user.token = "";
                                $scope.datastore.get('recentNotes', function (data) {
                                    if (data) {
                                        $scope.problemCtrl();
                                    }
                                    else {
                                        //$scope.ons.navigator.pushPage("login.html");
                                        $scope.addAlert("error", "No offline data found.", "offline");
                                    }
                                });
                            } 
                        });
            };
            
            $scope.getRecentNotes = function (nav, notebook, page) {
             	if ($scope.offline) {
                    $scope.datastore.get('recentNotes', function (data) {
                        if (data) {
                            $scope.setRecentNotes(data.value.recentNotes, nav);
                        }
                        else {
                        }
                    });
                }
                else if (angular.isUndefined($rootScope.user)) {
                    $scope.ons.navigator.pushPage("login.html");
                }
                else {
                    $scope.loader.loading = true;
                    console.log("Getting Recent Notes...");
                    console.log("https://kustomnote.com/noteSearchAJAX/?token=" + $rootScope.user.token + "&email=" + $rootScope.user.email + "&page="+page);
                    $.post("https://kustomnote.com/noteSearchAJAX/?token=" + $rootScope.user.token + "&email=" + $rootScope.user.email + "&page="+page, {}, {timeout: 15000})
                        .success(function (data, status, headers, config) {
                            $scope.loader.loading = false;
                            $scope.online = true;
                           
                            if (status == "success") {
                             
                                $scope.setRecentNotes(data.notes, nav);
                                $scope.addAlert("info", "Recent Notes updated from your account.", true, "note");
                                
                                if (notebook) {
                                    $scope.getNotebooks();
                                }
                                $scope.breakCheck = false;
                                
                            }
                            else {
                                 $rootScope.user.token = "";
                                $scope.datastore.get('recentNotes', function (data) {
                                    if (data) {
                                        $scope.problemCtrl();
                                    }
                                    else {
                                        //$scope.ons.navigator.pushPage("login.html");
                                        $scope.addAlert("error", "No offline data found.", "offline");
                                    }
                                }); 
                            }
                            $scope.$apply();
                        }).error(function (data, status, headers, config) {
                        	 
                        	$scope.online = false;
                            $scope.loader.loading = false;
                            if (!$scope.breakCheck && angular.isDefined($rootScope.user.email) && angular.isDefined($rootScope.user.pass) && $rootScope.user.token != "") {
                                $rootScope.user.token = "";
                                $scope.breakCheck = true;
                                $scope.validateUser($rootScope.user.email, $rootScope.user.pass);
                            }
                            else {
                                $rootScope.user.token = "";
                                $scope.datastore.get('recentNotes', function (data) {
                                    if (data) {
                                        $scope.problemCtrl();
                                    }
                                    else {
                                       // $scope.ons.navigator.pushPage("login.html");
                                        $scope.addAlert("error", "No offline data found.", "offline");
                                    }
                                });
                            } 
                            $scope.$apply();
                        });
                }
            }; 
            
            $scope.getTemplates = function (nav, notebook) {
/*            		$scope.datastore.get('templates', function (data) {
                        if (data) {
                            $scope.setTemplates(data.value.templates, nav);
                                         return;
                        }
                        else {
                        }
                    });
*/
             	if ($scope.offline) {
                    $scope.datastore.get('templates', function (data) {
                        if (data) {
                            $scope.setTemplates(data.value.templates, nav);
                        }
                        else {
                        }
                    });
                }
                else if (angular.isUndefined($rootScope.user)) {
                    $scope.ons.navigator.pushPage("login.html");
                }
                else {
                    
                console.log("https://kustomnote.com/userTemplatesAJAX/?token=" + $rootScope.user.token + "&email=" + $rootScope.user.email + "&" );

                    $scope.loader.loading = true;
                    $scope.loader.text = "Getting New Templates...";
                    $.post("https://kustomnote.com/userTemplatesAJAX/?token=" + $rootScope.user.token + "&email=" + $rootScope.user.email + "&", {}, {timeout: 15000})
                        .success(function (data, status, headers, config) {
                            $scope.loader.loading = false;

                            if (status == "success") {
                                $scope.setTemplates(data.templates, nav);
                                $scope.addAlert("info", "Templates updated from your account.", true, "note");
                                
                                if (notebook) {
                                    $scope.getNotebooks();
                                }
                                $scope.breakCheck = false;
                            }
                            else {
                                $rootScope.user.token = "";
                                $scope.datastore.get('templates', function (data) {
                                    if (data) {
                                        $scope.problemCtrl();
                                    }
                                    else {
                                        //$scope.ons.navigator.pushPage("login.html");
                                        $scope.addAlert("error", "No offline data found.", "offline");
                                    }
                                });
                            }
                            $scope.$apply();
                        }).error(function (data, status, headers, config) {
                            $scope.loader.loading = false;
                            $scope.$apply();
                            if (!$scope.breakCheck && angular.isDefined($rootScope.user.email) && angular.isDefined($rootScope.user.pass) && $rootScope.user.token != "") {
                                $rootScope.user.token = "";
                                $scope.breakCheck = true;
                                $scope.validateUser($rootScope.user.email, $rootScope.user.pass);
                            }
                            else {
                                $rootScope.user.token = "";
                                $scope.datastore.get('templates', function (data) {
                                    if (data) {
                                        $scope.problemCtrl();
                                    }
                                    else {
                                        //$scope.ons.navigator.pushPage("login.html");
                                        $scope.addAlert("error", "No offline data found.", "offline");
                                    }
                                });
                            }
                        });
                }
            }; 
            
            $scope.getNotebooks = function (nav) { 
                if ($scope.offline) {
                    $scope.datastore.get('notebooks', function (data) {
                        if (data) {
                            $rootScope.notebooks = data.value.notebooks;
                        }
                        else {
                        }
                    });
                }
                else {
                    $.get("https://kustomnote.com/userNotebooksAJAX/?token=" + $rootScope.user.token + "&email=" + $rootScope.user.email, {"timeout": 20000})
                        .success(function (data, status, headers, config) {
                            var group = "Personal";
                            angular.forEach(data.notebooks, function (notebook, key) {
                                if (notebook.guid == "") {
                                    group = notebook.name;
                                    //data.notebooks.splice(key, 1);
                                }
                                else {
                                    notebook.group = group;
                                }
                            });

                            angular.forEach(data.notebooks, function (notebook, key) {
                                if (notebook.guid == "") {
                                    data.notebooks.splice(key,1);
                                }
                            });

                            $rootScope.notebooks = data.notebooks;

                            $scope.datastore.save({key: "notebooks", value: {notebooks: data}});

                            if (angular.isDefined(nav)) {
                                $scope.ons.navigator.pushPage(nav);
                            }

                        }).error(function (data, status, headers, config) {
                        });
                }
            };
            
            $scope.datastore = new Lawnchair({adapter: "dom", name: 'kustomNote'}, function () {
                this.get('userInfo', function (data) {
                    if (data) {
                        $rootScope.user = data.value;
                    }
                    else {
                    }
                });
                this.get('templates', function (data) {
                    if (data) {
                        $rootScope.storedTemplates = data.value.templates;
                    }
                    else {
                    }
                });
                this.get('notebooks', function (data) {
                    if (data) {
                        $rootScope.notebooks = data.value.notebooks;
                    }
                    else {
                    }
                });

                this.get('notes', function (data) {
                    if (data) {
                        $scope.notes = data.notes;
                    }
                });
                
                this.get('recentNotes', function (data) {
                    if (data) {
                        $scope.recentNotes = data.recentNotes;
                    }
                });
           });
           
           $scope.addAlert = function (type, msg, autoDelete, ref) {
           		$scope.alerts = new Array();
                $scope.alerts.push({type: type, msg: msg, closeable: true});
                console.log( $scope.alerts);
				if (angular.isDefined(ref)) {
                    $scope.alerts[ref] = true;
                }
                var i = $scope.alerts.length - 1;
                if($(".alert_rect").is(":hidden"))
                    $(".alert_rect").show();
                if (autoDelete) {
                    $timeout(function () {
                       $timeout(function () {
                       		$(".alert_rect").slideUp(600, function () {
                                 $scope.$apply(function () {
                                       $scope.closeAlert(i, ref);
                                 });
                            });
                       }, 3000);
                    }, 100);
                }
                else {
                    $(".alert_rect").eq(i).css("display", "block");
                }
            };
            
            $scope.closeAlert = function (i, ref) {
                $scope.alerts.splice(i, 1);

                if (angular.isDefined(ref)) {
                    delete $scope.alerts[ref];
                }
            };
            
            $scope.addConfirm = function (title, msg, btns, callback) {
                if (angular.isDefined($scope.navigator.notification.confirm)) {
                    $scope.navigator.notification.confirm(
                        msg,  // message
                        callback, // callback to invoke with index of button pressed
                        title, // title
                        btns  // buttonLabels
                    );
                }
                else {
                    msgBtns = [
                        {result: 0, label: btns[0]},
                        {result: 1, label: btns[1], cssClass: 'btn-primary'}
                    ];

                    $dialog.messageBox(title, msg, msgBtns)
                        .open()
                        .then(function (result) {
                            if (result == 1) {
                                //$scope.navOut("redirect");
                                callback();
                            }
                            else {
                                //$scope.navOut("loader");
                            }
                        });
                }
            };

            $scope.addMessage = function (title, msg, btns, callback) {
                if (angular.isDefined($scope.navigator.notification.alert)) {
                    $scope.navigator.notification.alert(
                        msg,  // message
                        callback,         // callback
                        title,            // title
                        btns                  // buttonName
                    );
                }
                else {
                    msgBtns = [
                        {result: 0, label: btns[0], cssClass: 'btn-primary'}
                    ];

                    $dialog.messageBox(title, msg, msgBtns)
                        .open()
                        .then(function (result) {
                            if (result == 0) {
                                callback();
                            }
                        });
                }
            };
            
            $scope.errors = {};

            $scope.syncNotes = function () {
                for(var key in $scope.notes) {
                    //var fd = new FormData();
                    if (angular.isArray($scope.notes[key])) {
                        var note = $scope.notes[key][0];
                         $scope.noteDelete(note.id, 0, $scope);
                    }
                    else {
                        continue;
                    }
                    break;
                }
                
                try{
                	var fd = new FormData();
	                fd.append("note", angular.toJson(note));
                }catch(e){console.log(e);}
                $scope.loader.loading = true;
                $scope.sync = true;
                $scope.loader.text = "Submitting notes to Evernote...";
                                     
                noteService.noteSubmit(fd, $rootScope.user, $scope).then(function (data) {
                    if (data.result == "success") {
                        $scope.loader.loading = false;
                        $scope.sync = false;
                        
                        $scope.noteDelete(note.id, 0, $scope);
                        $scope.addAlert("success", "Note successfully submitted to your account.", true, "note");

                        if (!$.isEmptyObject($scope.notes)) {
                            $scope.syncNotes();
                        }
                        else {
                        			$scope.getRecentNotes("recent_notes.html", true, 1);
                            //$scope.getTemplates("home.html");
                            //$scope.checkNotes();

                            if (!$.isEmptyObject($scope.errors)) {
                                $scope.datastore.save({key: "notes", notes: $scope.errors});
                                $scope.errors = {};
                                $scope.addAlert("error", "Not all of your notes could be submitted. Please try again later", false, "note");
                            }
                        }
                    }
                    else {
                        $scope.loader.loading = false;
                        $scope.sync = false;
                        
                        if (!angular.isArray($scope.errors[note.id])) {
                            $scope.errors[note.id] = [];
                        }

                        $scope.errors[note.id].push(note);

                        $scope.noteDelete(note.id, 0, $scope);
                        if (!$.isEmptyObject($scope.notes)) {
                            $scope.syncNotes();
                        }
                        else {
                            $scope.datastore.save({key: "notes", notes: $scope.errors});
                            $scope.errors = {};
                            //$scope.checkNotes();

                            //$scope.getTemplates("home.html");
                            $scope.getRecentNotes("recent_notes.html", true, 1);
                            $scope.addAlert("error", "Not all of your notes could be submitted. Please try again later", false, "note");
                        }
                    }
                });
            };

            $scope.noteDelete = function(templateId, i) {
                noteService.noteDelete(templateId, i, $scope);
            };

            $scope.refresh = function () {
                if (!$scope.offline) {

                    $scope.checkNotes();

                    if ($rootScope.user.access.offline == false) {
                        $scope.notes = {};
                        $scope.datastore.remove("notes");
                        $scope.getTemplates("home.html");
                        return;
                    }

                    if (!$.isEmptyObject($scope.notes)) {
                        $scope.navOut("home.html");
                        $scope.syncNotes();
                    }
                    else {
                        $scope.getTemplates("home.html");
                    }
                    $scope.mHideMe = $scope.checkNotes();
                }
            };

            var noteListVisited = false;
            $scope.$on('$routeChangeSuccess', function (e, dest, src) {
                var menuIndex = -1;
                $scope.back = {};

                angular.forEach($scope.mainMenu.links, function (menuItem, key) {
                    if (("/" + menuItem.link) == $location.path()) {
                        menuIndex = key;
                        return;
                    }
                });
                $scope.mainMenu.activeLink = menuIndex;
                window.scrollTo(0,0);
                document.getElementById("content-container").scrollTop = 0;
                $scope.currentScreen = $location.path().replace('/', '');
                if ($scope.currentScreen.indexOf("/") != -1) {
                    $scope.currentScreen = $scope.currentScreen.substr(0, $scope.currentScreen.indexOf("/"));
                }

                if ($scope.currentScreen == "noteList") {
                    noteListVisited = true;
                }
                else if ($scope.currentScreen == "newNote") {
                    noteListVisited = false;
                }

                if (($scope.currentScreen == "editNote" || $scope.currentScreen == "viewNote") && noteListVisited) {
                    $scope.back.enabled = "back";
                }
                else if ($scope.currentScreen != "templates" && $scope.currentScreen != "login" && $scope.currentScreen != "redirect") {
                    $scope.back.enabled = "home";
                }
                else {
                    $scope.back.enabled = false;
                }

                if ($scope.currentScreen != "viewNote" && angular.isDefined($rootScope.user) && $rootScope.user.access.offline == false) {
                    $scope.notes = {};
                    $scope.datastore.remove("notes");
                }
            });

            $scope.excludeClone = ["music", "movie", "google_calendar", "google_contact", "file", "multi_checkbox", "select_single", "select_multiple", "radio_group", "checkbox"];

            $scope.exclude = function (type) {
                if ($.inArray(type, $scope.excludeClone) == -1) {
                    return false;
                }
                else {
                    return true;
                }
            };

            $scope.effects = ["slide", "slide-up"];
            $scope.gotoEditNote  = function (selectedItem) {
                newNoteData.selectedItem = selectedItem;
	            $scope.ons.navigator.pushPage("editNote.html", selectedItem);
            };                         
						$scope.gotoViewNote  = function (selectedItem) {
                newNoteData.selectedItem = selectedItem;
	            $scope.ons.navigator.pushPage("viewNote.html", selectedItem);
            };
            $scope.navOut = function (path, menuIndex) {
                $scope.ons.navigator.resetToPage(path, {animation: 'fade'});
            };

            $scope.preventClick = function ($event) {
                $event.preventDefault();
                return false;
            };

            $scope.setCheck = function (field, i) {
            	try{

                if (!angular.isArray(field.value)) {
                    field.value = [field.value];
                }

                var ele = $('#' + field.id + '-' + i);
                checked = ele.prop('checked');
                ele.prop('checked', !checked);
                                    
             /*   if(!checked)
                {
                	field.value[i] = field.id + '-' + i;
                }else{
                	field.value[i] = "";
                }
                console.log(field);	
               */ 
                field.value[i] = !checked;
              }catch(e){console.log(e);}
            };

            $scope.setRadio = function (field, i, label) {
                var ele = angular.element('#' + field.id + '-' + i);
                $("#field-" + field.id + " input.radio_group").prop('checked', false);
                ele.prop('checked', true);

                field.value = label;
            };
     
            $scope.closeMenu = function () {
                if ($scope.menuOpen == true) {
                    $scope.menuOpen = !$scope.menuOpen;
                }
            };

            $scope.validateForm = function () {
                if ($(".fields-form .ng-invalid-required, .fields-form .ng-invalid.ng-dirty").length > 0) {
                    $(".fields-form").addClass("processed");

                    var title = "Invalid Input Detected!";
                    var btns = "OK";
                    var msg = "You've either entered invalid data or you are missing required fields.";

                    if ($(".ng-invalid-required").length > 0) {
                        msg = "Missing required fields!";
                    }
                    else if ($(".fields-form .ng-invalid-email.ng-dirty").length > 0) {
                        msg = "Invalid email address entered!";
                    }
                    else if ($(".fields-form .ng-invalid-number.ng-dirty").length > 0) {
                        msg = "Invalid number entered!";
                    }
                    else if ($(".fields-form .ng-invalid-url.ng-dirty").length > 0) {
                        msg = "Invalid url entered!";
                    }

                    $scope.addMessage(title, msg, btns);
                    return false;
                }
                else {
                    return true;
                }
            };
	 }]);
	 
	 // FirstPageController
 	app.controller('FirstPageController',['$scope', '$rootScope', '$timeout','GalleryData',
       function ($scope, $rootScope, $timeout, GalleryData)  {
        $scope.gotoSignup = function (){
        	$scope.ons.navigator.pushPage("create_account.html");
        };
        
        $scope.gotoLogin = function (){
        	$scope.ons.navigator.pushPage("login.html");
        };        
        
        var items = GalleryData.items;

        function addSlides(target) {
            angular.forEach(items,function(item,index){
                target.push({
                    label: item.label,
                    picture: item.src,
                    location: item.location,
                    item: (index + 1)
                });
            });
         };

        $scope.slides = [];
        addSlides($scope.slides);
        
    }]);
    
    
    // PasswordRecoveryController
 		app.controller('PasswordRecoveryController',['$scope','$http', '$rootScope', '$timeout',
       function ($scope, $http,$rootScope, $timeout)  {
       	
       	$scope.password_recovery = function(email)
       	{
       		if(email == undefined || email == "")
       		{
       			$scope.addAlert("success", "Please input correct email address.", true, "note");
            return;
       		}
       		
       		Object.toparams = function ObjecttoParams(obj) {
					    var p = [];
					    for (var key in obj) {
					        p.push(key + '=' + obj[key]);
					    }
					    return p.join('&');
					};
					
					$scope.loader.loading = true;
					var myobject = {'email':email};
					$http({
					    method: 'POST',
					    url: "https://kustomnote.com/passwordResetAJAX/",
					    data: Object.toparams(myobject),
					    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).success(function (data, status, headers, config) {
							$scope.loader.loading = false;
							console.log(data);
              if(data.status == true)
							{
								$scope.addMessage("Create Account", "We've sent you an email to reset your password.", "Ok");
							}else{
								$scope.addMessage("Create Account", "Your email address could not be found.", "Ok");
							}
							$scope.ons.navigator.resetToPage("first.html");
          }).error(function (data, status, headers, config) {
          		$scope.loader.loading = false;
              $scope.addMessage("Create Account", "Your email address could not be found.", "Ok");
              $scope.ons.navigator.resetToPage("first.html");
         	});

       	};
       	
    }]);   	
    // Login Controller
 		app.controller('LoginController',['$scope', '$rootScope', '$timeout','GalleryData',
       function ($scope, $rootScope, $timeout, GalleryData)  {
        
        //$scope.loginEmail = "samahgad@gmail.com";
        //$scope.loginPass = "123xy";
        //$scope.loginEmail = "test_test@kustomnote.com";
        //$scope.loginPass = "KustomNotetest";
				
				//$scope.loginEmail = "jin86520@outlook.com";
        //$scope.loginPass = "Test123456";                
        
        $scope.gotoForgotPswPage = function(){
        		$scope.ons.navigator.pushPage("password_recovery.html");
        };
    }]);
    
    // Create Account Controller
  	app.controller('CreateAccountController',['$scope', '$rootScope', '$timeout',
       function ($scope, $rootScope, $timeout)  {
       
        //$scope.signupEmail = "samahgad@gmail.com";
        //$scope.signupPass = "123xy";
        $scope.onClickTerms = function(){
        		var ref = window.open('https://kustomnote.com/tos/', '_system', 'location=yes');
        };
        $scope.onClickPolicy = function(){
        		var ref = window.open('https://kustomnote.com/privacy/', '_system', 'location=yes');
        };
        
        $scope.validateSignUser = function (email, pass){
        	if(email == "" || email == undefined || pass == "" || pass == undefined){
        		$scope.addAlert("success", "Please fill out all fileds.", true, "note");
                return;
        	}
        	
        	if ($(".login-form .ng-invalid-email.ng-dirty").length > 0) {
        		$scope.addAlert("success", "Please input correct email address.", true, "note");
                return;
            }
        	
        	$rootScope.signupEmail = email;
        	$rootScope.signupPass = pass;
        	//$scope.ons.navigator.pushPage("add_profile.html");
        	$scope.loader.loading = true;
        	$.post("https://kustomnote.com/userSignupAJAX/?mobile_login=1", {email: $rootScope.signupEmail, password: $rootScope.signupPass})
            	        .success(function (data, status, headers, config) {
                	        $scope.offline = false;
                    	    $scope.loader.loading = false;
                          $scope.$apply();
                        	console.log(data);
	                        if (data.status == "ok") {
    	                        $rootScope.user = {email: $rootScope.signupEmail, pass: $rootScope.signupPass, token: data.token, access: {offline: data.allow_offline}};
    	                        $scope.ons.navigator.pushPage("login.html",{animation: 'slide'});
        		                	$scope.datastore.save({key: "userInfo", value: $rootScope.user});
        		                	$scope.getRecentNotes("recent_notes.html", true, 1);
                	            //$scope.getTemplates("home.html", true);
                    	        //$scope.ons.navigator.pushPage("home.html",{title: "Home", animation: 'slide'});
	                        }
    	                    else {
        	                	if (data.status == "exists") {
            	            		$scope.addAlert("error", "Already exist account.", true, "Signup");
            	            		var title = "Signup"
                            	var msg = 'This account already exists, please try loggin in.';
	            								var btns = "OK";
        	    								$scope.addMessage(title, msg, btns, function(){});
                	        		$scope.ons.navigator.pushPage("login.html",{animation: 'slide'});
                    	    	}else{
                        	    	if (angular.isDefined($rootScope.user)) {
                            	    	$rootScope.user.token = "";
                            		}
	                            	//$scope.addAlert("error", "Could not create your account.", true, "Signup");
	                            	
	                            	var title = "Signup"
                            		var msg = 'Could not create your account.';
	            									var btns = "OK";
        	    									$scope.addMessage(title, msg, btns, function(){});
    		                      	//$scope.ons.navigator.pushPage("login.html",{animation: 'slide'});
           	                }
                	        }
                    	}).error(function (data, status, headers, config, a) {
	                        $scope.addAlert("error", "Could not create your account", true, "Signup");

    	                    if (status == 401) {
        	                    if (angular.isDefined($rootScope.user)) {
            	                    $rootScope.user.token = "";
                	            }
                    	    }
                        	if (angular.isDefined($rootScope.user) && $rootScope.user.email == email && $rootScope.user.pass == pass) {
	                            $scope.addAlert("info", "Going to offline mode", true, "offline");
    	                        $scope.offline = true;
        	                }
            	            $scope.loader.loading = false;
                            $scope.$apply();
                	    });
                                  
        }
    }]);   
    // add profile Controller
  	app.controller('AddProfileController',['$scope', '$rootScope', '$timeout',
       function ($scope, $rootScope, $timeout)  {
				console.log($rootScope.signupEmail + "/" + $rootScope.signupPass);
				var profile_img = "";
/*			
				jQuery(".option_profile_content").hide();
		    jQuery(".e_policy_holder").click(function(){
        	                             
        		  jQuery(this).next(".option_profile_content").slideToggle("slow");
	            jQuery(this).children("a:first").toggle();
            
    	        if(jQuery(this).children("a.arrow_down_icon").css("display")=="none")
        	    	jQuery(this).children("a.arrow_down_icon").show();
            	else
            		jQuery(this).children("a.arrow_down_icon").hide();
                                             
		    });
	*/	    
		    var onPhotoURISuccess = function(imageURI){
		    	profile_img = imageURI;	
		    	document.getElementById('profile_img').src = imageURI;
		    };
		    
		    var onCameraFail = function(message){
		    	console.log('Failed because: ' + message);
		    };
		    
		    $scope.profile_photo_add = function(){
		    	navigator.camera.getPicture(onPhotoURISuccess, onCameraFail, { quality: 50,   destinationType: Camera.DestinationType.FILE_URI, targetWidth: 612,  targetHeight: 612, sourceType:  Camera.PictureSourceType.PHOTOLIBRARY });
		    };
		    
		    $scope.create_account = function(username){
		    	
		    	if(username == undefined || username == "")
                {
                	$scope.addAlert("error", "Please input your name.", true, "Signup");
                	return;
                }
                
		    	$scope.loader.loading = true;
                $scope.loader.text = "Validating Sign up Credentials...";
                
                if(profile_img != ""){
		    		var options = new FileUploadOptions();
    				options.fileKey="photo";
    				options.fileName=profile_img.substr(profile_img.lastIndexOf('/')+1);
    				options.mimeType="image/jpeg";

    				var params = {};
    				params.name = username;
    				params.email = $rootScope.signupEmail;
					params.password = $rootScope.signupPass;
				
    				options.params = params;

    				var ft = new FileTransfer();
    				ft.onprogress = function(progressEvent) {
    					if (progressEvent.lengthComputable) {
    						var value = parseInt((progressEvent.loaded / progressEvent.total)* 100 );
      						console.log("file upload " + value + "%");
    					} else {

    					}
					};
		    		ft.upload(profile_img, encodeURI("https://kustomnote.com/userSignupAJAX/?mobile_login=1"), function(r){
                		$scope.offline = false;
                		$scope.loader.loading = false;
                		profile_img = "";
                		$scope.$apply();
						var data = JSON.parse(r.response);
						console.log(data);
						
						if (data.status == "ok") {
    	                	$rootScope.user = {email: $rootScope.signupEmail, pass: $rootScope.signupPass, token: data.token, access: {offline: data.allow_offline}};
        		            $scope.datastore.save({key: "userInfo", value: $rootScope.user});
                	        $scope.getTemplates("home.html", true);
	                    }
    	                else {
       	                	if (data.status == "exists") {
           	            		$scope.addAlert("error", "Already exist account.", true, "Signup");
               	        		return;
                   	    	}else{
                       	    	if (angular.isDefined($rootScope.user)) {
                           	    	$rootScope.user.token = "";
                           		}
                            	$scope.addAlert("error", "Could not create your account.", true, "Signup");
   		                      	$scope.ons.navigator.pushPage("login.html",{animation: 'slide'});
           	                }
                	   }
		    		}, function (message){
			    		$scope.offline = false;
	 		    		$scope.loader.loading = false;
                		$scope.$apply();
                		profile_img = "";
		    			console.log(message);
		    			
		    			$scope.addAlert("error", "Could not create your account.", true, "Signup");
		    		}, options);
		    	}else{
        			$.post("https://kustomnote.com/userSignupAJAX/?mobile_login=1", {name:username, email: $rootScope.signupEmail, password: $rootScope.signupPass})
            	        .success(function (data, status, headers, config) {
                	        $scope.offline = false;
                    	    $scope.loader.loading = false;
                            $scope.$apply();
                        	console.log(data);
	                        if (data.status == "ok") {
    	                        $rootScope.user = {email: $rootScope.signupEmail, pass: $rootScope.signupPass, token: data.token, access: {offline: data.allow_offline}};
        		                $scope.datastore.save({key: "userInfo", value: $rootScope.user});
                	            $scope.getTemplates("home.html", true);
                    	        //$scope.ons.navigator.pushPage("home.html",{title: "Home", animation: 'slide'});
	                        }
    	                    else {
        	                	if (data.status == "exists") {
            	            		$scope.addAlert("error", "Already exist account.", true, "Signup");
                	        		return;
                    	    	}else{
                        	    	if (angular.isDefined($rootScope.user)) {
                            	    	$rootScope.user.token = "";
                            		}
	                            	$scope.addAlert("error", "Could not create your account.", true, "Signup");
    		                      	$scope.ons.navigator.pushPage("login.html",{animation: 'slide'});
           	                }
                	        }
                    	}).error(function (data, status, headers, config, a) {
	                        $scope.addAlert("error", "Could not create your account", true, "Signup");

    	                    if (status == 401) {
        	                    if (angular.isDefined($rootScope.user)) {
            	                    $rootScope.user.token = "";
                	            }
                    	    }
                        	if (angular.isDefined($rootScope.user) && $rootScope.user.email == email && $rootScope.user.pass == pass) {
	                            $scope.addAlert("info", "Going to offline mode", true, "offline");
    	                        $scope.offline = true;
        	                }
            	            $scope.loader.loading = false;
                            $scope.$apply();
                	    });
                    }
		    };
    }]); 
    
    // TemplateDetailController
    app.controller('TemplateDetailController',['$scope', '$rootScope', '$timeout','newNoteData',
    		function ($scope, $rootScope, $timeout, newNoteData)  {
   			
    			if (angular.isUndefined($scope.templates) || $scope.templates.length <= 0) {
	   					$scope.$on('templatesUpdated', function (evt, templates) {
			            $scope.templates = templates;
			        });	        
			    }
			    
    			$scope.m_template = $scope.templates[newNoteData.selectedItem.index];	
    			console.log("*******************3");  	
       		console.log($scope.m_template);
       		console.log("*******************3");    		
       		
       		$scope.tags = $scope.m_template.auto_tags.split(",");	
       		
       		$scope.delete_template = function(){
       			
       		};
       		
				  $scope.onDeleteModalCancel = function(){
	        			delete_modal.hide();
	       	};
	        	     
	        $scope.showDeleteMenu = function(){
	        			delete_modal.show();
	        			$("#delete_sub_menu").css({marginBottom:"-80px"});
	        		  $("#delete_sub_menu").animate({marginBottom:"0px"}, "fast");
	       	};
	       	
	       	$scope.gotoEditTemplateField = function(){
	       			$scope.ons.navigator.pushPage("edit_template_field.html");
	       	};
    }]); 
    
    // EditTemplateFieldController
    app.controller('EditTemplateFieldController',['$scope', '$rootScope', '$timeout','newNoteData',
    		function ($scope, $rootScope, $timeout, newNoteData)  {
   			
    			if (angular.isUndefined($scope.templates) || $scope.templates.length <= 0) {
	   					$scope.$on('templatesUpdated', function (evt, templates) {
			            $scope.templates = templates;
			        });	        
			    }
			    
    			$scope.m_template = $scope.templates[newNoteData.selectedItem.index];	
    			console.log("*******************3");  	
       		console.log($scope.m_template);
       		console.log("*******************3");    		
       		
       		
    }]); 
    
    
    // Home Controller
    app.controller('HomeController',['$scope', '$rootScope', '$timeout','newNoteData', 'BottomMenuData',
       function ($scope, $rootScope, $timeout, newNoteData, BottomMenuData)  {
       		localStorage.setItem("lastScreen", "home");  
       		$scope.items = BottomMenuData.items;
       		$scope.IsEmpty = false;
       		for (var index in $scope.items)
       		{
       			$scope.items[index].active = "";
       		}
       		$scope.items[1].active = "active";
       		
       		$scope.showMenuDetail = function(index){
	            var selectedItem = $scope.items[index];
    	        BottomMenuData.selectedItem = selectedItem;
        	    $scope.ons.navigator.resetToPage(selectedItem.page);
        	}
        	
        	$scope.onModalCancel = function(){
        			modal.hide();
        			
        	};
        	     
          $scope.showSubMenu = function(){
        			modal.show();
        			$("#my_template_sub_menu").css({marginBottom:"-80px"});
        		  $("#my_template_sub_menu").animate({marginBottom:"0px"}, "fast");
        	};
        	$scope.create_blank_template = function(){
        		  modal.hide();
        		  $scope.$parent.newFieldsArray = new Array();
        		  $scope.ons.navigator.pushPage("create_blank_template.html");
        	};
        	
        	$scope.clone_from_library = function(){
        			modal.hide();
        			$scope.ons.navigator.pushPage("create_from_public_library.html");
        	};
        	$scope.templates = new Array();
        	$timeout(function () {
	   			//if (angular.isUndefined($scope.templates) || $scope.templates.length <= 0) {
	   			
	   					$scope.IsEmpty = true;
			        $scope.$parent.getTemplates();
	        		
			        
			   // }else{
			   ///	$scope.IsEmpty = false;
			   // }
        	});
					$scope.$on('templatesUpdated', function (evt, templates) {
			            $scope.templates = templates;
			            
			            $scope.IsEmpty = false;
			    });
        	
			    $scope.selectTemplate = function (template, i) {
			        //$("#" + template).addClass("selected");
	                //$("#" + template).animate({opacity:0 }, 300, function(){});;
	        		$timeout(function () {
			      			console.log("*******************");  	
			      			console.log($scope.templates[i]);
			      			console.log("*******************");
	        		    //$scope.navOut('/newNote/' + template + '/' + i);
	        		    var selectedItem = {id:template, index:i};
	        		    newNoteData.selectedItem = selectedItem;
	                $scope.ons.navigator.pushPage("note_list_of_template.html", selectedItem);
	        		});
			    };        
			    
			    $scope.showEditActions = false;
       		$scope.onSwipeLeft = function(){
       				$scope.showEditActions = !$scope.showEditActions;
       		};
       		
       		$scope.onEditBtn = function(index){
	        		    var selectedItem = {id:$scope.templates[index].id, index:index};
	        		    newNoteData.selectedItem = selectedItem;
	                $scope.ons.navigator.pushPage("template_detail.html", selectedItem);
       		};
       		
    }]);
        
    // AdvancedSearchViewController
    app.controller('AdvancedSearchViewController',['$scope', '$rootScope', '$timeout', 'BottomMenuData','selectedTemplateData','SearchResultData',
       function ($scope, $rootScope, $timeout, BottomMenuData, selectedTemplateData, SearchResultData)  {
       		localStorage.setItem("lastScreen", "advanced_search");  
       		$scope.selectedTemplateName = "Select template";
       		$scope.IsSelected = false;
       		$scope.searchWord = "";
       		
       		$scope.items = BottomMenuData.items;
       		for (var index in $scope.items)
       		{
       			$scope.items[index].active = "";
       		}
       		$scope.items[2].active = "active";
       		
       		$scope.showDetail = function(index){
	            var selectedItem = $scope.items[index];
    	        BottomMenuData.selectedItem = selectedItem;
        	    $scope.ons.navigator.resetToPage(selectedItem.page);
        	};
        	
        	$scope.gotoSimpleSearch = function() {
	            	$scope.ons.navigator.resetToPage('search.html');
	        };
	        
	        $scope.onSelectTemplateBtn = function(){
	        		selectedTemplateData.selectedItem = "";
	        		selectedTemplateData.selectedField = "";
	        		$scope.selectedFieldData = new Array();
	        		$scope.ons.navigator.pushPage('select_template.html');
	        };
					
					$scope.onSelectAddFieldBtn = function(){
	        		$scope.ons.navigator.pushPage('select_field.html');
	        };
	        
	        if (angular.isUndefined(selectedTemplateData.selectedItem.data) || angular.isUndefined(selectedTemplateData.selectedItem.data.title) || selectedTemplateData.selectedItem.data.title =="" ) {
	        	$scope.selectedTemplateName = "Select template";
	        	$scope.IsSelected = false;
	        }else{
	        	$scope.IsSelected = true;
	        	$scope.selectedTemplateName = selectedTemplateData.selectedItem.data.title;
	        }
	        
	        //console.log("====================");
	        //console.log(selectedTemplateData);
	        //console.log("====================");
	        $scope.selectedFieldData = new Array();
	        
	        for (var k in selectedTemplateData.selectedField)
	        {
	        	var aFieldIndex = selectedTemplateData.selectedField[k];	
	        	if (!angular.isUndefined(selectedTemplateData.selectedItem.data))
	        	{
	        			for(var j in selectedTemplateData.selectedItem.data.fields)
	        			{
	        				var aField = selectedTemplateData.selectedItem.data.fields[j];
	        				if(aField.id == aFieldIndex)
	        				{
	        					console.log(aField);	
	        					$scope.selectedFieldData.push(aField);
	        				}
	        			}
	        	}
	        }
	        
	        $scope.IsThereSelectedField = function(){
	        	if($scope.selectedFieldData.length <= 0)
	        		return false;
	        	else
	        		return true;	
	        };
					
					
	        $scope.onDeleteBtn = function(index){
	        	$scope.selectedFieldData.splice(index, 1);
	        	selectedTemplateData.selectedField = "";
	        };

	        $scope.OnSearchBtn = function(){
	        	SearchResultData.selectedFields = $scope.selectedFieldData;

	        	if(!angular.isUndefined(selectedTemplateData) && !angular.isUndefined(selectedTemplateData.selectedItem) && !angular.isUndefined(selectedTemplateData.selectedItem.data))
	        	{
		        	SearchResultData.template_id = selectedTemplateData.selectedItem.data.id;
		        
	        		$scope.ons.navigator.pushPage("search_result.html", {animation: 'slide'});
	        	}
	        	
	        };
    }]);
    
    // SearchResultController
    app.controller('SearchResultController',['$scope','$http', '$rootScope', '$timeout','SearchResultData','noteDetailData',
       function ($scope, $http, $rootScope, $timeout, SearchResultData, noteDetailData)  {
       	console.log(SearchResultData);
       	
       	$scope.searchNotelist = new Array;
       	$scope.count = 0;
       	$scope.IsThereSearchResult = false;
       	
       	var template_id = "template_id:"+SearchResultData.template_id;
       	var fields = SearchResultData.selectedFields;
        
        var fqQuery = new Array;
        fqQuery.push(template_id);
        
        for (var index in fields)
        {
        		if(fields[index].type == "date" || fields[index].type == "datetime")
        		{
        			var mQuery = "field_" + fields[index].id + "_dt:"+fields[index].searchWord;
        			fqQuery.push(mQuery);
        		}else if(fields[index].type == "number" || fields[index].type == "number_range")
        		{
        			var mQuery = "field_" + fields[index].id + "_ds:"+fields[index].searchWord;
        			fqQuery.push(mQuery);
        		}else{
        			var mQuery = "field_" + fields[index].id + "_txt:"+fields[index].searchWord;
        			fqQuery.push(mQuery);
        		}
        }
        fqQuery = angular.toJson(fqQuery);
        console.log(fqQuery);
        
     			$scope.loader.loading = true;
       		Object.toparams = function ObjecttoParams(obj) {
					    var p = [];
					    for (var key in obj) {
					        p.push(key + '=' + obj[key]);
					    }
					    return p.join('&');
					};
					
					var page = 1;
	        var pageSize = 9;
          if($(window).height() > 500)
          {
              pageSize = 14;                
          }
	        
					$scope.loader.loading = true;
					var myobject = {'token':$rootScope.user.token, 'email':$rootScope.user.email, 'page':page, 'fq':fqQuery};
					$http({
					    method: 'POST',
					    url: "https://kustomnote.com/noteSearchAJAX/",
					    data: Object.toparams(myobject),
					    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).success(function (data, status, headers, config) {
							$scope.loader.loading = false;
							//console.log(data);
							$scope.count = data.hits;
							for(var index in data.notes)
							{
								//console.log("******");
								//console.log(data.notes[index].guid);
								//console.log("*******");	
  							$scope.searchNotelist.push(data.notes[index]);
							}
          }).error(function (data, status, headers, config) {
          		$scope.loader.loading = false;
              console.log(data);
              $scope.count = 0;
         	});
 
        $scope.showDetail = function(index){
        	
        	var mNote = $scope.searchNotelist[index];
        	var mTemplateIndex = SearchResultData.template_id;
        			
	        var selectedItem = {note:mNote, templateIndex:mTemplateIndex}//$scope.notelist[index];
	        noteDetailData.selectedItem = selectedItem;
		       		
				  $scope.ons.navigator.pushPage('note_detail.html', selectedItem);
        };
        
        	
			    $scope.paginationLimit = function(data) {
	            	return pageSize * page;
	        };
	        $scope.hasMoreItems = function() {
	        	if (angular.isUndefined($scope.searchNotelist))
	        			return 0;
	        	else
	            	return page < ($scope.searchNotelist.length / pageSize);
	        };
	
	        $scope.showMoreItems = function() {
	            			page = page + 1;   
	            	
		           			$scope.loader.loading = true;
										var myQuery = {'token':$rootScope.user.token, 'email':$rootScope.user.email, 'page':page, 'fq':fqQuery};
										$http({
										    method: 'POST',
										    url: "https://kustomnote.com/noteSearchAJAX/",
										    data: Object.toparams(myQuery),
										    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
										}).success(function (data, status, headers, config) {
												$scope.loader.loading = false;
												//console.log(data);
												for(var index in data.notes)
												{
													//console.log("******");
													//console.log(data.notes[index].note_title);
													//console.log("*******");	
													$scope.searchNotelist.push(data.notes[index]);
												}
					          }).error(function (data, status, headers, config) {
					          		$scope.loader.loading = false;
					              console.log(data);
					              $scope.count = 0;
					         	});
		          
	        };
    }]);   	
    
    // SettingController
    app.controller('SettingController',['$scope', '$rootScope', '$timeout','BottomMenuData',
       function ($scope, $rootScope, $timeout, BottomMenuData)  {
					localStorage.setItem("lastScreen", "setting");  
					$scope.items = BottomMenuData.items;
       		$scope.IsEmpty = false;
       		
       		$scope.email = $rootScope.user.email;
       		
       		for (var index in $scope.items)
       		{
       			$scope.items[index].active = "";
       		}
       		$scope.items[3].active = "active";
       		
       		$scope.showMenuDetail = function(index){
	            var selectedItem = $scope.items[index];
    	        BottomMenuData.selectedItem = selectedItem;
        	    $scope.ons.navigator.resetToPage(selectedItem.page);
        	}
        	
        	$scope.logout = function (){
						if (angular.isDefined($scope.notes) && $.isEmptyObject($scope.notes) == false) {
                            
                                for(var key in $scope.notes) {
								                    if (angular.isArray($scope.notes[key])) {
								                        var note = $scope.notes[key][0];
								                        $scope.noteDelete(note.id, 0, $scope);
								                    }
								                    else {
								                        continue;
								                    }
								                    break;
								                }
                           
            }
            delete $scope.templates;
            delete $scope.recentNotes;
						delete $rootScope.user;
    				$scope.datastore.remove("userInfo");
    				$scope.ons.navigator.resetToPage("first.html", {animation: 'slide'});

        	};
    }]);
    
    // SelectFieldController
    app.controller('SelectFieldController',['$scope', '$rootScope', '$timeout','selectedTemplateData',
       function ($scope, $rootScope, $timeout, selectedTemplateData)  {
//       		console.log(selectedTemplateData.selectedItem);

       		$scope.items = selectedTemplateData.selectedItem.data.fields;
       		
       		$scope.selectItem = function(index)
       		{
       				var item = $scope.items[index];
       				
       				var selectedField = new Array();
       				
       				for(var i in selectedTemplateData.selectedField)
       				{
       					if(item.id != selectedTemplateData.selectedField[i])
       						selectedField.push(selectedTemplateData.selectedField[i]);
       				}
       				
     					selectedField.push(item.id);
       					
       				selectedTemplateData.selectedField = selectedField;
							$scope.ons.navigator.resetToPage("advanced_search.html");
       		};
    }]);
      	
    // SearchViewController
    app.controller('SearchViewController',['$scope', '$http','$rootScope', '$timeout', 'BottomMenuData','noteDetailData',
       function ($scope, $http, $rootScope, $timeout, BottomMenuData, noteDetailData)  {
       		localStorage.setItem("lastScreen", "simple_search");  
       		$scope.items = BottomMenuData.items;
       		for (var index in $scope.items)
       		{
       			$scope.items[index].active = "";
       		}
       		$scope.items[2].active = "active";
       		
       		$scope.showDetail = function(index){
	            var selectedItem = $scope.items[index];
    	        BottomMenuData.selectedItem = selectedItem;
        	    $scope.ons.navigator.pushPage(selectedItem.page);
        	};
        	
        	$scope.searchedList = new Array();
        	if (angular.isUndefined($scope.recentNotes) || $scope.recentNotes.length <= 0) {
        		$scope.$on('recentNotesUpdated', function (evt, recentNotes) {
		            $scope.recentNotes = recentNotes;
		        });
		    	}

			    var page = 1;
	        var pageSize = 9;
          if($(window).height() > 500)
          {
              pageSize = 14;                
          }
			    $scope.paginationLimit = function(data) {
	            	return pageSize * page;
	        };
	        $scope.hasMoreItems = function() {
	        	if (angular.isUndefined($scope.searchedList) || $scope.searchedList.length <1 )
	        			return 0;
	        	else
	            	return page < ($scope.searchedList.length / pageSize);
	        };
	
	        $scope.showMoreItems = function() {
	            	page = page + 1;   
	            	if($scope.online)   
		           	{
		           		if($scope.search != "")
		            	{
										var myobject = {'token':$rootScope.user.token, 'email':$rootScope.user.email, 'page':page, 'q':$scope.search};
										$http({
										    method: 'GET',
										    url: "https://kustomnote.com/noteSearchAJAX/",
										    data: Object.toparams(myobject),
										    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
										}).success(function (data, status, headers, config) {
												console.log(data.notes);
												$scope.searchedList = data.notes;
					          }).error(function (data, status, headers, config) {
					              console.log(data);
					         	});
		            	}	
		           	}
	        };
	        
	        $scope.gotoAdvancedSearch = function() {
	            	$scope.ons.navigator.resetToPage('advanced_search.html');
	        };
	        
	        Object.toparams = function ObjecttoParams(obj) {
						    var p = [];
						    for (var key in obj) {
						        p.push(key + '=' + obj[key]);
						    }
						    return p.join('&');
					};
					
	        $scope.onSearch = function() {
	            	console.log($scope.search);
	            	if($scope.search != "")
	            	{
									var myobject = {'token':$rootScope.user.token, 'email':$rootScope.user.email, 'page':page, 'q':$scope.search};
									$http({
									    method: 'POST',
									    url: "https://kustomnote.com/noteSearchAJAX/",
									    data: Object.toparams(myobject),
									    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
									}).success(function (data, status, headers, config) {
											console.log(data.notes);
											$scope.searchedList = data.notes;
				          }).error(function (data, status, headers, config) {
				              console.log(data);
				         	});
	            	}
	        };
	        $scope.showNoteDetail = function(index) {
	            var selectedItem = $scope.recentNotes[index];
	            if($scope.deleteCheckbox)
	            {
	            		if($("#rn_"+selectedItem.guid).prop("checked") == true)
		    						$("#rn_"+selectedItem.guid).prop("checked", false);        		
		    					else
		    						$("#rn_"+selectedItem.guid).prop("checked", true);
	            	}else{
	            		
	            		var mTemplateIndex = null;
	            		var selectedItem = {note:selectedItem, templateIndex:mTemplateIndex};//$scope.notelist[index];
	            
	        				noteDetailData.selectedItem = selectedItem;
				        	$scope.ons.navigator.pushPage('note_detail.html', selectedItem);
							}
        	}
    }]);
    
    // TemplateListController
    app.controller('TemplateListController',['$scope', '$rootScope', '$timeout','newNoteData','templateDetailData',
    		function ($scope, $rootScope, $timeout, newNoteData, templateDetailData)  {
    				console.log(newNoteData);
    				$scope.title = newNoteData.selectedItem.title;
    				var id = newNoteData.selectedItem.index;
    				
    				$scope.loader.loading = true;
    				$scope.loader.text = "";
    				$.post("https://kustomnote.com/publicTemplatesAJAX/"+id+"/", {}, {timeout: 15000})
            .success(function (data, status, headers, config) {
                        	$scope.loader.loading = false;

													$scope.subCategories = data.public_templates;
													
													for(var index in $scope.subCategories)
													{
														console.log("------------------");
														console.log($scope.subCategories[index]);
														console.log("------------------");	
													}
													
													$scope.$apply();
            }).error(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
                        	$scope.$apply();
													console.log(data);
        		});
        		
        		$scope.gotoPublicTemplateDetail = function(index) {
	            	$scope.subCategories[index];
	            	console.log($scope.subCategories[index]);
	            	var selectedItem = $scope.subCategories[index];
	        			templateDetailData.selectedItem = selectedItem;
	            	$scope.ons.navigator.pushPage("public_template_detail.html", selectedItem);
        		};
        		
        		$scope.gotoCloneTemplateDetail = function(index) {
	            	$scope.subCategories[index];
	            	console.log($scope.subCategories[index]);
	            	var selectedItem = $scope.subCategories[index];
	        			templateDetailData.selectedItem = selectedItem;
	            	$scope.ons.navigator.pushPage("clone_template_detail.html", selectedItem);
        		};
    }]);		
    
    // PublicTemplateDetailController
    app.controller('PublicTemplateDetailController',['$scope', '$rootScope', '$timeout','templateDetailData',
    		function ($scope, $rootScope, $timeout, templateDetailData)  {
    			$scope.mTemplate = templateDetailData.selectedItem;
    			
    			$scope.clone = function(){
    				$scope.ons.navigator.pushPage("clone_template_detail.html");
    			};
    }]);
    
    // CloneTemplateDetailController
    app.controller('CloneTemplateDetailController',['$scope', '$rootScope', '$timeout','templateDetailData',
    		function ($scope, $rootScope, $timeout, templateDetailData)  {
    			$scope.mTemplate = templateDetailData.selectedItem;
    			
    			$scope.doneBtn = function(){
	        	console.log("done");	
	        	$scope.ons.navigator.resetToPage("home.html");
	        };
    			
    }]);
    // PublicTemplateController
    app.controller('PublicTemplateController',['$scope', '$rootScope', '$timeout','newNoteData',
    		function ($scope, $rootScope, $timeout, newNoteData)  {
    			
    		$scope.loader.loading = true;
    		$scope.loader.text = "Getting public template library.";
    		$.post("https://kustomnote.com/publicCategoriesAJAX", {}, {timeout: 15000})
            .success(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
													console.log(data);
													$scope.categories = data.categories;
													$scope.$apply();
            }).error(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
                        	$scope.$apply();
													console.log(data);
        		});
        $scope.showDetail = function(index) {
	            var name = $scope.categories[index].name;
	            var id = $scope.categories[index].id;
	            var selectedItem = {title:name, index:id};
	        		newNoteData.selectedItem = selectedItem;
	            $scope.ons.navigator.pushPage("template_list.html", selectedItem);
        };
        
        $scope.doneBtn = function(){
        	console.log("done");	
        	$scope.ons.navigator.resetToPage("home.html");
        };
  	}]);
  	
    // Create Template Controller
    app.controller('CreateTemplateController',['$scope', '$rootScope', '$timeout','newNoteData',
       function ($scope, $rootScope, $timeout, newNoteData)  {

       	$scope.fieldsArray = $scope.$parent.newFieldsArray;
        console.log($scope.fieldsArray);

       	$scope.$apply();
       	$scope.IsValid = function(IsValid)
       	{
       		if(IsValid == 0)
       			return false;	
       		else
       			return true;
       	}
       	$scope.nextBtn = function () {
       			//$scope.ons.navigator.pushPage("filed_type.html", {animation:'lift'});
       	};
       	$scope.addField = function () {
       			$scope.ons.navigator.pushPage("filed_type.html", {animation:'lift'});
       	};
       	$scope.saveName = function(index){
       		if($scope.fieldsArray[index].name != "")
       			$scope.fieldsArray[index].valid = 1;
       	};
       	$scope.close = function(index){
       		$scope.fieldsArray.splice(index, 1);
       	};
       	$scope.edit = function(index){
       		$scope.fieldsArray[index].valid = 0;
       	};
    }]);
    
    // Field Type Controller Controller
    app.controller('FieldTypeController',['$scope', '$rootScope', '$timeout','FieldTypeData',
       function ($scope, $rootScope, $timeout, FieldTypeData)  {
       		console.log(FieldTypeData.items);
       		
       		$scope.items = FieldTypeData.items;
       		
       		$scope.selectItem = function(index)
       		{
       				var item = $scope.items[index];
       				//console.log(item);	
							$scope.$parent.newFieldsArray.push(item);
							$scope.ons.navigator.pushPage("create_blank_template.html");
       		};
    }]);
    
    // Pick Template for note Controller Controller
    app.controller('NoteListOfTemplateController',['$scope','$http', '$rootScope', '$timeout','newNoteData','noteDetailData','notesDataOfTemplate',
       function ($scope, $http,$rootScope, $timeout, newNoteData, noteDetailData, notesDataOfTemplate)  {
       		
	       	console.log("*******************3");  	
	       	console.log(newNoteData.selectedItem);
	       	console.log("*******************3");
	       	
	       	if (!angular.isUndefined($scope.templates) && $scope.templates.length > 0) {
	       				$scope.m_title = $scope.templates[newNoteData.selectedItem.index].title;
				        $scope.m_color = $scope.templates[newNoteData.selectedItem.index].color;
				        $scope.m_icon = $scope.templates[newNoteData.selectedItem.index].icon;
				        $scope.m_notes_count = $scope.templates[newNoteData.selectedItem.index].notes_count;
				  }
       
       		$scope.notelist = new Array();
       
       		var page = 1;
	        var pageSize = 9;
          if($(window).height() > 500)
          {
              pageSize = 14;                
          }
			    $scope.paginationLimit = function(data) {
	            	return pageSize * page;
	        };
	        $scope.hasMoreItems = function() {
	        	if (angular.isUndefined($scope.notelist))
	        			return 0;
	        	else
	            	return page < ($scope.notelist.length / pageSize);
	        };
	
	        $scope.showMoreItems = function() {
	            	page = page + 1;   
	            	if($scope.online)   
		           	{
		           			$scope.loader.loading = true;
										var myobject = {'token':$rootScope.user.token, 'email':$rootScope.user.email, 'page':page, 'fq':mfq};
										$http({
										    method: 'POST',
										    url: "https://kustomnote.com/noteSearchAJAX/",
										    data: Object.toparams(myobject),
										    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
										}).success(function (data, status, headers, config) {
												$scope.loader.loading = false;
												//console.log(data.notes);
												//$scope.notelist = data.notes;
												for(var index in data.notes)
												{
														$scope.notelist.push(data.notes[index]);
												}
					          }).error(function (data, status, headers, config) {
					          		$scope.loader.loading = false;
					              $scope.$apply();
					         	});
		           	}
	        };
	        
       		var fqQuery = "template_id:"+newNoteData.selectedItem.id;
					var mfq = new Array();
					mfq.push(fqQuery);
       		Object.toparams = function ObjecttoParams(obj) {
					    var p = [];
					    for (var key in obj) {
					        p.push(key + '=' + obj[key]);
					    }
					    return p.join('&');
					};
					
					$scope.loader.loading = true;
					var myobject = {'token':$rootScope.user.token, 'email':$rootScope.user.email, 'page':page, 'fq':mfq};
					$http({
					    method: 'POST',
					    url: "https://kustomnote.com/noteSearchAJAX/",
					    data: Object.toparams(myobject),
					    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
					}).success(function (data, status, headers, config) {
							$scope.loader.loading = false;
							//console.log(data.notes);
							//$scope.notelist = data.notes;
							for(var index in data.notes)
							{
									$scope.notelist.push(data.notes[index]);
							}
          }).error(function (data, status, headers, config) {
          		$scope.loader.loading = false;
              $scope.$apply();
         	});
         	
        	$scope.showDetail = function(index) {
        			var mNote = $scope.notelist[index];
        			var mTemplateIndex = newNoteData.selectedItem.index;
        			
	            var selectedItem = {note:mNote, templateIndex:mTemplateIndex}//$scope.notelist[index];
	            noteDetailData.selectedItem = selectedItem;
		       		
				      $scope.ons.navigator.pushPage('note_detail.html', selectedItem);
        	}                
                 
        	$scope.showActions = false;
       		$scope.onSwipeLeft = function(){
       				$scope.showActions = !$scope.showActions;
       		};
       		
       		$scope.onShareBtn = function(){
       			console.log("share");	
       		};
       		
       		$scope.onDeleteBtn = function(index){
       			
       				navigator.notification.confirm("Are you sure you want to delete this note?",function(buttonIndex){
       					if(buttonIndex == 1)
       					{
       						  var mNote = $scope.notelist[index];
				       			$scope.notelist.splice(index,1);
				       			$scope.loader.loading = true;
       			
       							$.post("https://kustomnote.com/deleteNoteAJAX/?token=" + $rootScope.user.token + "&email=" + $rootScope.user.email, {guid:mNote.guid}, {timeout: 15000})
                        .success(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
													console.log(data.notes);
													$scope.$apply();
													
                        }).error(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
                        	$scope.$apply();
													console.log(data);
                        });	
       					}
       				},"KustomNote",["Ok", "Cancel"]);       				

       		};
       		
       		$scope.onSwipeRight = function(){
       			$scope.showActions = !$scope.showActions;
       		}; 
       		$scope.create_note = function(){
       			
	          $scope.ons.navigator.pushPage("newNote.html");

       		}; 
  
       		$scope.gotoSelectPage = function(){  

       				notesDataOfTemplate.notes = $scope.notelist;

        	    $scope.ons.navigator.pushPage('select_notes_of_template.html',$scope.notelist);
        	};
        	
        	
    }]);   	
    // Pick Template for note Controller Controller
    app.controller('PickTemplateController',['$scope', '$rootScope', '$timeout','newNoteData',
       function ($scope, $rootScope, $timeout, newNoteData)  {
       	$scope.templates = new Array();
       	$timeout(function () {
       	//if (angular.isUndefined($scope.templates) || $scope.templates.length <= 0) {
		        $scope.$parent.getTemplates();
        		
		    //}
		  	});
		  	$scope.$on('templatesUpdated', function (evt, templates) {
		            $scope.templates = templates;
		    });
	/*	    for (var index in $scope.templates)
			  {
			    	console.log("*******************5");  	
       			console.log($scope.templates[index]);
       			console.log("*******************5");
			  }
    */   	
		    $scope.selectTemplate = function (template, i) {
	        		$timeout(function () {
	        			console.log("*******************5");  	
       					console.log($scope.templates[i]);
       					console.log("*******************5");
       			
			        	console.log(template + '/' + i);
	        		    var selectedItem = {id:template, index:i};
	        		    newNoteData.selectedItem = selectedItem;
	                $scope.ons.navigator.pushPage("newNote.html", selectedItem);
	        		});
			  };
    }]);
    // SelectTemplateController
    app.controller('SelectTemplateController',['$scope', '$rootScope', '$timeout','selectedTemplateData',
       function ($scope, $rootScope, $timeout, selectedTemplateData)  {
       	$scope.templates = new Array();
       	$timeout(function () {
		        $scope.$parent.getTemplates();
		  	});
		  	$scope.$on('templatesUpdated', function (evt, templates) {
		            $scope.templates = templates;
		    });
		    /*    
       	if (angular.isUndefined($scope.templates) || $scope.templates.length <= 0) {
		        $scope.$parent.getTemplates();
        		$scope.$on('templatesUpdated', function (evt, templates) {
		            $scope.templates = templates;
		        });
		    }
		    */
/*		    
		    for (var index in $scope.templates)
			  {
			    	console.log("*******************5");  	
       			console.log($scope.templates[index]);
       			console.log("*******************5");
			  }
*/       	
		    $scope.selectTemplate = function (template, i) {
	        		$timeout(function () {
	        			console.log("*******************5");  	
       					console.log($scope.templates[i]);
       					console.log("*******************5");
       					var selectedItem = {data:$scope.templates[i]};
	        		  selectedTemplateData.selectedItem = selectedItem;
			        	$scope.ons.navigator.resetToPage("advanced_search.html", selectedItem);
	        		});
			  };
        	
    }]);
    
    // SelectNoteOfTemplateController
    app.controller('SelectNoteOfTemplateController',['$scope', '$rootScope', '$timeout','BottomMenuData','notesDataOfTemplate',
       function ($scope, $rootScope, $timeout, BottomMenuData, notesDataOfTemplate )  {

       		var selectedNotes = new Array();
       		var selectedNotesCount = 0;
       		$scope.notesOfTemplate = notesDataOfTemplate.notes;

        	$scope.OnDoneBtn = function(){  
        			//$scope.getTemplates("pick_template_for_note.html", true);
        	    $scope.ons.navigator.pushPage('note_list_of_template.html', {animation: 'slide'});
        	};
					$scope.share_note_list = function(){  
						//window.plugins.socialsharing.share('Message and subject', 'KustomNote');
					};
					$scope.showDetail = function(index) {
	            var selectedItem = $scope.notesOfTemplate[index];
            	if($("#rn_"+selectedItem.guid).prop("checked") == true)
		    			{			
		    				for(var i in selectedNotes)
		    				{
		    					if(selectedNotes[i] == selectedItem.guid)
		    					{
		    						selectedNotes.splice(i, 1);
		    					}
		    				}
		    				$("#rn_"+selectedItem.guid).prop("checked", false);        		
		    			}
		    			else
		    			{		    				
		    				selectedNotes.push(selectedItem.guid);
		    				$("#rn_"+selectedItem.guid).prop("checked", true);
		    			}
	            
            	selectedNotesCount = selectedNotes.length;

        	}
					$scope.delete_note_list = function(){  
							for(var i in selectedNotes)
		    			{
		    				for(var j in $scope.notesOfTemplate)
		    				{
		    					if($scope.notesOfTemplate[j].guid == selectedNotes[i])
		    					{
		    						$scope.notesOfTemplate.splice(j, 1);
		    					}
		    				}
		    			}
							console.log(selectedNotes);
							
							$scope.loader.loading = true;
							$.post("https://kustomnote.com/deleteNoteAJAX/?token=" + $rootScope.user.token + "&email=" + $rootScope.user.email, {guid:selectedNotes}, {timeout: 15000})
                        .success(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
													console.log(data);
													
													$scope.$apply();
                        }).error(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
                        	$scope.$apply();
													console.log(data);
                        });
					};

    }]);   	
    
    // SelectNoteController
    app.controller('SelectNoteController',['$scope', '$http', '$rootScope', '$timeout','newNoteData', 'BottomMenuData',
       function ($scope, $http, $rootScope, $timeout, newNoteData, BottomMenuData )  {
        	var selectedNotes = new Array();
        	
        	if (angular.isUndefined($scope.recentNotes) || $scope.recentNotes.length <= 0) {
        		$scope.$on('recentNotesUpdated', function (evt, recentNotes) {
		            $scope.recentNotes = recentNotes;
		            console.log($scope.recentNotes);
		        });
		    	}
		    
			    /*for (var index in $scope.recentNotes)
			    {
			    	var mNote = $scope.recentNotes[index];
			    }*/
			    
			    var page = 1;
	        var pageSize = 9;
          if($(window).height() > 500)
          {
              pageSize = 14;                
          }
			    $scope.paginationLimit = function(data) {
	            	return pageSize * page;
	        };
	        $scope.hasMoreItems = function() {
	        	if (angular.isUndefined($scope.recentNotes))
	        			return 0;
	        	else
	            	return page < ($scope.recentNotes.length / pageSize);
	        };
	
	        $scope.showMoreItems = function() {
	            	page = page + 1;   
	            	if($scope.online)   
		           		$scope.getMoreRecentNotes(page);
	        };
	        $scope.showDetail = function(index) {
	            var selectedItem = $scope.recentNotes[index];
            	if($("#rn_"+selectedItem.guid).prop("checked") == true)
		    			{			
		    				for(var i in selectedNotes)
		    				{
		    					if(selectedNotes[i] == selectedItem.guid)
		    					{
		    						selectedNotes.splice(i, 1);
		    					}
		    				}
		    				$("#rn_"+selectedItem.guid).prop("checked", false);        		
		    			}
		    			else
		    			{		    				
		    				selectedNotes.push(selectedItem.guid);
		    				$("#rn_"+selectedItem.guid).prop("checked", true);
		    			}
	            	
        	}
        	$scope.OnDoneBtn = function(){  
        			//$scope.getTemplates("pick_template_for_note.html", true);
        	    $scope.ons.navigator.resetToPage('recent_notes.html', {animation: 'slide'});
        	};
					$scope.share_note_list = function(){  
						//window.plugins.socialsharing.share('Message and subject', 'KustomNote');
					};
					
					$scope.delete_note_list = function(){  
							for(var i in selectedNotes)
		    			{
		    				for(var j in $scope.recentNotes)
		    				{
		    					if($scope.recentNotes[j].guid == selectedNotes[i])
		    					{
		    						$scope.recentNotes.splice(j, 1);
		    					}
		    				}
		    			}
							console.log(selectedNotes);
							
		       		Object.toparams = function ObjecttoParams(obj) {
							    var p = [];
							    for (var key in obj) {
							        p.push(key + '=' + obj[key]);
							    }
							    return p.join('&');
							};
							
							$scope.loader.loading = true;
							var myobject = {'token':$rootScope.user.token, 'email':$rootScope.user.email, guid:selectedNotes};
							$http({
							    method: 'POST',
							    url: "https://kustomnote.com/deleteNoteAJAX/",
							    data: Object.toparams(myobject),
							    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
							}).success(function (data, status, headers, config) {
									$scope.loader.loading = false;
									console.log(data);
		          }).error(function (data, status, headers, config) {
		          		$scope.loader.loading = false;
									console.log(data);
		         	});

					};
    }]);
    
    // Recent Notes Controller
    app.controller('RecentNoteController',['$scope', '$rootScope', '$timeout','newNoteData', 'BottomMenuData','noteDetailData',
       function ($scope, $rootScope, $timeout, newNoteData, BottomMenuData, noteDetailData )  {
         	localStorage.setItem("lastScreen", "recent_notes");
       		$scope.IsEmpty = true;
        	$scope.items = BottomMenuData.items;
       		for (var index in $scope.items)
       		{
       			$scope.items[index].active = "";
       		}
       		$scope.items[0].active = "active";
       		
       		$scope.showMenuDetail = function(index){
	            var selectedItem = $scope.items[index];
    	        BottomMenuData.selectedItem = selectedItem;
        	    $scope.ons.navigator.resetToPage(selectedItem.page);
        	}        
        	/*
        	if (angular.isUndefined($scope.recentNotes) || $scope.recentNotes.length <= 0) {
        		$scope.IsEmpty = true;
		    	}else{
			    	$scope.IsEmpty = false;
			    }
			    */
			    $scope.justNowNotes = new Array();
					$scope.earlierTodayNotes = new Array();
					$scope.yesterdayNotes = new Array();
					$scope.earlierNotes = new Array();
					$scope.recentNotes = new Array();		    	
			    $timeout(function () {
			        $scope.$parent.getRecentNotes();
					});
					
				  $scope.$on('recentNotesUpdated', function (evt, recentNotes) {
				            $scope.recentNotes = recentNotes;
				            //console.log("**********1");
				            //console.log($scope.recentNotes);
				            $scope.IsEmpty = false;

		/*		            var d = new Date();
										var month = d.getMonth() + 1;
										var day = d.getDate();
										var year = d.getFullYear();
										var today = year + '/' +(month<10?'0':'')+ month + '/' + (day<10?'0':'')+ day;
										var todayTimestamp = new Date(today).getTime();
					
							    	var now = new Date();
							    	var nowTimestamp = now.getTime();
							    	
							    	var diffTimestamp = nowTimestamp - todayTimestamp;
							    	
							    	$scope.justNowNotes = new Array();
							    	$scope.earlierTodayNotes = new Array();
							    	$scope.yesterdayNotes = new Array();
							    	$scope.earlierNotes = new Array();
							     	
								    for (var index in $scope.recentNotes)
								    {
								    	var mNote = $scope.recentNotes[index];
								    	
								    	var mNoteDate = mNote.created_on.split("-");
								    	var mNoteNewDate = mNoteDate[1]+"/"+mNoteDate[2]+"/"+mNoteDate[0];
								    	var mNoteTimestamp = new Date(mNoteNewDate).getTime();
								    	mNoteTimestamp += diffTimestamp;
								    	
								    	if((nowTimestamp - mNoteTimestamp) <= (60*60*1000))
								    	{
								    		//console.log("justnow");
								    		//mNote.created_on = "Just now";
								    		$scope.justNowNotes.push(mNote);			    			
								    	}else if((nowTimestamp - mNoteTimestamp) <= (12*60*60*1000))
								    	{
								    		//console.log("earlier today");	
								    		//mNote.created_on = "Earlier today";
								    		$scope.earlierTodayNotes.push(mNote);			    		
								    	}else if((nowTimestamp - mNoteTimestamp) <= (24*60*60*1000))
								    	{
								    		//console.log("yesterday");	
								    		//mNote.created_on = "Yesterday";
								    		$scope.yesterdayNotes.push(mNote);
								    	}else if((nowTimestamp - mNoteTimestamp) > (24*60*60*1000))
								    	{
								    		//console.log("earlier");	
								    		$scope.earlierNotes.push(mNote);
								    	}
								    }			
								    
						*/    
				  });
		      
        	
		      /*
		      var d = new Date();
					var month = d.getMonth() + 1;
					var day = d.getDate();
					var year = d.getFullYear();
					var today = year + '/' +(month<10?'0':'')+ month + '/' + (day<10?'0':'')+ day;
					var todayTimestamp = new Date(today).getTime();

		    	var now = new Date();
		    	var nowTimestamp = now.getTime();
		    	
		    	var diffTimestamp = nowTimestamp - todayTimestamp;
		    	//console.log(diffTimestamp / (60*60*1000));
		    	$scope.justNowNotes = new Array();
		    	$scope.earlierTodayNotes = new Array();
		    	$scope.yesterdayNotes = new Array();
		    	$scope.earlierNotes = new Array();
		     	
			    for (var index in $scope.recentNotes)
			    {
			    	var mNote = $scope.recentNotes[index];
			    	
			    	var mNoteDate = mNote.created_on.split("-");
			    	var mNoteNewDate = mNoteDate[1]+"/"+mNoteDate[2]+"/"+mNoteDate[0];
			    	var mNoteTimestamp = new Date(mNoteNewDate).getTime();
			    	mNoteTimestamp += diffTimestamp;
			    	
			    	if((nowTimestamp - mNoteTimestamp) <= (60*60*1000))
			    	{
			    		//console.log("justnow");
			    		//mNote.created_on = "Just now";
			    		$scope.justNowNotes.push(mNote);			    			
			    	}else if((nowTimestamp - mNoteTimestamp) <= (12*60*60*1000))
			    	{
			    		//console.log("earlier today");	
			    		//mNote.created_on = "Earlier today";
			    		$scope.earlierTodayNotes.push(mNote);			    		
			    	}else if((nowTimestamp - mNoteTimestamp) <= (24*60*60*1000))
			    	{
			    		//console.log("yesterday");	
			    		//mNote.created_on = "Yesterday";
			    		$scope.yesterdayNotes.push(mNote);
			    	}else if((nowTimestamp - mNoteTimestamp) > (24*60*60*1000))
			    	{
			    		//console.log("earlier");	
			    		$scope.earlierNotes.push(mNote);
			    	}
			    }
			    */
			    $scope.showActions = false;
       		$scope.onSwipeLeft = function(){
       				$scope.showActions = !$scope.showActions;
       		};
       		
       		$scope.onShareBtn = function(){
       			alert("share");	
       		};
       		
       		$scope.onDeleteBtn = function(index){

       			navigator.notification.confirm("Are you sure you want to delete this note?",function(buttonIndex){
       					if(buttonIndex == 1)
       					{
       						var mNote = $scope.recentNotes[index];
			       			$scope.recentNotes.splice(index,1);
			       			$scope.loader.loading = true;
			       			
			       			$.post("https://kustomnote.com/deleteNoteAJAX/?token=" + $rootScope.user.token + "&email=" + $rootScope.user.email, {guid:mNote.guid}, {timeout: 15000})
                        .success(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
													console.log(data.notes);
													$scope.$parent.getRecentNotes();
													$scope.$apply();
													//$scope.getRecentNotes("recent_notes.html", true, 1);
                        }).error(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
                        	$scope.$apply();
													console.log(data);
                        });
       					}
       				},"KustomNote",["Ok", "Cancel"]);
       				
       		};
       		
       		$scope.onSwipeRight = function(){
       			$scope.showActions = !$scope.showActions;
       		};
       		
			    var page = 1;
			    var pageSize = 9;
          if($(window).height() > 500)
          {
              pageSize = 14;                
          }
	        
			    $scope.paginationLimit = function(data) {
	            	return pageSize * page - $scope.justNowNotes.length - $scope.earlierTodayNotes.length - $scope.yesterdayNotes.length;
	        };
	        $scope.hasMoreItems = function() {
	        	if (angular.isUndefined($scope.recentNotes))
	        			return 0;
	        	else
	            	return page < ($scope.recentNotes.length / pageSize);
	        };
	
	        $scope.showMoreItems = function() {
	            	page = page + 1;   
	            	if($scope.online)   
		           	{
		           			$scope.getMoreRecentNotes(page);
		           	}
	        };
	        $scope.showDetail = function(index) {
	            var selectedItem = $scope.recentNotes[index];
	            if($scope.deleteCheckbox)
	            {
	            		if($("#rn_"+selectedItem.guid).prop("checked") == true)
		    						$("#rn_"+selectedItem.guid).prop("checked", false);        		
		    					else
		    						$("#rn_"+selectedItem.guid).prop("checked", true);
	            	}else{
	            		
	            		var mTemplateIndex = null;
	            		var selectedItem = {note:selectedItem, noteIndex:index};//$scope.notelist[index];
	            
	        				noteDetailData.selectedItem = selectedItem;
				        	$scope.ons.navigator.pushPage('note_detail.html', selectedItem);
							}
        	}
        	$scope.createNewNote = function(){  
        			//$scope.getTemplates("pick_template_for_note.html", true);
        	    $scope.ons.navigator.pushPage('pick_template_for_note.html');
        	};
        	$scope.gotoSelectPage = function(){  
        			//$scope.getTemplates("pick_template_for_note.html", true);
        	    $scope.ons.navigator.pushPage('select_notes.html');
        	};
					
    }]);
    
    // Note Detail Controller	        		
    app.controller('NoteDetailController',['$scope', '$rootScope', '$timeout','noteService','noteDetailData', 'newNoteData',
       function ($scope, $rootScope, $timeout, noteService,noteDetailData, newNoteData)  {
    		console.log(noteDetailData.selectedItem);  
   			$scope.note =  noteDetailData.selectedItem.note;
    		$scope.mFilePath = "";
    		
    		for(var index in $scope.note.fields)
    		{
    			var field = $scope.note.fields[index];
    			if(field.type == "multi_checkbox")
    			{
    					field.temp_value = new Array();
    					for(var i = 0; i < field.value.length; i++)
    					{
    						if(field.value[i] == true)
    						{
    							field.temp_value[i] = i+"";
    						}else{
    							field.temp_value[i] = "temp"+i;
    						}
    					}
    			}
    			
    			if(field.type == "file")
    			{
    				if(field.processed && field.processed.s3key)
    					$scope.mFilePath = "https://kustomnote.com/resource/"+field.processed.s3key+"/?tkn="+$rootScope.user.token;
    					console.log($scope.mFilePath);
    			}
    		}   		
    		
    		
    		$scope.IsEmpty = function(field, index){
    			
    			if(field.temp_value)
    			{
	    			if(field.temp_value[index] == ("temp"+index))
	    			{
	    				return false;	
	    			}else
	    				return true;
    			}else{
    				return true;	
    			}
    		}
	  
	  		
	  
			  $scope.gotoEditNote = function(){
			  			var noteIndex = noteService.noteSaveToLocal($scope, $scope.note);
			  			var selectedItem = {templateId:$scope.note.id, index:noteIndex};			  			
			  			newNoteData.selectedItem = selectedItem;
	            $scope.ons.navigator.pushPage("editNote.html", selectedItem);
			  };
			  	
			  $scope.share_note_list = function(){
			  	//window.plugins.socialsharing.share('Message and subject', 'KustomNote');
			  };
			  
			  $scope.delete_note_list = function(){
			  	$scope.loader.loading = true;
			  	$.post("https://kustomnote.com/deleteNoteAJAX/?token=" + $rootScope.user.token + "&email=" + $rootScope.user.email, {guid:$scope.note.guid}, {timeout: 15000})
                        .success(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
													$scope.$apply();
													$scope.getRecentNotes("recent_notes.html", true, 1);
                        }).error(function (data, status, headers, config) {
                        	$scope.loader.loading = false;
                        	$scope.$apply();
													console.log(data);
                        });	
			  };		  
			  
	
    }]);
    
    // Note List Controller
    app.controller('noteListController',['$scope', '$rootScope', 'noteService','newNoteData',
     function ($scope, $rootScope, noteService, newNoteData)  {
        
        $scope.datastore.get('notes', function (data) {
	        if (data) {
    	        $scope.notes = data.notes;
        	}
	        else {
    	        $scope.notes = "";
        	}
	        var x = false;
            
    	    var count = noteService.checkNotes($scope.notes);

        	if (count <= 0) {
                $scope.ons.navigator.resetToPage("home.html", {animation: 'fade'});
    	        $scope.addAlert("info", "You have no offline notes", true);
        	}

	        if ($rootScope.user.access.offline == false) {
    	        var title = 'Offline Mode';
        	    //var msg = 'You must upgrade your subscription at kustomnote.com/upgrade to create and view offline notes.';
            	var msg = 'Your subscription plan does not include having pending/offline notes';
	            var btns = "OK";
    	        //$scope.addAlert('error', 'You must be a subscriber to save notes in offline mode', false, 'note');
        	    $scope.addMessage(title, msg, btns, $scope.navOut("home.html", 0));
	        }
	    });

    	$scope.selectNote = function (templateId, index) {
    			var selectedItem = {templateId:templateId, index:index};
   		    newNoteData.selectedItem = selectedItem;
          $scope.ons.navigator.pushPage("viewNote.html", selectedItem);
	    };

    	$scope.noteDelete = function(templateId, i) {
        	noteService.noteDelete(templateId, i, $scope);
	        var count = noteService.checkNotes($scope.notes);
                                         
    	    if (count <= 0) {
                newNoteData.selectedItem = {};
        	    $scope.navOut("home.html", 0);
            	$scope.addAlert("info", "You have no offline notes", true);
	        }
    	};

	    $scope.noteEdit = function(templateId, i) {
    	    noteService.noteEdit(templateId, i, $scope);	
	    }
    }]);
    
    // Menu Controller
    app.controller('MenuController',['$scope', '$rootScope', 'MenuData',
     function($scope, $rootScope, MenuData) {
        
        $scope.items = MenuData.items;

        $scope.showDetail = function(index){
            var selectedItem = $scope.items[index];
            
            if(selectedItem.title == "Sync")
            {
            	//$scope.ons.navigator.pushPage(selectedItem.page, {animation: 'slide'});
    			if (!$scope.offline) {
        			$scope.refresh();
    			}
            	return;
            }
            if(selectedItem.title == "Logout")
            {
            try{
				delete $rootScope.user;
    			$scope.datastore.remove("userInfo");
    			$scope.ons.navigator.resetToPage(selectedItem.page, {animation: 'slide'});
    		}catch(e){console.log(e);}
    			return;
            }
            MenuData.selectedItem = selectedItem;
            
            $scope.ons.navigator.pushPage(selectedItem.page, {animation: 'fade'});
        }
    }]);
    
    // editNoteController
    app.controller('editNoteController',['$scope', '$rootScope', '$timeout','newNoteData','noteService',
     function ($scope, $rootScope, $timeout, newNoteData, noteService)  {
     	$scope.noteTemplateId = newNoteData.selectedItem.templateId;
    	$scope.noteIndex = newNoteData.selectedItem.index;

    	$scope.datastore.get('notes', function (data) {
        	if (data) {
            	$scope.notes = data.notes;
            	$scope.template = data.notes[$scope.noteTemplateId][$scope.noteIndex];
            	
            	console.log("====================2");
				console.log($scope.template);
				console.log("====================2");
        	}
        	else {
            	$scope.navOut("home.html");
        	}
    	});

    	if ((angular.isUndefined($rootScope.notebooks) || $.isEmptyObject($rootScope.notebooks)) && $scope.template.pick_notebook) {
        	$scope.getNotebooks();
    	}

    	if (angular.isDefined($scope.template)) {
        	if (angular.isDefined($scope.template.notebook) && $scope.template.notebook == $rootScope.notebooks[$scope.template.notebookIndex].guid) {
            	$scope.template.notebook = $rootScope.notebooks[$scope.template.notebookIndex];
        	}
    	}
    	else {
        	$scope.navOut("home.html");
    	}
        
        $scope.setFileIndex = function(index) {
        	$scope.fileIndex = index;
		};
		
        $rootScope.files1 = new Array();
        $scope.setFiles = function(element) {
        	$scope.$apply(function() {
            	$rootScope.files1 = noteService.setFiles(element);
                $scope.template.fields[$scope.fileIndex].files = $rootScope.files1;
            });
                                         
		};
        
/*      
        $rootScope.files1 = new Array();
    	$scope.setFiles = function(element) {
        	$scope.template.fields[$scope.fileIndex].value = [];
        	$scope.$apply(function() {
                          $rootScope.files1 = noteService.setFiles(element);
            	$rootScope.files = noteService.setFiles(element);
        	});
        	$scope.template.fields[i].files = $rootScope.files;
    	};
*/
    	$scope.noteSave = function(template, noteIndex) {
        	/*if ($scope.validateForm() == false) {
            	return false;
        	}
        	$rootScope.submission = noteService.noteSave($scope, template, noteIndex);
        	*/
        	if ($scope.validateForm() == false) {
        	    return false;
	        }
                                       
    	    if ($scope.offline && $rootScope.user.access.offline == false) {
        	    var title = 'Offline Mode';
            	var msg = 'Your subscription plan does not allow taking notes while you are offline.';
	            //var msg = 'You must upgrade your subscription at ;.com/upgrade to Save offline Notes on your device.';
    	        var btns = "OK";
        	    //$scope.addAlert('error', 'You must be a subscriber to save notes in offline mode', false, 'note');
            	$scope.addMessage(title, msg, btns, $scope.navOut("home.html", 0));
        	}
	        else {
						var noteIndex = noteService.noteSave($scope, template);
				
				    	$scope.datastore.get('notes', function (data) {
				        	if (data) {
				            	$scope.notes = data.notes;
				            	$scope.note = data.notes[template.id][noteIndex];
				           
				        	}
				        	else {
				            	$scope.note = "";
				        	}
				    	});
				    	
					try{
			        	var fd = new FormData();
			            //fd={"note": angular.toJson(note)};
			            fd.append("note", angular.toJson($scope.note));
			            
			            console.log("====================3");
						console.log($scope.note);
						console.log("====================3");
			            
			            
			        }catch(e){console.log(e);}
			        var submission = fd;
		    	
		        	if ($scope.offline) {
		            	/*$scope.navOut("recent_notes.html");
		            	$scope.addAlert("info", "Note saved to offline storage. This note will be saved to your account when you have a connection.", true, "note");
		            	*/
		            	var title = 'Offline Mode';
		            	var msg = 'Note saved to offline storage. This note will be saved to your account when you have a connection.';
		    	        var btns = "OK";
		            	$scope.addMessage(title, msg, btns, $scope.navOut("recent_notes.html", 0));
		        	}
		        	else {
		            	$scope.loader.loading = true;
		
		            	noteService.noteSubmit(submission, $rootScope.user, $scope).then(function (data) {
		                	if (data.result == "success") {
		                    	$scope.loader.loading = false;
		                      var selectedItem = {templateId:template.id, index:noteIndex};
	                      
		                      newNoteData.selectedItem = selectedItem;
		                    	$scope.ons.navigator.pushPage("viewNote.html", selectedItem);
		                	}
		                	else {
		                    	$scope.loader.loading = false;
		                    	var selectedItem = {templateId:template.id, index:noteIndex};
		                      newNoteData.selectedItem = selectedItem;
		                    	$scope.ons.navigator.pushPage("viewNote.html", selectedItem);
		                	}
		            	});
		        	}		    		
        	}        	
    	};

    	$scope.addField = function (field, i) {
        	field = noteService.addField(field, i);
	    };

    	$scope.removeField = function (field, i) {
        	field = noteService.removeField(field, i);
    	};

    	$scope.smartSuggest = function (field_id, social_id, type) {
        	$timeout(function () {
            	noteService.smartSuggest(field_id, social_id, type, $rootScope.user);
        	});
    	};

    	$scope.googleCalendar = function (field_id, social_id) {
        	noteService.googleCalendar(field_id, social_id, $rootScope.user).then(function (data) {
            	$rootScope.calendars = data;
        	});
    	};

    	$scope.checkFiles = function (files, i) {
        	if (angular.isDefined($scope.files)) {
            	$scope.template.fields[i].value = noteService.checkFiles(files, $scope.files);
        	}
        	else {
            	$scope.template.fields[i].value = [];
        	}
    	};

    	$scope.fileAlert = function () {
        	if ($scope.alerts.length <= 0 || $scope.alerts.file == false) {
	            $scope.addAlert('error', 'Files cannot be uploaded while offline', true, 'file');
    	    }
	    };

    	$scope.smartAlert = function () {
	        if ($scope.alerts.length <= 0 || $scope.alerts.smartSuggest == false) {
    	        $scope.addAlert('error', 'Smart Suggest fields cannot be used while offline', true, 'smartSuggest');
        	}
	    };
    }]);
    
    // view Note Controller
    app.controller('viewNoteController',['$scope', '$rootScope', '$timeout','newNoteData','noteService',
     function ($scope, $rootScope, $timeout, newNoteData, noteService)  {
      $scope.noteTemplateId = newNoteData.selectedItem.templateId;
    	$scope.noteIndex = newNoteData.selectedItem.index;

    	$scope.datastore.get('notes', function (data) {
        	if (data) {
            	$scope.notes = data.notes;
            	$scope.note = data.notes[$scope.noteTemplateId][$scope.noteIndex];
        	}
        	else {
            	$scope.note = "";
        	}
    	});

    		for(var index in $scope.note.fields)
    		{
    			var field = $scope.note.fields[index];
    			if(field.type == "multi_checkbox")
    			{
    					field.temp_value = new Array();
    					for(var i = 0; i < field.value.length; i++)
    					{
    						if(field.value[i] == true)
    						{
    							field.temp_value[i] = i+"";
    						}else{
    							field.temp_value[i] = "temp"+i;
    						}
    					}

    			}
    		}
    		$scope.IsEmpty = function(field, index){
    			
    			if(field.temp_value){
	    			if(field.temp_value[index] == ("temp"+index))
	    			{
	    				return false;	
	    			}else
	    				return true;
    			}else{
    				return true;	
    			}
    		}
    		
    //	if (angular.isUndefined($rootScope.submission)) { 
        try{
        	var fd = new FormData();
            //fd={"note": angular.toJson(note)};
            fd.append("note", angular.toJson($scope.note));
            
            console.log("====================3");
			console.log($scope.note);
			console.log("====================3");
        }catch(e){console.log(e);}
        var submission = fd;
  /*  	}
   		else {
        	var submission = $rootScope.submission;
    	}
   */
   		console.log(submission);
    	if (angular.isDefined($rootScope.files1)) {
        	submission = noteService.processFiles($rootScope.files1, submission);
    	}
			$scope.gotoHome = function (templateId, i) {
					noteService.noteDelete(templateId, i, $scope, "recent_notes.html");
        	//$scope.ons.navigator.resetToPage("recent_notes.html", {animation: 'slide'});
    	};
    	$scope.checkFiles = function (files, i) {
        	if (angular.isDefined($scope.files1)) {
            	$scope.note.fields[i].value = noteService.checkFiles(files, $scope.files1);
        	}
        	else {
            	$scope.note.fields[i].value = [];
        	}
    	};

    	$scope.noteSubmit = function (templateId, i) {
        	if ($scope.offline) {
            	$scope.navOut("recent_notes.html");
            	$scope.addAlert("info", "Note saved to offline storage. This note will be saved to your account when you have a connection.", true, "note");
        	}
        	else {
            	$scope.loader.loading = true;
            	$scope.loader.text = "Submitting Notes...";

            	noteService.noteSubmit(submission, $rootScope.user, $scope).then(function (data) {
                	if (data.result == "success") {
                    	$scope.loader.loading = false;
                      
                    	$scope.noteDelete($scope.noteTemplateId, $scope.noteIndex, $scope, "recent_notes.html");
                    	$scope.addAlert("success", "Note successfully submitted to your account.", true, "note");
                	}
                	else {
                    	$scope.loader.loading = false;
                      
                    	$scope.getRecentNotes("recent_notes.html", true, 1);
                    	$scope.addAlert("error", "Note failed to save to your account. Please try again later", true, "note");
                	}
            	});
        	}
    	}



    	$scope.noteDelete = function(templateId, i) {
        	noteService.noteDelete(templateId, i, $scope, "recent_notes.html");
    	};

    	$scope.noteEdit = function(templateId, i) {
        	noteService.noteEdit(templateId, i, $scope);
    	};
    	$scope.noteShare = function() {
        	//window.plugins.socialsharing.share('Message and subject', 'KustomNote');
    	};
    }]);
    // New Note Controller
    app.controller('newNoteController',['$scope', '$rootScope', '$timeout','newNoteData','noteService',
     function ($scope, $rootScope, $timeout, newNoteData, noteService)  {
                              
      if (angular.isUndefined($scope.templates)) {
        	$scope.$parent.getTemplates();
        	$scope.$on('templatesUpdated', function (evt, templates) {
            	$scope.template = angular.copy(templates[newNoteData.selectedItem.index]);
            	$scope.refTemplate = templates[newNoteData.selectedItem.index];
        	});
    	}
    	else {
        	$scope.template = angular.copy($scope.templates[newNoteData.selectedItem.index]);
        	$scope.refTemplate = $scope.$parent.templates[newNoteData.selectedItem.index];
   		}

	    if ((angular.isUndefined($rootScope.notebooks) || $.isEmptyObject($rootScope.notebooks)) && $scope.template.pick_notebook) {
    	    $scope.getNotebooks();
	    }
	    
        $rootScope.files1 = new Array();
    	$scope.setFiles = function(element) {
        	$scope.$apply(function() {
                $rootScope.files1 = noteService.setFiles(element);
                $scope.template.fields[$scope.fileIndex].files = $rootScope.files1;
	        });

	    };
        $scope.setFileIndex = function(index) {
               $scope.fileIndex = index;
        };
    	$scope.log = function(msg) {
        	console.log(msg);
	    };

    	$scope.fileAlert = function () {
        	if ($scope.alerts.length <= 0 || $scope.alerts.file == false) {
            	$scope.addAlert('error', 'Files cannot be uploaded while offline', true, 'file');
	        }
    	};

	    $scope.smartAlert = function () {
    	    if ($scope.alerts.length <= 0 || $scope.alerts.smartSuggest == false) {
        	    $scope.addAlert('error', 'Smart Suggest fields cannot be used while offline', true, 'smartSuggest');
	        }
    	};

	    $scope.noteSave = function (template) {
    	    if ($scope.validateForm() == false) {
        	    return false;
	        }
                                       
    	    if ($scope.offline && $rootScope.user.access.offline == false) {
        	    var title = 'Offline Mode';
            	var msg = 'Your subscription plan does not allow taking notes while you are offline.';
	            //var msg = 'You must upgrade your subscription at ;.com/upgrade to Save offline Notes on your device.';
    	        var btns = "OK";
        	    //$scope.addAlert('error', 'You must be a subscriber to save notes in offline mode', false, 'note');
            	$scope.addMessage(title, msg, btns, $scope.navOut("home.html", 0));
        	}
	        else {
							var noteIndex = noteService.noteSave($scope, template);
				
				    	$scope.datastore.get('notes', function (data) {
				        	if (data) {
				            	$scope.notes = data.notes;
				            	$scope.note = data.notes[template.id][noteIndex];
				           
				        	}
				        	else {
				            	$scope.note = "";
				        	}
				    	});
			    	
							try{
			        	var fd = new FormData();
			            //fd={"note": angular.toJson(note)};
			            fd.append("note", angular.toJson($scope.note));
			        }catch(e){console.log(e);}
			        var submission = fd;
			        if (angular.isDefined($rootScope.files1)) {
				        	submission = noteService.processFiles($rootScope.files1, submission);
				    	}
			        
		        	if ($scope.offline) {
		            	$scope.navOut("recent_notes.html");
		            	$scope.addAlert("info", "Note saved to offline storage. This note will be saved to your account when you have a connection.", true, "note");
		            	
		            	
		            	var d = new Date();
									var month = d.getMonth() + 1;
									var day = d.getDate();
									var year = d.getFullYear();
									var today = year + '-' +(month<10?'0':'')+ month + '-' + (day<10?'0':'')+ day;
										
		            	$scope.note.note_title = $scope.note.title_fields;
		            	$scope.note.created_on = today;
		            	
		            	$scope.recentNotes.splice(0, 0, $scope.note);

		            	$scope.setRecentNotes($scope.recentNotes);
										
		            	var title = 'Offline Mode';
		            	var msg = 'Note saved to offline storage. This note will be saved to your account when you have a connection.';
		    	        var btns = "OK";
		            	$scope.addMessage(title, msg, btns, $scope.navOut("recent_notes.html", 0));
		        	}
		        	else {
		            	$scope.loader.loading = true;
		
		            	noteService.noteSubmit(submission, $rootScope.user, $scope).then(function (data) {
		                	if (data.result == "success") {
		                    	$scope.loader.loading = false;
		                      var selectedItem = {templateId:template.id, index:noteIndex};
	                      
		                      newNoteData.selectedItem = selectedItem;
		                    	$scope.ons.navigator.pushPage("viewNote.html", selectedItem);
		                	}
		                	else {
		                    	$scope.loader.loading = false;
		                    	var selectedItem = {templateId:template.id, index:noteIndex};
		                      newNoteData.selectedItem = selectedItem;
		                    	$scope.ons.navigator.pushPage("viewNote.html", selectedItem);
		                	}
		            	});
		        	}
		    		
        	}
	    };

    	$scope.addField = function (field, i) {
        	field = noteService.addField(field, i);
	    };

    	$scope.removeField = function (field, i) {
        	field = noteService.removeField(field, i);
	    };

    	$scope.smartSuggest = function (field_id, social_id, type) {
        	$timeout(function () {
            	noteService.smartSuggest(field_id, social_id, type, $rootScope.user);
	        });
    	};

	    $scope.googleCalendar = function (field_id, social_id, field) {
    	    noteService.googleCalendar(field_id, social_id, $rootScope.user).then(function (data) {
        	    $rootScope.calendars = data;
            	field.cal = data.calendars[0];
	        });
    	    var now = new Date();
        	var month = (now.getMonth() + 1);
	        var day = now.getDate();
    	    if (month < 10) {
        	    month = "0" + month;
        	}
	        if (day < 10) {
    	        day = "0" + day;
        	}
	        var today = now.getFullYear() + "-" + month + "-" + day;
    	    field.toDate = today;
        	field.fromDate = today;
	    };
	    
             /*
        try{
                                        setTimeout(function(){
                                                   tinymce.init({
                                                                selector: "textarea",
                                                                toolbar: "styleselect | bold italic ",
                                                                statusbar:false,
                                                                menubar:false
                                                                });
                                                   }, 500);
        }catch(e){console.log(e);}
              */
                                        
    }]);
    // Filter
    app.filter('partition', function($cacheFactory) {
          var arrayCache = $cacheFactory('partition');
          var filter = function(arr, size) {
            if (!arr) { return; }
            var newArr = [];
            for (var i=0; i<arr.length; i+=size) {
                newArr.push(arr.slice(i, i+size));        
            }
            var cachedParts;
            var arrString = JSON.stringify(arr);
            cachedParts = arrayCache.get(arrString+size); 
            if (JSON.stringify(cachedParts) === JSON.stringify(newArr)) {
              return cachedParts;
            }
            arrayCache.put(arrString+size, newArr);
            return newArr;
          };
          return filter;
        });

})();

var deviceInfo = function() {
    /*device.platform = device.platform;
     document.getElementById("version").innerHTML = device.version;
     document.getElementById("uuid").innerHTML = device.uuid;
     document.getElementById("name").innerHTML = device.name;
     document.getElementById("width").innerHTML = screen.width;
     document.getElementById("height").innerHTML = screen.height;
     document.getElementById("colorDepth").innerHTML = screen.colorDepth;*/

    device.screenWidth = screen.width;
    device.screenHeight = screen.height;
    device.colorDepth = screen.colorDepth;
    return device;
};

var getLocation = function() {
    var suc = function(p) {
        alert(p.coords.latitude + " " + p.coords.longitude);
    };
    var locFail = function() {
    };
    navigator.geolocation.getCurrentPosition(suc, locFail);
};

var beep = function() {
    navigator.notification.beep(2);
};

var vibrate = function() {
    navigator.notification.vibrate(0);
};

function roundNumber(num) {
    var dec = 3;
    var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
    return result;
}

var accelerationWatch = null;

function updateAcceleration(a) {
    document.getElementById('x').innerHTML = roundNumber(a.x);
    document.getElementById('y').innerHTML = roundNumber(a.y);
    document.getElementById('z').innerHTML = roundNumber(a.z);
}

var toggleAccel = function() {
    if (accelerationWatch !== null) {
        navigator.accelerometer.clearWatch(accelerationWatch);
        updateAcceleration({
            x : "",
            y : "",
            z : ""
        });
        accelerationWatch = null;
    } else {
        var options = {};
        options.frequency = 1000;
        accelerationWatch = navigator.accelerometer.watchAcceleration(
            updateAcceleration, function(ex) {
                alert("accel fail (" + ex.name + ": " + ex.message + ")");
            }, options);
    }
};

var preventBehavior = function(e) {
    e.preventDefault();
};

/*function dump_pic(data) {
    var viewport = document.getElementById('viewport');
    console.log(data);
    viewport.style.display = "";
    viewport.style.position = "absolute";
    viewport.style.top = "10px";
    viewport.style.left = "10px";
    document.getElementById("test_img").src = data;
}*/

function fail(msg) {
    alert(msg);
}

function show_pic() {
    navigator.camera.getPicture(dump_pic, fail, {
        quality : 50
    });
}

function close() {
    var viewport = document.getElementById('viewport');
    viewport.style.position = "relative";
    viewport.style.display = "none";
}

function contacts_success(contacts) {
    alert(contacts.length
        + ' contacts returned.'
        + (contacts[2] && contacts[2].name ? (' Third contact is ' + contacts[2].name.formatted)
        : ''));
}

function get_contacts() {
    var obj = new ContactFindOptions();
    obj.filter = "";
    obj.multiple = true;
    navigator.contacts.find(
        [ "displayName", "name" ], contacts_success,
        fail, obj);
}

function check_network() {
    var networkState = navigator.network.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'No network connection';

    confirm('Connection type:\n ' + states[networkState]);
}

var watchID = null;

function updateHeading(h) {
    document.getElementById('h').innerHTML = h.magneticHeading;
}

function toggleCompass() {
    if (watchID !== null) {
        navigator.compass.clearWatch(watchID);
        watchID = null;
        updateHeading({ magneticHeading : "Off"});
    } else {
        var options = { frequency: 1000 };
        watchID = navigator.compass.watchHeading(updateHeading, function(e) {
            alert('Compass Error: ' + e.code);
        }, options);
    }
}

function init() {
    // the next line makes it impossible to see Contacts on the HTC Evo since it
    // doesn't have a scroll button
    // document.addEventListener("touchmove", preventBehavior, false);
    document.addEventListener("deviceready", deviceInfo, true);
}

function showAlert(message, title) {
    if (navigator.notification) {
        navigator.notification.alert(message, null, title, 'OK');
    } else {
        alert(title ? (title + ": " + message) : message);
    }
}