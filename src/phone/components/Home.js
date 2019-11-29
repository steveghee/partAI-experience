// $scope, $element, $attrs, $injector, $sce, $timeout, $http, $ionicPopup, and $ionicPopover services are available



$scope.targets = [
  { id:"mtar", src:"vuforia-trained:///app/resources/Uploaded/multitargetmodel/MTar_Liveworx_5_models?id=" },
  { id:"268a", src:"vuforia-model:///app/resources/Uploaded/multitargetmodel/model_268a_recenter_single_view?id=" },
  { id:"63c4", src:"vuforia-model:///app/resources/Uploaded/multitargetmodel/model_63c4_recenter_single_view?id=" },
  { id:"8c72", src:"vuforia-model:///app/resources/Uploaded/multitargetmodel/model_8c72_recenter_single_view?id=" },
  { id:"a2b7", src:"vuforia-model:///app/resources/Uploaded/multitargetmodel/model_a2b7_recenter_single_view?id=" },
  { id:"c44e", src:"vuforia-model:///app/resources/Uploaded/multitargetmodel/model_c44e_recenter_single_view?id=" }
];

$scope.cart = [];

$scope.$on('trackingacquired', function (evt, args) {
  $scope.view.wdg['debug'].text = "recognising "+args.toString()+"..."; 
  
  if(args.toString().includes("_recenter_360")){
    $scope.iv = $timeout(function() {
      //$scope.view.wdg['debug'].text      = "loading..."; 
      $scope.view.wdg.flasher.src     = "app/resources/Uploaded/multitargetmodel/models_recentered/"+args.toString()+".pvz"; 
      $scope.view.wdg.flasher.visible = true;
    },666);
  }
  
  $timeout(function() {
    let mapping = args.toString();
    if(mapping.includes("_recenter_single_view"))
        mapping = mapping.replace("_recenter_single_view", "");
    else {
      mapping = mapping.replace("_recenter_360", "");
      //sg twx.app.fn.triggerWidgetService("3DContainer-1", "lockCameraAndOrientation");
    }
    switch(mapping){
      case "model_8c72":
        mapping = "E00000143011";
        break;
      case "model_268a":
        mapping = "E00000216852";
        break;
      case "model_63c4":
        mapping = "E00000132877";
        break;
      case "model_a2b7":
        mapping = "E00000141683";
        break;
      case "model_c44e":
        mapping = "E00000138137";
        break;
      default:
        mapping = undefined;
    }
    $scope.view.wdg['label-1'].text = "Detected Part: " + mapping;
    if(mapping != undefined) {
      twx.app.fn.triggerDataService("pp-1901231417sq.portal.ptc.io_FTLDP.Europe.Extractor", "WindchillPartQueryJSON", {'number':mapping});
    }

    //Show Popup
    $scope.view.wdg['button-2'].visible = true;
    //$scope.view.wdg['button-3'].visible = true;
    angular.element(document.querySelector   ('[widget-id="card-2"] div:first-child')).addClass('cardWindchillButton').removeClass("cardWindchillHide");
    angular.element(document.querySelectorAll('[widget-id="button-1"] button')).addClass('ion-chevron-left').removeClass("ion-chevron-right");
    $scope.view.wdg['button-1'].disabled = true;
  }, 100);
});

$timeout(function() {
  $scope.$on('trackinglost', function (evt, args) {
    if(angular.element(document.querySelector   ('[widget-id="card-2"] div:first-child')).hasClass("cardWindchill")) {
       angular.element(document.querySelector   ('[widget-id="card-2"] div:first-child')).addClass('cardWindchillHide').removeClass("cardWindchill");
       angular.element(document.querySelectorAll('[widget-id="button-1"] button')).addClass('ion-chevron-right').removeClass("ion-chevron-left");
    }
    $scope.view.wdg['label-2'].text = "Rating: ";
    $scope.view.wdg['label-1'].text = "Detected Part: ";
    //reset the timer
    if($scope.iv != undefined) {

      $timeout.cancel($scope.iv);
      $scope.iv = undefined;
    }

    $scope.view.wdg.flasher.visible = false;
  });
}, 500);

$scope.onLoaded = function(name) {
  $scope.view.wdg['debug'].text      = "loaded"; 
  $scope.view.wdg.flasher.shader  = "shaded"; 
  $scope.view.wdg.flasher.visible = true;
}

$scope.showJustWindchillInfo = function() {
  //twx.app.fn.triggerWidgetService("3DContainer-1", "unlockCameraAndOrientation");
  if(angular.element(document.querySelector('[widget-id="card-2"] div:first-child')).hasClass("cardWindchillButton")){
    angular.element(document.querySelector('[widget-id="card-2"] div:first-child')).addClass('cardWindchill').removeClass("cardWindchillButton");
  }
  $scope.view.wdg['button-1'].disabled = false;
}

$scope.hideWindchillInfo = function() {
  if(angular.element(document.querySelector('[widget-id="card-2"] div:first-child')).hasClass("cardWindchill")) {
    angular.element(document.querySelector('[widget-id="card-2"] div:first-child')).addClass('cardWindchillHide').removeClass("cardWindchill");
    angular.element(document.querySelectorAll('[widget-id="button-1"] button')).addClass('ion-chevron-right').removeClass("ion-chevron-left");
  }
  else if(angular.element(document.querySelector('[widget-id="card-2"] div:first-child')).hasClass("cardWindchillButton")) {
    angular.element(document.querySelector('[widget-id="card-2"] div:first-child')).addClass('cardWindchillHide').removeClass("cardWindchillButton");
    angular.element(document.querySelectorAll('[widget-id="button-1"] button')).addClass('ion-chevron-right').removeClass("ion-chevron-left");
  }
  else {
    angular.element(document.querySelector('[widget-id="card-2"] div:first-child')).addClass('cardWindchill').removeClass("cardWindchillHide");
    angular.element(document.querySelectorAll('[widget-id="button-1"] button')).addClass('ion-chevron-left').removeClass("ion-chevron-right");
  }
}

$scope.pulseAddButton = function () {
  $scope.addToCart();
  angular.element(document.querySelector('[widget-id="button-2"] button:first-child')).addClass('pulse');
  $timeout(function(){
    angular.element(document.querySelector('[widget-id="button-2"] button:first-child')).removeClass('pulse');
    $scope.showJustWindchillInfo();
  },1100);
}

$scope.showCart = function() {
  $scope.view.wdg['label-3'].text = "Part Storing List";
  $scope.view.wdg['repeater-1'].visible = true;
  $scope.view.wdg['button-4'].visible = true;
  $scope.view.wdg['AddToCard'].visible = true;
  
  if(angular.element(document.querySelector('[widget-id="card-2"] div:first-child')).hasClass("cardWindchill")){
    angular.element(document.querySelector('[widget-id="card-2"] div:first-child')).addClass('cardWindchillHide').removeClass("cardWindchill");
    angular.element(document.querySelectorAll('[widget-id="button-1"] button')).addClass('ion-chevron-right').removeClass("ion-chevron-left");
  }
}

// simple part cart - counts named items and passes this to app param which is bound to a repeater widget 
$scope.addToCart = function() {
  var name = $scope.view.wdg['label-1'].text
  name = name.replace("Detected Part: ", "");
  // add N items (from item count) to the cart - if the cart already contains that part, incrememnt the count
  var ci = $scope.cart[name];
  if (ci === undefined) {
    let stor= "B" + Math.floor(Math.random() * (99 - 10) + 10) + ".000" + Math.floor(Math.random() * (99999 - 10000) + 10000);
    ci = { count : 1, name:name, storage: stor.toString() }; 
  }
  else 
    ci.count += 1;
  $scope.cart[name] = ci;
  
  // format this so that the table/repeater can cope with it
  var cn = 0;
  var cc = [];
  for(var itm in $scope.cart) {
    cn += $scope.cart[itm].count;
    cc.push( {    id: $scope.cart[itm].name,
               count: $scope.cart[itm].count,
             storage: $scope.cart[itm].storage
             } );
  }
  $scope.app.params.cart = cc;
}

$scope.$on('WindchillPartQueryJSON.serviceInvokeComplete', function(evt, arg) {
  $scope.view.wdg['storage'].visible = false;
  var data = twx.app.mdl["pp-1901231417sq.portal.ptc.io_FTLDP.Europe.Extractor"].svc["WindchillPartQueryJSON"].data;
  $scope.view.wdg['number'].text = "Number:\t" + data.number;
  $scope.view.wdg['name'].text = "Name: " + data.name;
  //$scope.view.wdg['label-1'].text = "Detected Part: " + data.number;
  $scope.view.wdg['id'].text = "ID: " + data.id;
  $scope.view.wdg['windchillURL'].text = "Server: " + data.windchillURL;
  $scope.view.wdg['version'].text = "Version: " + data.version;
  $scope.view.wdg['attributes-1'].text = "IBA|Part_Cost: " + data['IBA|Part_Cost'];
  $scope.view.wdg['attributes-2'].text = "In Stock: " + data['IBA|noInStock'];
});

$scope.$on('WindchillPartQueryJSON.serviceFailure', function(evt, arg) {
  let number, name, version, inStock, storage;
  number = $scope.view.wdg['label-1'].text
  number = number.replace("Detected Part: ", "");
  switch(number) {
    case "E00000143011":
      name = "Subframe Rear Bar Link Compartment Welding Assembly";
      version = "1.2 (Design)";
      inStock = 876;
      storage = "B11.00042684";
      break;
    case "E00000216852":
      name = "Assembly weld crashbox support left";
      version = "1.3 (Design)"
      inStock = 93;
      storage = "B31.000062474";
      break;
    case "E00000132877":
      name = "Bracket wiper system";
      version = "1.2 (Design)";
      inStock = 38;
      storage = "B07.00069872";
      break;
    case "E00000141683":
      name = "Bracket Pedal Throttle INST";
      version = "1.2 (Design)";
      inStock = 876;
      storage = "C84.000893215";
      break;
    case "E00000138137":
      name = "Fixation E Axle right";
      version = "1.4 (Design)";
      inStock = 786;
      storage = "A12.04569842";
      break;
    default:
      name = "none";
      version = "none";
      inStock = "none";
      storage = "B11.00049884";
      break;
  }
  $scope.view.wdg['name'].text = "Name: " + name;
  $scope.view.wdg['version'].text = "Version: " + version;
  $scope.view.wdg['attributes-2'].text = "In Stock: " + inStock;
  $scope.view.wdg['storage'].text = "Storage: " + storage;
});