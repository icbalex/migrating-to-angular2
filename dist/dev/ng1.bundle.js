webpackJsonp([0],Array(66).concat([
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(67);
__webpack_require__(68);
__webpack_require__(69);
__webpack_require__(70);
__webpack_require__(72);
__webpack_require__(74);
__webpack_require__(76);
__webpack_require__(78);
__webpack_require__(80);
__webpack_require__(81);
__webpack_require__(83);
__webpack_require__(84);
__webpack_require__(86);
__webpack_require__(87);
__webpack_require__(88);
__webpack_require__(89);
__webpack_require__(91);
__webpack_require__(93);
__webpack_require__(95);
__webpack_require__(96);
__webpack_require__(97);
__webpack_require__(99);
__webpack_require__(101);
__webpack_require__(103);
__webpack_require__(104);
__webpack_require__(105);


/***/ }),
/* 67 */
/***/ (function(module, exports) {

(function () {
    var toastrModule = angular.module('toastr', []);
    toastr.options.timeOut = 1000;
    toastrModule.value('toastr', toastr);
}());


/***/ }),
/* 68 */
/***/ (function(module, exports) {

var app = angular.module('app', ['ngRoute', 'toastr']);
app.run(function ($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function (e, next, prev, err) {
        if (err === "AUTH_REQUIRED") {
            $location.path("/login");
        }
        if (err === 'NOT_AUTHORIZED') {
            $location.path("/home");
        }
    });
});
angular.element(document).ready(function () {
    angular.bootstrap(document.body, ['app']);
});
app.config(['$locationProvider', function ($locationProvider) {
        $locationProvider.hashPrefix('');
    }]);


/***/ }),
/* 69 */
/***/ (function(module, exports) {

angular.module('app').config(function ($routeProvider) {
    var routeResolvers = {
        loggedIn: function (auth) {
            return auth.requireLogin();
        },
        waitForAuth: function (auth) {
            return auth.waitForAuth();
        },
        requireAdmin: function (auth) {
            return auth.requireAdmin();
        },
        userSessions: function (sessions, currentIdentity, auth) {
            return auth.requireLogin().then(function () {
                return sessions.getSessionsByUser(currentIdentity.currentUser.id);
            });
        },
        allSessions: function (sessions, auth) {
            return auth.requireLogin().then(function () {
                return sessions.getAllSessions();
            });
        },
        allUsers: function (users, auth) {
            return auth.requireLogin().then(function () {
                return users.getAllUsers();
            });
        }
    };
    $routeProvider
        .when('/admin/login', {
        template: '<admin-login></admin-login>',
        resolve: {
            currentAuth: routeResolvers.waitForAuth
        }
    })
        .when('/admin/results', {
        template: '<results all-sessions="$resolve.allSessions"></results>',
        resolve: {
            admin: routeResolvers.requireAdmin,
            allSessions: routeResolvers.allSessions
        }
    })
        .when('/admin/users/:id', {
        template: '<user-details all-users="$resolve.allUsers"></user-details>',
        resolve: {
            admin: routeResolvers.requireAdmin,
            allUsers: routeResolvers.allUsers
        }
    })
        .when('/users', {
        template: '<user-list all-users="$resolve.allUsers"></user-list>',
        resolve: {
            admin: routeResolvers.requireAdmin,
            allUsers: routeResolvers.allUsers
        }
    })
        .when('/admin/createusers', {
        template: '<create-users></create-users>',
        resolve: {
            admin: routeResolvers.requireAdmin
        }
    })
        .when('/home', {
        template: '<home user-sessions="$resolve.userSessions"></home>',
        resolve: {
            login: routeResolvers.loggedIn,
            userSessions: routeResolvers.userSessions
        }
    })
        .when('/profile', {
        template: '<profile></profile>',
        resolve: {
            userProfile: routeResolvers.loggedIn,
        }
    })
        .when('/createsession', {
        template: '<create-new-session user-sessions="$resolve.userSessions"></create-new-user>',
        resolve: {
            userSessions: routeResolvers.userSessions,
        }
    })
        .when('/login', {
        template: '<login></login>',
        resolve: {
            currentAuth: routeResolvers.waitForAuth
        }
    })
        .when('/logout', {
        template: '<logout></logout>'
    })
        .otherwise('/home');
});


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('adminLogin', {
    template: __webpack_require__(71),
    bindings: {},
    controller: function ($location, currentIdentity, auth, toastr) {
        this.loggedIn = currentIdentity.authenticated();
        if (this.loggedIn) {
            $location.path('/home');
        }
        this.login = function () {
            auth.login({
                username: this.email,
                password: this.password
            }).then(function () {
                $location.path('/home');
            }, function (err) {
                toastr.error(err);
            });
        };
    }
});


/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = "<h1>Admin Login</h1>\n\n<form class=\"form\">\n  <div class=\"row\">\n  <div class=\"form-group col-sm-6\">\n    <input type=\"text\" autofocus placeholder=\"Email Address\" ng-model=\"$ctrl.email\" class=\"form-control\">\n  </div>\n  </div>\n  <div class=\"row\">\n  <div class=\"form-group col-sm-6\">\n    <input type=\"password\" placeholder=\"Password\" ng-model=\"$ctrl.password\" class=\"form-control\">\n  </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-sm-6\">\n    <button class=\"btn btn-primary\" ng-click=\"$ctrl.login()\">Login</button>\n    </div>\n  </div>\n</form>";

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('results', {
    template: __webpack_require__(73),
    bindings: {
        sessionsByVoteDesc: '=allSessions'
    },
    controller: function () {
        this.$onInit = function () {
            this.sessionsByVoteDesc.sort(function (session1, session2) {
                // reverse order
                return session2.voteCount - session1.voteCount;
            });
        };
    }
});


/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = "<nav></nav>\n<h1>Results</h1>\n\n<session-detail-with-votes session=\"session\" ng-repeat=\"session in $ctrl.sessionsByVoteDesc\"></session-detail-with-votes>\n\n";

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('createUsers', {
    template: __webpack_require__(75),
    bindings: {},
    controller: function (nameParser, users, toastr) {
        this.import = function () {
            var people = nameParser.parse(this.namesblob);
            people.forEach((function (person) {
                users.createNewUser({
                    email: person.email,
                    password: "pass",
                    firstName: person.firstName,
                    lastName: person.lastName
                }).catch(function (error) {
                    toastr.error("User already exists: " + person.email);
                }.bind(this));
            }).bind(this));
            toastr.success("Users Created!");
        };
    }
});


/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = "<nav></nav>\n\n<h1>Create Users</h1>\n<p>Enter Email Addresses here. One on each line, First and Last Name Pipe Separated</p>\n<textarea name=\"emailAddresses\" id=\"\" cols=\"30\" rows=\"10\" class=\"form-control\" \n  placeholder=\"Email Addresses\" ng-model=\"$ctrl.namesblob\"></textarea>\n<br>\n<button class=\"btn btn-primary\" ng-click=\"$ctrl.import()\">Create Users</button>\n";

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('userList', {
    template: __webpack_require__(77),
    bindings: {
        users: '=allUsers'
    },
    controller: function () {
        this.$onInit = function () {
            this.users.sort(function (user1, user2) {
                if (user1.firstName < user2.firstName)
                    return -1;
                if (user1.firstName === user2.firstName)
                    return 0;
                if (user1.firstName > user2.firstName)
                    return 1;
            });
        };
    }
});


/***/ }),
/* 77 */
/***/ (function(module, exports) {

module.exports = "<nav></nav>\n<h1>User List</h1>\n\n<a ng-href=\"#/admin/users/{{user.id}}\" zoom-in \n  class=\"btn btn-primary btn-spaced\" \n  ng-repeat=\"user in $ctrl.users\">\n  {{user.firstName}}\n  {{user.lastName}}\n</a>\n";

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('userDetails', {
    template: __webpack_require__(79),
    bindings: {
        allUsers: '='
    },
    controller: function ($routeParams) {
        this.$onInit = function () {
            this.user = this.allUsers.find(function (user) {
                return user.id === parseInt($routeParams.id);
            });
        };
    }
});


/***/ }),
/* 79 */
/***/ (function(module, exports) {

module.exports = "<nav></nav>\n<div class=\"jumbotron\">\n  <h1>{{$ctrl.user.firstName}} {{$ctrl.user.lastName}}\n    <span class=\"badge\" ng-show=\"$ctrl.user.isAdmin\">Admin</span>\n  </h1>\n  <p>{{$ctrl.user.email}}</p>\n</div>";

/***/ }),
/* 80 */
/***/ (function(module, exports) {

angular.module('app').service('nameParser', (function () {
    function NameParser() {
    }
    NameParser.prototype.parse = function (blobInput) {
        var lines = blobInput.split(/\r?\n/);
        lines.forEach(function (line, idx) {
            var pieces = line.split('|');
            lines[idx] = {
                email: pieces[0],
                firstName: pieces[1],
                lastName: pieces[2]
            };
        });
        return lines;
    };
    return NameParser;
}()));


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('nav', {
    template: __webpack_require__(82),
    bindings: {},
    controller: function (currentIdentity, sessions, unreviewedSessionCount) {
        this.currentUser = currentIdentity.currentUser;
        unreviewedSessionCount.updateUnreviewedSessionCount();
        this.unreviewedSessionCount = unreviewedSessionCount;
    }
});


/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = "<div \n  class=\"navbar navbar-fixed-top navbar-inverse\">\n  <div class=\"container\">\n    <div class=\"navbar-header\"><a href=\"/\" class=\"navbar-brand\">Lightning Talks</a></div>\n    <div class=\"navbar-collapse collapse\">\n      <ul class=\"nav navbar-nav\">\n        <li><a href=\"#/\">Home <span class=\"badge\">{{$ctrl.unreviewedSessionCount.value}}</span> </a></li>\n        <li><a href=\"#/createsession\">Create Session</a></li>\n        <li><a href=\"#/profile\">Profile</a></li>\n        <li><a href=\"#/admin/createusers\" ng-show=\"$ctrl.currentUser.isAdmin\">Create Users</a></li>\n        <li><a href=\"#/admin/results\" ng-show=\"$ctrl.currentUser.isAdmin\">Results</a></li>\n        <li><a href=\"#/users\" ng-show=\"$ctrl.currentUser.isAdmin\">Users</a></li>\n        <li><a href=\"#/logout\">Logout</a></li>\n      </ul>\n      \n      <ul class=\"nav navbar-right navbar nav\">\n        <li class=\"navbar-text\">\n          Welcome {{$ctrl.currentUser.firstName}} {{$ctrl.currentUser.lastName}}\n        </li>\n      </ul>\n    </div>\n  </div>\n</div>\n";

/***/ }),
/* 83 */
/***/ (function(module, exports) {

angular.module('app').component('logout', {
    controller: function ($location, auth) {
        auth.logout();
        $location.path('/login');
    }
});


/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('login', {
    template: __webpack_require__(85),
    bindings: {},
    controller: (function () {
        function LoginCtrl($location, currentIdentity, auth, toastr) {
            this.$location = $location;
            this.auth = auth;
            this.toastr = toastr;
            if (currentIdentity.authenticated()) {
                $location.path('/home');
            }
        }
        LoginCtrl.prototype.login = function () {
            var _this = this;
            this.auth.login({
                username: this.email,
                password: "pass"
            }).then(function () {
                _this.$location.path('/home');
            }, function (err) {
                _this.toastr.error(err);
            });
        };
        return LoginCtrl;
    }())
});


/***/ }),
/* 85 */
/***/ (function(module, exports) {

module.exports = "<h1>Please Login</h1>\n\n<p>Enter your attendee email address</p>\n<form class=\"form\">\n  <div class=\"row\">\n    <div class=\"form-group col-sm-6\">\n      <input type=\"text\" autofocus placeholder=\"Email Address\" ng-model=\"$ctrl.email\" class=\"form-control\">\n    </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-sm-6\">\n      <button class=\"btn btn-primary\" ng-click=\"$ctrl.login()\">Login</button>\n    </div>\n  </div>\n</form>";

/***/ }),
/* 86 */
/***/ (function(module, exports) {

angular.module('app').service('auth', (function () {
    function Auth($q, $http, currentIdentity) {
        this.$q = $q;
        this.$http = $http;
        this.currentIdentity = currentIdentity;
    }
    Auth.prototype.login = function (credentials) {
        var _this = this;
        var dfd = this.$q.defer();
        this.$http.post('/api/login', credentials).then(function (response) {
            _this.currentIdentity.setUser(response.data.user);
            dfd.resolve();
        }, function (response) {
            dfd.reject("Invalid Credentials");
        });
        return dfd.promise;
    };
    Auth.prototype.logout = function () {
        var _this = this;
        var dfd = this.$q.defer();
        this.$http.post('/api/logout').then(function (response) {
            _this.currentIdentity.clearUser();
            dfd.resolve();
        }, function (response) {
            dfd.reject("Error Logging Out");
        });
        return dfd.promise;
    };
    Auth.prototype.waitForAuth = function () {
        var _this = this;
        var dfd = this.$q.defer();
        this.$http.get('/api/currentIdentity').then(function (response) {
            if (!!response.data) {
                _this.currentIdentity.setUser(response.data);
            }
            dfd.resolve(_this.currentIdentity);
        });
        return dfd.promise;
    };
    Auth.prototype.requireLogin = function () {
        var _this = this;
        return this.waitForAuth().then(function () {
            if (_this.currentIdentity.authenticated()) {
                return true;
            }
            else {
                return _this.$q.reject('AUTH_REQUIRED');
            }
        });
    };
    Auth.prototype.requireAdmin = function () {
        var _this = this;
        return this.waitForAuth().then(function () {
            if (_this.currentIdentity.authenticated() && _this.currentIdentity.currentUser.isAdmin) {
                return true;
            }
            else {
                return _this.$q.reject('AUTH_REQUIRED');
            }
        });
    };
    return Auth;
}()));


/***/ }),
/* 87 */
/***/ (function(module, exports) {

angular.module('app').service('currentIdentity', (function () {
    function CurrentIdentity($http, $q) {
        this.$http = $http;
        this.$q = $q;
        this.currentUser = null;
    }
    CurrentIdentity.prototype.setUser = function (user) {
        this.currentUser = user;
    };
    CurrentIdentity.prototype.clearUser = function () {
        this.currentUser = null;
    };
    CurrentIdentity.prototype.authenticated = function () {
        return !!this.currentUser;
    };
    CurrentIdentity.prototype.updateUser = function (newUserObj) {
        var _this = this;
        var dfd = this.$q.defer();
        this.$http.put('/api/users/' + this.currentUser.id, newUserObj).then(function (response) {
            _this.currentUser.firstName = newUserObj.firstName;
            _this.currentUser.lastName = newUserObj.lastName;
            dfd.resolve();
        }, function (response) {
            dfd.reject("Error Logging Out");
        });
        return dfd.promise;
    };
    return CurrentIdentity;
}()));


/***/ }),
/* 88 */
/***/ (function(module, exports) {

angular.module('app').service('users', (function () {
    function Users($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    Users.prototype.createNewUser = function (newUser) {
        return this.$http.post('/api/users', newUser);
    };
    Users.prototype.getAllUsers = function () {
        var dfd = this.$q.defer();
        this.$http.get('/api/users').then(function (response) {
            dfd.resolve(response.data);
        });
        return dfd.promise;
    };
    return Users;
}()));


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('home', {
    template: __webpack_require__(90),
    bindings: {
        userSessions: '='
    },
    controller: function (currentIdentity, sessions, toastr, unreviewedSessionCount) {
        this.currentUser = currentIdentity.currentUser;
        this.setNextSessionToReview = function () {
            var _this = this;
            sessions.getNextUnreviewedSession(currentIdentity.currentUser.id).then(function (response) {
                _this.currentSessionToReview = response.data;
            });
        };
        this.setNextSessionToReview();
        this.voteYes = function () {
            var _this = this;
            sessions.incrementVote(this.currentSessionToReview.id)
                .then(function () { return sessions.addReviewedSession(_this.currentUser.id, _this.currentSessionToReview.id); })
                .then(function () {
                this.setNextSessionToReview();
                // pull updated value
                unreviewedSessionCount.updateUnreviewedSessionCount();
            }.bind(this));
        };
        this.voteNo = function () {
            sessions.addReviewedSession(this.currentUser.id, this.currentSessionToReview.id)
                .then(function () {
                this.setNextSessionToReview();
                // pull updated value
                unreviewedSessionCount.updateUnreviewedSessionCount();
            }.bind(this));
        };
    }
});


/***/ }),
/* 90 */
/***/ (function(module, exports) {

module.exports = "<nav></nav>\n\n<h2 style=\"margin-top:30px\">Unreviewed Sessions</h2>\n<unreviewed-talk session=\"$ctrl.currentSessionToReview\" vote-no=\"$ctrl.voteNo()\" vote-yes=\"$ctrl.voteYes()\"></unreviewed-talk>\n<hr style=\"margin-top:20px\">\n<h3>Your Sessions\n<a zoom-in class=\"btn btn-primary btn-xs\" href=\"#/createsession\">Create a New Session</a>\n</h3>\n\n<div ng-repeat=\"session in $ctrl.userSessions\">\n  <session-detail session=\"session\" initial-collapsed=\"true\"></session-detail>\n</div>\n";

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('createNewSession', {
    template: __webpack_require__(92),
    bindings: {
        userSessions: '='
    },
    controller: function (toastr, currentIdentity, sessions) {
        this.create = function () {
            var newUserSession = {
                title: this.title,
                length: parseInt(this.length),
                abstract: this.abstract,
                userFirstName: currentIdentity.currentUser.firstName,
                userLastName: currentIdentity.currentUser.lastName,
                userId: currentIdentity.currentUser.id,
            };
            sessions.createNewSession(newUserSession).then(function (response) {
                this.userSessions.push(response.data);
            }.bind(this));
        };
    }
});


/***/ }),
/* 92 */
/***/ (function(module, exports) {

module.exports = "<nav></nav>\n\n<h1>Create New Session</h1>\n\n<form class=\"form\">\n  <div class=\"form-group\">\n    Give your session a title\n    <input required type=\"text\" placeholder=\"Title\" ng-model=\"$ctrl.title\" class=\"form-control\">\n  </div>\n  <div class=\"form-group\">\n    Enter a length, from 2 minutes to 30 minutes\n    <input required type=\"number\" placeholder=\"Length in Minutes\" \n      ng-model=\"$ctrl.length\" class=\"form-control\" min=\"2\" max=\"30\">\n  </div>\n  <div class=\"form-group\">\n    Describe your session\n    <textarea required name=\"\" id=\"\" cols=\"30\" rows=\"4\" \n      ng-model=\"$ctrl.abstract\" class=\"form-control\"\n      placeholder=\"Abstract\"></textarea>\n  </div>\n  \n  <div class=\"row\">\n    <div class=\"col-sm-3\">\n      <button class=\" btn btn-primary btn-sm\" ng-click=\"$ctrl.create()\">Create</button>\n    </div>\n  </div>\n</form>\n\n<h2>Your Other Sessions</h2>\n<div ng-repeat=\"session in $ctrl.userSessions\">\n  <session-detail session=\"session\" initial-collapsed=\"false\"></session-detail>\n</div>";

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('unreviewedTalk', {
    template: __webpack_require__(94),
    bindings: {
        session: '=',
        voteYes: '&',
        voteNo: '&'
    },
    controller: function () {
        this.yes = function () {
            this.voteYes();
        };
        this.no = function () {
            this.voteNo();
        };
    }
});


/***/ }),
/* 94 */
/***/ (function(module, exports) {

module.exports = "<div ng-show=\"!!$ctrl.session\">\n  <div  class=\"panel panel-default\">\n    <div class=\"panel-heading\">\n      {{$ctrl.session.title}}\n    </div>\n    <div class=\"panel-body\">\n      <p><strong>{{$ctrl.session.length | talkDuration}}</strong></p>\n      <p>{{$ctrl.session.abstract}}</p>\n    </div>\n  </div>\n\n  <span>Are you interested in this session?</span>\n  <button class=\"btn btn-primary btn-xs\" ng-click=\"$ctrl.yes()\">Yes</button>\n  <button class=\"btn btn-warning btn-xs\" ng-click=\"$ctrl.no()\">No</button>\n</div>\n<div ng-show=\"!$ctrl.session\" class=\"alert alert-success\" role=\"alert\"> \n  You have reviewed all the submitted sessions\n</div>";

/***/ }),
/* 95 */
/***/ (function(module, exports) {

angular.module('app').service('sessions', (function () {
    function Sessions($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    Sessions.prototype.getSessionsByUser = function (userId) {
        var dfd = this.$q.defer();
        this.$http.get('/api/sessions/user/' + userId).then(function (response) {
            dfd.resolve(response.data);
        }, function () {
            dfd.reject();
        });
        return dfd.promise;
    };
    Sessions.prototype.getAllSessions = function () {
        var dfd = this.$q.defer();
        this.$http.get('/api/sessions').then(function (response) {
            dfd.resolve(response.data);
        }, function () {
            dfd.reject();
        });
        return dfd.promise;
    };
    Sessions.prototype.createNewSession = function (newSession) {
        return this.$http.post('/api/sessions', newSession);
    };
    Sessions.prototype.getNextUnreviewedSession = function (userId) {
        return this.$http.get("/api/users/" + userId + "/randomUnreviewedSession");
    };
    Sessions.prototype.addReviewedSession = function (userId, sessionId) {
        return this.$http.post('/api/users/' + userId + '/reviewSession/' + sessionId);
    };
    Sessions.prototype.incrementVote = function (sessionId) {
        return this.$http.put('/api/sessions/' + sessionId + '/incrementVote/');
    };
    Sessions.prototype.getUnreviewedCount = function (userId) {
        return this.$http.get('/api/users/' + userId + '/unreviewedSessionCount');
    };
    return Sessions;
}()));


/***/ }),
/* 96 */
/***/ (function(module, exports) {

angular.module('app').service('unreviewedSessionCount', (function () {
    function UnreviewedSessionCount(sessions, currentIdentity) {
        this.value = 0;
        this.sessions = sessions;
        this.currentIdentity = currentIdentity;
    }
    UnreviewedSessionCount.prototype.updateUnreviewedSessionCount = function () {
        var _this = this;
        this.sessions.getUnreviewedCount(this.currentIdentity.currentUser.id)
            .then(function (response) {
            _this.value = response.data.count;
        });
    };
    return UnreviewedSessionCount;
}()));


/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('sessionDetail', {
    template: __webpack_require__(98),
    bindings: {
        session: '=',
        initialCollapsed: '@'
    },
    controller: function () {
    }
});


/***/ }),
/* 98 */
/***/ (function(module, exports) {

module.exports = "<detail-panel collapsed=\"{{$ctrl.initialCollapsed}}\" title=\"{{$ctrl.session.title}}\">\n  <strong>{{$ctrl.session.length | talkDuration}}</strong>\n  <p><small>{{$ctrl.session.abstract}}</small></p>  \n</detail-panel>\n";

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('sessionDetailWithVotes', {
    template: __webpack_require__(100),
    bindings: {
        session: '=',
        initialCollapsed: '@'
    },
    controller: function () {
    }
});


/***/ }),
/* 100 */
/***/ (function(module, exports) {

module.exports = "<detail-panel collapsed=\"{{$ctrl.initialCollapsed}}\" title=\"{{$ctrl.session.title}}\">\n  <strong>{{$ctrl.session.voteCount}} votes</strong>\n  <p>{{$ctrl.session.length | talkDuration}}</p>\n  <p><small>{{$ctrl.session.abstract}}</small></p>  \n</detail-panel>\n";

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('detailPanel', {
    transclude: true,
    template: __webpack_require__(102),
    bindings: {
        title: '@',
        initialCollapsed: '@collapsed'
    },
    controller: function () {
        this.collapsed = (this.initialCollapsed === 'true');
        this.collapse = function () {
            this.collapsed = !this.collapsed;
        };
    }
});


/***/ }),
/* 102 */
/***/ (function(module, exports) {

module.exports = "<div class=\"panel panel-primary\">\n  <div class=\"panel-heading pointable\" ng-click=\"$ctrl.collapse()\">\n    <span>{{$ctrl.title}}</span>\n  </div>\n  <div class=\"panel-body\" ng-hide=\"$ctrl.collapsed\" ng-transclude>\n  </div>\n</div>";

/***/ }),
/* 103 */
/***/ (function(module, exports) {

angular.module('app').filter('talkDuration', function () {
    return function (duration) {
        return "Duration: " + duration + " minutes";
    };
});


/***/ }),
/* 104 */
/***/ (function(module, exports) {

angular.module('app').directive('zoomIn', function () {
    return {
        restrict: 'A',
        link: function (scope, el, attrs) {
            el.on('mouseenter', function () {
                el[0].style.transform = "scale(1.1,1.1)";
            });
            el.on('mouseleave', function () {
                el[0].style.transform = "scale(1,1)";
            });
        }
    };
});


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

angular.module('app').component('profile', {
    template: __webpack_require__(106),
    controller: function ($location, toastr, currentIdentity) {
        this.profile = angular.copy(currentIdentity.currentUser);
        this.save = function () {
            currentIdentity.updateUser(this.profile);
            toastr.success('Profile Saved!');
        };
        this.cancel = function () {
            $location.path('/home');
        };
    }
});


/***/ }),
/* 106 */
/***/ (function(module, exports) {

module.exports = "<nav></nav>\n\n<h1>User Profile</h1>\n\n<form class=\"form-inline\">\n  <label for=\"firstName\">First Name</label>\n  <input type=\"text\" id=\"firstName\" placeholder=\"First Name\"\n    class=\"form-control\" ng-model=\"$ctrl.profile.firstName\">\n    \n  <label for=\"lastName\">Last Name</label>\n  <input type=\"text\" id=\"lastName\" placeholder=\"Last Name\"\n    class=\"form-control\" ng-model=\"$ctrl.profile.lastName\">\n  \n  <br><br>\n  <button class=\"btn btn-primary btn-sm\" ng-click=\"$ctrl.save()\">Save</button>\n  <button class=\"btn btn-warning btn-sm\" ng-click=\"$ctrl.cancel()\">Cancel</button>\n</form>";

/***/ })
]),[66]);
//# sourceMappingURL=ng1.bundle.js.map