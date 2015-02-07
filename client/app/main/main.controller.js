'use strict';

angular.module('newsHackApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $http.get('/feed').success(function(feedObj) {
      console.log("Returned json " + feedObj);
      json = JSON.parse(feedObj)
      $scope.validatePost = function(post) {
        var contentCount = 0;
        if (post.hasOwnProperty('picture')) {
          contentCount ++;
        };

        if (post.hasOwnProperty('name')) {
          contentCount ++;
        };

        if (post.hasOwnProperty('description') || post.hasOwnProperty('message')) {
          contentCount ++;
        };

        return contentCount >= 2;
      }

      $scope.categories = [];
      $scope.categoryPosts = [];
      console.log("testing!");
      // $.getJSON("./test.json", function(json) {
      //   console.log(json); // this will show the info it in firebug console
      // });
      var categories = [];
      var categoryPosts = [];
      // for (var key in json) {
      //   if (json.hasOwnProperty(key)) {
      //     console.log("Key is " + key);
      //     var currentPost = json[key];
      //     if ($scope.validatePost(currentPost)) {
      //       var category = currentPost.category;
      //       if (categories.hasOwnProperty(category)) {
      //         categories[category] = categories[category] + 1;
      //       } else {
      //         categories[category] = 1;
      //         categoryPosts[category] = [];
      //       };

      //       categoryPosts[category].push(currentPost);
      //     };
          
      //   }
      // }

      for (var currentPost in json) {
        //console.log("Current post message is " + currentPost);
        if ($scope.validatePost(currentPost)) {
          console.log("validated");
          var category = currentPost.category;
          if (categories.hasOwnProperty(category)) {
            categories[category] = categories[category] + 1;
          } else {
            categories[category] = 1;
            categoryPosts[category] = [];
          };

          categoryPosts[category].push(currentPost);
        } else {
        }
      }
      var sortCategory = function() {
        for (var key in categories) {
          if (categories.hasOwnProperty(key)) {
            $scope.categories.push(key);
          };
        }
        $scope.categories.sort(function(a, b){
          return categories[b] - categories[a];
        });
      };
      sortCategory();
      $scope.categoryPosts = categoryPosts;
      $scope.currentCategory = $scope.categories[0];
      $scope.changeCurrentCategory = function(currentCategory) {
        $scope.currentCategory = currentCategory;
      };
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };


  });
