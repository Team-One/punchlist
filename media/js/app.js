var todoApp = angular.module('TodoApp', ['firebase']);


todoApp.controller('TodoCtrl', ['$scope', '$firebaseArray',
    function($scope, $firebaseArray) {
        
    // CREATE A FIREBASE REFERENCE
    var todosRef = new Firebase('https://luminous-heat-4501.firebaseio.com/');

    // GET TODOS AS AN ARRAY
    $scope.todos = $firebaseArray(todosRef);

    // ADD TODO ITEM METHOD
    $scope.addTodo = function () {

        // CREATE A UNIQUE ID
        var timestamp = new Date().valueOf();

        $scope.todos.$add({
            id: timestamp,
            name: $scope.todoName,
            status: 'pending'
        });

        $scope.todoName = "";

    };

    // REMOVE TODO ITEM METHOD
    $scope.removeTodo = function (index, todo) {
        
        // CHECK THAT ITEM IS VALID
        if (todo.id === undefined)return;

        // FIREBASE: REMOVE ITEM FROM LIST
        $scope.todos.$remove(todo);
    };

    // MARK TODO AS IN PROGRESS METHOD
    $scope.startTodo = function (index, todo) {

        // CHECK THAT ITEM IS VALID
        if (todo.id === undefined)return;

        // UPDATE STATUS TO IN PROGRESS AND SAVE
        todo.status = 'in progress';
        $scope.todos.$save(todo);

    };

    // MARK TODO AS COMPLETE METHOD
    $scope.completeTodo = function (index, todo) {

        // CHECK THAT ITEM IS VALID
        if (todo.id === undefined)return;

        // UPDATE STATUS TO COMPLETE AND SAVE
        todo.status = 'complete';
        $scope.todos.$save(todo);
    };

}]);