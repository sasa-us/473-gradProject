angular.module('DashboardModule').controller('DashboardController', ['$scope', '$http', 'toastr', function($scope, $http, toastr){


	$scope.submitDeposit = function (){

    //alert("Update balance.");
    // Submit request to Sails.
    $http.put('/update', {
      depositNum: $scope.depositNum,
  
    })
    .then(function onSuccess (){
      // Load the page again.
       window.location.reload(true);

    })
    .catch(function onError(sailsResponse) {

      // Handle known error type(s).
      if (sailsResponse.status === 400 || 404) {
        toastr.error('Invalid email/password combination.', 'Error', {
          closeButton: true
        });
        return;
      }
				toastr.error('An unexpected error occurred, please try again.', 'Error', {
					closeButton: true
				});
				return;

    })
    .finally(function eitherWay(){   
    });
  };//end $scope.submitDeposit
  
  //======================================playGame====================
  $scope.playGame = function (){
    //alert("Play game.");
    // Submit request to Sails.
    $http.get('/play')
    .then(function onSuccess (sailsResponse){
       window.location.reload(true);
    })
    .catch(function onError(sailsResponse) {
      // Handle known error type(s).    
      if (sailsResponse.status === 400 || 404) { 
        return;
      }
    })//end catch
    .finally(function eitherWay(){
     
    });//end finally
  };//end $scope.playGame 
  
  //=========================================loadBalance====================
  $scope.loadBalance = function (){
    //return 999;
    //alert("Load balance.");
    // Submit request to Sails.
    $http.get('/balance')
    .then(function onSuccess (sailsResponse){
      // Load the page again.
       $scope.bal = sailsResponse.data.balance;
       if(sailsResponse.data.balance == 0) {
        alert("Your balance is 0. Please add more fund to play the game.");
       }
       return;

    })
    .catch(function onError(sailsResponse) {
      // Handle known error type(s).    
      if (sailsResponse.status === 400 || 404) { 
        return ;
      }
    })//end catch
    .finally(function eitherWay(){
     
    });//end finally
    
  };//end $scope.loadBalance 

}]);

