var app = angular.module('app', ['firebase']);


app.controller('Ctrl', function($scope, $firebaseAuth, $firebaseArray) {
        
    var ref = new Firebase('https://luminous-heat-4501.firebaseio.com/');


    // LOGIN WITH GITHUB

    var auth = $firebaseAuth(ref);

    auth.$onAuth(function(authData) {
        $scope.authData = authData;
    })
    $scope.login = function() {
        auth.$authWithOAuthPopup("github").catch(function(error) {
            console.error(error);
        });
    }
    $scope.logout = function() {
        auth.$unauth();
    }

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