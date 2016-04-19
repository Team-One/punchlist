var app = angular.module('app', ['firebase']);


app.controller('Ctrl', function($scope, $firebaseAuth, $firebaseArray) {

    var isNewUser = true;
    var ref = new Firebase('https://luminous-heat-4501.firebaseio.com/');
    var auth = $firebaseAuth(ref);
    var authData = ref.getAuth();

    // function authDataCallback(authData) {
    //     if (authData) {
    //        console.log("User " + authData.uid + " is logged in with " + authData.provider);
    //     } else {
    //         console.log("User is logged out");
    //     }
    // }

    // ref.onAuth(authDataCallback);

    // LOGIN WITH FACEBOOK
    $scope.LoginUser = {};
    auth.$onAuth(function(authData) {
        $scope.authData = authData;
        console.log(authData);
    });
    $scope.login = function() {
        auth.$authWithOAuthPopup("facebook").then(function(authData) {
            console.log("Logged in as:", authData.uid);
            $scope.LoginUser.name = authData.facebook.displayName;
            $scope.LoginUser.imgSrc = authData.facebook.cachedUserProfile.picture.data.url;
        }).catch(function(error) {
            console.log("Authentication failed:", error);
        });
    }
    $scope.logout = function() {
        auth.$unauth();
    }

    function getName(authData) {
        switch(authData.provider) {
            case 'password':
                return authData.password.email.replace(/@.*/, '');
            case 'twitter':
                return authData.twitter.displayName;
            case 'facebook':
                return authData.facebook.displayName;
        }
    }

    ref.onAuth(function(authData) {
        if (authData && isNewUser) {
            ref.child("users").child(authData.uid).set({
            provider: authData.provider,
            name: getName(authData)
            });
        }
    });

    // TODO LIST

    $scope.todos = $firebaseArray(ref);

    // ADD TODO

    $scope.addTodo = function () {

        var timestamp = new Date().valueOf();
        $scope.todos.$add({
            id: timestamp,
            name: $scope.todoName,
            status: 'pending'
        });
        $scope.todoName = "";
    };

    // REMOVE TODO 
    $scope.removeTodo = function (index, todo) {
        
        // CHECK THAT ITEM IS VALID
        if (todo.id === undefined)return;

        // FIREBASE: REMOVE ITEM FROM LIST
        $scope.todos.$remove(todo);
    };

    // IN PROGRESS
    $scope.startTodo = function (index, todo) {

        // CHECK IF ITEM IS VALID
        if (todo.id === undefined)return;

        // UPDATE
        todo.status = 'in progress';
        $scope.todos.$save(todo);

    };

    // COMPLETE
    $scope.completeTodo = function (index, todo) {

        // CHECK THAT ITEM IS VALID
        if (todo.id === undefined)return;

        // UPDATE STATUS TO COMPLETE AND SAVE
        todo.status = 'complete';
        $scope.todos.$save(todo);
    };
});