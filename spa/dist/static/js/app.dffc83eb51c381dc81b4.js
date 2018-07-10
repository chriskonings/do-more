webpackJsonp([1],{"3GDu":function(e,t,a){"use strict";var n=a("Xxa5"),s=a.n(n),i=a("exGp"),c=a.n(i),r=a("jyVo"),l={name:"Map",props:["emitMap","markers","infoWindow"],data:function(){return{position:{lat:0,lng:0},map:null,currentPlace:null,errors:[],myPosPin:null}},mounted:function(){this.initMap(),this.getLocation()},methods:{initMap:function(){var e=this;e.map=new google.maps.Map(this.$refs.map,{zoom:17,center:this.position,mapTypeControl:!1});var t=new google.maps.places.PlacesService(e.map);google.maps.event.addListener(e.map,"click",function(a){a.placeId&&(a.stop(),t.getDetails({placeId:a.placeId},function(t,a){var n=new google.maps.Marker({position:{lat:t.geometry.location.lat(),lng:t.geometry.location.lng()},map:e.map,title:t.name,visible:!1});e.infoWindow.el.open(e.map,n),"OK"===a&&(e.infoWindow.content={name:t.name,phone:t.formatted_phone_number,place:t,url:t.url,image_url:void 0!==t.photos?t.photos[0].getUrl({maxWidth:100,maxHeight:100}):""})}))}),this.yourPin=new google.maps.Marker({icon:r.a.pinSymbol("green")})},getLocation:function(){var e=this;if(navigator.geolocation){navigator.geolocation.getCurrentPosition(function(t){var a=t.coords,n=new google.maps.LatLng(a.latitude,a.longitude);e.map.panTo(n),e.placeMyPosPin(a.latitude,a.longitude)},function(e){console.warn("ERROR("+e.code+"): "+e.message)},{enableHighAccuracy:!0,timeout:5e3,maximumAge:0})}},placeMyPosPin:function(e,t){var a=this;return c()(s.a.mark(function n(){return s.a.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:a.myPosPin&&a.myPosPin.setMap(null),a.myPosPin=new google.maps.Marker({position:{lat:e,lng:t},icon:r.a.pinSymbol("green"),animation:google.maps.Animation.DROP}),a.myPosPin.setMap(a.map);case 3:case"end":return n.stop()}},n,a)}))()},whereToGo:function(){var e=this.markers.map(function(e){return[e.position.lat(),e.position.lng()]}),t=r.a.calcPrimeLocation(e);if(t){var a=new google.maps.LatLng(t[0],t[1]);this.yourPin.setPosition({lat:t[0],lng:t[1]}),this.yourPin.setMap(this.map),this.map.panTo(a)}else this.yourPin.setMap(null)}},watch:{map:function(){this.$emit("emitMap",this.map)}}},o={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"c-map"},[t("div",{staticClass:"c-map__btns"},[t("button",{staticClass:"c-map__location-btn",on:{click:this.getLocation}},[t("svg",{staticClass:"c-map__location-btn-icon",attrs:{xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",width:"38",height:"37",viewBox:"0 0 44 34"}},[t("defs",[t("filter",{attrs:{id:"a",width:"128%",height:"128%",x:"-14%",filterUnits:"objectBoundingBox"}},[t("feOffset",{attrs:{dy:"2",in:"SourceAlpha",result:"shadowOffsetOuter1"}}),t("feGaussianBlur",{attrs:{in:"shadowOffsetOuter1",result:"shadowBlurOuter1",stdDeviation:"2"}}),t("feColorMatrix",{attrs:{in:"shadowBlurOuter1",result:"shadowMatrixOuter1",values:"0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"}}),t("feMerge",[t("feMergeNode",{attrs:{in:"shadowMatrixOuter1"}}),t("feMergeNode",{attrs:{in:"SourceGraphic"}})],1)],1)]),t("path",{attrs:{fill:"#EFEFEF","fill-rule":"evenodd",d:"M6.67 25.25l30.45-13.58-15.23 30.35-2.61-13.71z",filter:"url(#a)",transform:"translate(-3 -10)"}})])])]),this._v(" "),t("div",{ref:"map",staticClass:"c-map__canvas"})])},staticRenderFns:[]},u=a("VU/8")(l,o,!1,null,null,null);t.a=u.exports},BXaq:function(e,t,a){"use strict";var n=a("fZjL"),s=a.n(n),i=a("Xxa5"),c=a.n(i),r=a("exGp"),l=a.n(r),o=a("MhFl"),u={name:"MyGems",props:["user"],data:function(){return{loading:!1,gems:[],deleting:null,loadingImgs:{}}},mounted:function(){var e=this;return l()(c.a.mark(function t(){return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getGems();case 2:case"end":return t.stop()}},t,e)}))()},methods:{getGems:function(){var e=this;return l()(c.a.mark(function t(){return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.loading=!0,e.$bindAsArray("gems",o.a.ref("gems").orderByChild("users/"+e.user.uid),null,function(){return e.loading=!1});case 2:case"end":return t.stop()}},t,e)}))()},deleteGem:function(e){var t=e[".key"];o.a.ref().child("gems").child(t).remove().then(function(){console.log("Remove succeeded.")}).catch(function(e){console.log("Remove failed: ",e.message)})},imageLoaded:function(e){this.$set(this.loadingImgs,e,!1)}},watch:{gems:function(e){var t=this,a=s()(this.loadingImgs);e.map(function(e){a.includes(e.place.id)||t.$set(t.loadingImgs,e.place.id,!0)})}}},m={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"c-my-gems"},[e._m(0),e._v(" "),e.loading?a("div",{staticClass:"spinner"}):a("ul",{staticClass:"c-my-gems__list"},e._l(e.gems,function(t,n){return a("li",{key:n,staticClass:"c-my-gem"},[a("div",{staticClass:"c-my-gem__cont"},[a("div",{staticClass:"c-my-gem__img-container",class:{"is-loading":e.loadingImgs[t.place.id]}},[a("img",{directives:[{name:"show",rawName:"v-show",value:!e.loadingImgs[t.place.id],expression:"!loadingImgs[g.place.id]"}],staticClass:"c-my-gem__img",attrs:{src:t.place.image_url,alt:"place-photo"},on:{load:function(a){e.imageLoaded(t.place.id)}}})]),e._v(" "),a("div",{staticClass:"c-my-gem__details"},[a("div",{staticClass:"c-my-gem__name"},[e._v(e._s(t.place.name))]),e._v(" "),a("div",{staticClass:"c-my-gem__loc"},[e._v(e._s(t.place.city)+", "+e._s(t.place.country))])]),e._v(" "),a("ul",{staticClass:"c-my-gem__btns"},[a("li",{staticClass:"c-my-gem__btn"},[a("a",{staticClass:"c-btn c-btn--naked",attrs:{href:t.place.link,target:"_blank"}},[e._v("\n              Link\n            ")])]),e._v(" "),a("li",{staticClass:"c-my-gem__btn"},[a("button",{staticClass:"c-btn c-btn--naked",on:{click:function(t){e.deleting=n}}},[e._v("\n              Trash\n            ")])])])]),e._v(" "),e.deleting===n?a("div",{staticClass:"c-my-gem__delete"},[e._v("\n        Are you sure you want to delete this gem?\n        "),a("div",{staticClass:"c-my-gem__delete-btns"},[a("button",{staticClass:"c-btn c-btn--naked",on:{click:function(a){e.deleteGem(t)}}},[e._v("Yes")]),e._v(" "),a("button",{staticClass:"c-btn c-btn--naked",on:{click:function(t){e.deleting=null}}},[e._v("No")])])]):e._e()])}))])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"c-my-gems__title"},[t("p",[this._v("Places you have discovered")])])}]},d=a("VU/8")(u,m,!1,null,null,null);t.a=d.exports},COvG:function(e,t,a){"use strict";var n=a("fgbI"),s={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("Accordion",{attrs:{label:"Filter"}},[a("ActivitySelect",{on:{getActivities:e.getActivities}}),e._v(" "),a("div",[a("label",{staticClass:"c-label"},[e._v("Order")]),e._v(" "),a("select",{directives:[{name:"model",rawName:"v-model",value:e.sortBy,expression:"sortBy"}],staticClass:"c-select",on:{change:function(t){var a=Array.prototype.filter.call(t.target.options,function(e){return e.selected}).map(function(e){return"_value"in e?e._value:e.value});e.sortBy=t.target.multiple?a:a[0]}}},[a("option",{attrs:{value:"distance"}},[e._v("Distance")]),e._v(" "),a("option",{attrs:{value:"best_match"}},[e._v("Best Match")]),e._v(" "),a("option",{attrs:{value:"rating"}},[e._v("Rating")]),e._v(" "),a("option",{attrs:{value:"review_count"}},[e._v("Review Count")])])])],1),e._v(" "),a("div",{staticClass:"u-txt-center"},[e.searching?a("div",{staticClass:"spinner"}):a("button",{staticClass:"c-btn",attrs:{disabled:e.searching},on:{click:function(t){return t.preventDefault(),e.search(t)}}},[e._v("\n      Search\n    ")])]),e._v(" "),e.places?a("Places",{attrs:{places:e.places,claimPlace:e.claimPlace,user:e.user,page:e.page,loading:e.searching,markers:e.markers,map:e.map,infoWindow:e.infoWindow},on:{getPlaces:e.getPlaces}}):e._e()],1)},staticRenderFns:[]},i=a("VU/8")(n.a,s,!1,null,null,null);t.a=i.exports},EwB7:function(e,t,a){"use strict";var n=a("fZjL"),s=a.n(n),i={name:"Places",props:["places","claimPlace","user","page","loading","markers","map","infoWindow"],data:function(){return{currentlyHighlighted:null,loadingImgs:{}}},methods:{highlight:function(e,t,a){var n=this;this.currentlyHighlighted!==a&&(this.currentlyHighlighted=a,this.markers.forEach(function(a){a.place.id===t&&(n.infoWindow.el.open(n.map,a),n.infoWindow.content=e)}))},loadMore:function(){this.$emit("getPlaces")},imageLoaded:function(e){this.$set(this.loadingImgs,e,!1)}},watch:{places:function(e){var t=this,a=s()(this.loadingImgs);e.map(function(e){a.includes(e.id)||t.$set(t.loadingImgs,e.id,!0)})}}},c={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"c-my-gems"},[a("ul",{staticClass:"c-my-gems__list"},e._l(e.places,function(t,n){return a("li",{key:n,staticClass:"c-my-gem",on:{mouseover:function(a){e.highlight(t,t.id,n)}}},[a("div",{staticClass:"c-my-gem__cont"},[a("div",{staticClass:"c-my-gem__img-container",class:{"is-loading":e.loadingImgs[t.id]}},[a("img",{directives:[{name:"show",rawName:"v-show",value:!e.loadingImgs[t.id],expression:"!loadingImgs[p.id]"}],staticClass:"c-my-gem__img",attrs:{src:t.image_url,alt:"place-photo"},on:{load:function(a){e.imageLoaded(t.id)}}})]),e._v(" "),a("div",{staticClass:"c-my-gem__details"},[a("div",{staticClass:"c-my-gem__name"},[e._v(e._s(t.name))]),e._v("\n          Shared by:\n          "),e._l(t.users,function(n,s){return t.users?a("div",{key:s},[e._v("\n            "+e._s(n.displayName)+"\n          ")]):e._e()})],2),e._v(" "),a("ul",{staticClass:"c-my-gem__btns"},[a("li",{staticClass:"c-my-gem__btn"},[a("a",{staticClass:"c-btn c-btn--naked",attrs:{href:t.url,target:"_blank"}},[e._v("\n              Link\n            ")])]),e._v(" "),a("li",{staticClass:"c-my-gem__btn"},[a("button",{staticClass:"c-btn c-btn--naked",attrs:{disabled:!e.user},on:{click:function(a){a.preventDefault(),e.claimPlace(t)}}},[e._v("\n              Claim\n            ")])])])])])})),e._v(" "),e.page>=1&&!e.loading?a("button",{staticClass:"c-btn",on:{click:function(t){return t.preventDefault(),e.loadMore(t)}}},[e._v("\n    Load More\n  ")]):e._e(),e._v(" "),e.page>=1&&e.loading?a("div",{staticClass:"spinner"}):e._e()])},staticRenderFns:[]},r=a("VU/8")(i,c,!1,null,null,null);t.a=r.exports},"H+ap":function(e,t){e.exports={activities:[{name:"park"},{name:"music"},{name:"cycling"},{name:"pub"},{name:"food"},{name:"shopping"},{name:"movies"},{name:"bouldering"},{name:"snowboarding"},{name:"climbing"},{name:"skatehboardng"},{name:"surfing"}]}},"H/op":function(e,t){},IxXz:function(e,t){e.exports={keys:{GOOGLEMAPS:"AIzaSyCS0KrhCnNOyW__KqWeeN-ZCC0ZuQNd3m4",FIREBASE:"AIzaSyD5iTbGZz3murpqAeONbujZXiz2Wkek8hE",YELP:"Ofpipn5mCCKKjnxKryn-AKZgv6HTrs1dMI-oomDEvGqvOubCN35uPZ5MDCowjkmpqq97mGLfdABNVvFOQi2COBNDLcPPJT0oCpDi93wpkOk-hwg6lAqAEpCQnD7WWnYx"}}},KKye:function(e,t){e.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzEiIGhlaWdodD0iNDMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTUuNSA0Mi4yNTNsMTIuMDYzLTkuMjQ4YTcuNSA3LjUgMCAwIDAgMi45MzctNS45NTJWOEE3LjUgNy41IDAgMCAwIDIzIC41SDhBNy41IDcuNSAwIDAgMCAuNSA4djE5LjA1M2E3LjUgNy41IDAgMCAwIDIuOTM3IDUuOTUyTDE1LjUgNDIuMjUzeiIgc3Ryb2tlPSIjNkI2QjZCIiBmaWxsPSIjRkZGIi8+PHBhdGggZD0iTTE1LjUgMzMuODNsLS4zMzUtLjI4M0M3Ljk1NSAyNy41OTcgNiAyNS41IDYgMjIuMWMwLTIuODMzIDIuMjM1LTUuMSA1LjAzLTUuMSAyLjI5IDAgMy41NzYgMS4zMDMgNC40NyAyLjMyMy44OTQtMS4wMiAyLjE4LTIuMzIzIDQuNDctMi4zMjMgMi43OTUgMCA1LjAzIDIuMjY3IDUuMDMgNS4xIDAgMy40LTEuOTU2IDUuNDk3LTkuMTY1IDExLjQ0N2wtLjMzNS4yODN6IiBmaWxsPSIjRkY2RjZGIi8+PHBhdGggZD0iTTE1LjUgMzMuODNsLS4zMzUtLjI4M0M3Ljk1NSAyNy41OTcgNiAyNS41IDYgMjIuMWMwLTIuODMzIDIuMjM1LTUuMSA1LjAzLTUuMSAyLjI5IDAgMy41NzYgMS4zMDMgNC40NyAyLjMyMy44OTQtMS4wMiAyLjE4LTIuMzIzIDQuNDctMi4zMjMgMi43OTUgMCA1LjAzIDIuMjY3IDUuMDMgNS4xIDAgMy40LTEuOTU2IDUuNDk3LTkuMTY1IDExLjQ0N2wtLjMzNS4yODN6bS00LjQ3LTE1LjY5N2MtMi4xOCAwLTMuOTEyIDEuNzU3LTMuOTEyIDMuOTY3IDAgMi44OSAxLjc4OCA0LjgxNyA4LjM4MiAxMC4yNTcgNi41OTQtNS40NCA4LjM4Mi03LjM2NyA4LjM4Mi0xMC4yNTcgMC0yLjIxLTEuNzMyLTMuOTY3LTMuOTExLTMuOTY3LTEuOTU2IDAtMy4wMTggMS4xOS0zLjg1NiAyLjE1NGwtLjYxNS43MzYtLjYxNS0uNzM2Yy0uODM4LS45NjQtMS45LTIuMTU0LTMuODU2LTIuMTU0eiIgZmlsbD0iIzZCNkI2QiIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjwvc3ZnPgo="},MhFl:function(e,t,a){"use strict";a.d(t,"a",function(){return r});var n=a("Sazm"),s=a.n(n),i=a("YtIj"),c=(a.n(i),a("IxXz")),r=s.a.initializeApp({apiKey:c.keys.FIREBASE,authDomain:"do-more-ecc5c.firebaseapp.com",databaseURL:"https://do-more-ecc5c.firebaseio.com/",projectId:"do-more-ecc5c",storageBucket:"do-more-ecc5c.appspot.com",messagingSenderId:"669577878898"}).database()},NHnr:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=a("7+uW"),s=a("1mcD"),i=a.n(s),c=a("xJD8"),r={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"o-app",attrs:{id:"app"}},[t("router-view",{attrs:{googleMaps:this.googleMaps}})],1)},staticRenderFns:[]},l=a("VU/8")(c.a,r,!1,null,null,null).exports,o=a("/ocq"),u=a("tWeu"),m={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"o-root"},[e.globalMap?e._e():a("div",{staticClass:"spinner"}),e._v(" "),e.globalMap?a("main",{staticClass:"o-main"},[a("User",{attrs:{user:e.user},on:{showUserMenu:function(t){e.menu=3}}}),e._v(" "),a("div",{staticClass:"c-menu"},[a("ul",{staticClass:"c-menu__tabs"},[a("li",{staticClass:"c-menu__tab"},[a("button",{staticClass:"c-menu__tab-btn",class:{" c-menu__tab-btn--is-active":0===e.menu},on:{click:function(t){e.menu=0}}},[e._v("\n            Discover\n          ")])]),e._v(" "),a("li",{staticClass:"c-menu__tab"},[a("button",{staticClass:"c-menu__tab-btn",class:{" c-menu__tab-btn--is-active":2===e.menu},attrs:{disabled:!e.user},on:{click:function(t){e.menu=2}}},[e._v("\n            Hot\n          ")])])]),e._v(" "),a("div",{staticClass:"c-menu__cont"},[a("LocationSearch",{directives:[{name:"show",rawName:"v-show",value:0===e.menu,expression:"menu === 0"}],staticClass:"c-form__item",attrs:{map:e.globalMap}}),e._v(" "),a("FindPlaces",{directives:[{name:"show",rawName:"v-show",value:0===e.menu,expression:"menu === 0"}],attrs:{user:e.user,map:e.globalMap,radius:e.radius,infoWindow:e.infoWindow,claimPlace:e.claimPlace},on:{emitMarkers:e.updateMarkers,clearMarkers:e.clearMarkers}}),e._v(" "),2===e.menu?a("Finds"):e._e(),e._v(" "),e.user?a("MyGems",{directives:[{name:"show",rawName:"v-show",value:3===e.menu,expression:"menu === 3"}],attrs:{user:e.user}}):e._e()],1)])],1):e._e(),e._v(" "),e.googleMaps?a("aside",{staticClass:"o-aside"},[a("Map",{attrs:{markers:e.globalMarkers,infoWindow:e.infoWindow},on:{emitMap:e.updateMap}})],1):e._e(),e._v(" "),a("InfoWindow",{ref:"infoW",attrs:{place:e.infoWindow.content,claimPlace:e.claimPlace}})],1)},staticRenderFns:[]},d=a("VU/8")(u.a,m,!1,null,null,null).exports;n.a.use(o.a);var g=new o.a({routes:[{path:"/",name:"Initial",component:d}]});a("MhFl"),a("H/op");n.a.use(i.a),n.a.config.productionTip=!1,new n.a({el:"#app",router:g,components:{App:l},template:"<App/>"})},dkK6:function(e,t,a){"use strict";var n={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"c-info-window"},[e.place?[a("div",{staticClass:"c-info-window__img-container",class:{"is-loading":e.loading}},[a("img",{directives:[{name:"show",rawName:"v-show",value:!e.loading,expression:"!loading"}],staticClass:"c-info-window__img",attrs:{src:e.place.image_url,alt:"place-photo"},on:{load:function(t){e.loading=!1}}})]),e._v(" "),a("b",{staticClass:"c-info-window__title"},[e._v(e._s(e.place.name))]),e._v(" "),a("div",{staticClass:"c-info-window__shares"},[e._v("\n      Shared by:\n      "),e._l(e.place.users,function(t,n){return e.place.users?a("div",{key:n},[e._v("\n        "+e._s(t.displayName)+"\n      ")]):e._e()})],2),e._v(" "),a("ul",{staticClass:"c-info-window__links"},[a("li",{staticClass:"c-info-window__link"},[a("a",{staticClass:"c-btn c-btn--naked",attrs:{href:e.place.url,target:"_blank"}},[e._v("\n          Link\n        ")])]),e._v(" "),a("li",{staticClass:"c-info-window__link"},[a("button",{staticClass:"c-btn c-btn--naked",on:{click:function(t){t.preventDefault(),e.claimPlace(e.place)}}},[e._v("\n          Save\n        ")])])])]:e._e()],2)},staticRenderFns:[]};var s=a("VU/8")({name:"InfoWindow",props:["place","claimPlace","itineraries"],data:function(){return{itinerary:null,loading:!0}},computed:{id:function(){if(this.place)return this.place.id}},watch:{itineraries:function(){this.itineraries.length&&(this.itinerary=this.itineraries[0][".key"])},id:function(){this.loading=!0}}},n,!1,function(e){a("s/fk")},"data-v-09eb6de8",null);t.a=s.exports},fViJ:function(e,t){e.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzEiIGhlaWdodD0iNDMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTUuNSA0Mi4yNTNsMTIuMDYzLTkuMjQ4YTcuNSA3LjUgMCAwIDAgMi45MzctNS45NTJWOEE3LjUgNy41IDAgMCAwIDIzIC41SDhBNy41IDcuNSAwIDAgMCAuNSA4djE5LjA1M2E3LjUgNy41IDAgMCAwIDIuOTM3IDUuOTUyTDE1LjUgNDIuMjUzeiIgc3Ryb2tlPSIjNkI2QjZCIiBmaWxsPSIjRkZGIi8+PHBhdGggZD0iTTE1LjUgMzMuODNsLS4zMzUtLjI4M0M3Ljk1NSAyNy41OTcgNiAyNS41IDYgMjIuMWMwLTIuODMzIDIuMjM1LTUuMSA1LjAzLTUuMSAyLjI5IDAgMy41NzYgMS4zMDMgNC40NyAyLjMyMy44OTQtMS4wMiAyLjE4LTIuMzIzIDQuNDctMi4zMjMgMi43OTUgMCA1LjAzIDIuMjY3IDUuMDMgNS4xIDAgMy40LTEuOTU2IDUuNDk3LTkuMTY1IDExLjQ0N2wtLjMzNS4yODN6IiBmaWxsPSIjRDdEN0Q3Ii8+PHBhdGggZD0iTTE1LjUgMzMuODNsLS4zMzUtLjI4M0M3Ljk1NSAyNy41OTcgNiAyNS41IDYgMjIuMWMwLTIuODMzIDIuMjM1LTUuMSA1LjAzLTUuMSAyLjI5IDAgMy41NzYgMS4zMDMgNC40NyAyLjMyMy44OTQtMS4wMiAyLjE4LTIuMzIzIDQuNDctMi4zMjMgMi43OTUgMCA1LjAzIDIuMjY3IDUuMDMgNS4xIDAgMy40LTEuOTU2IDUuNDk3LTkuMTY1IDExLjQ0N2wtLjMzNS4yODN6bS00LjQ3LTE1LjY5N2MtMi4xOCAwLTMuOTEyIDEuNzU3LTMuOTEyIDMuOTY3IDAgMi44OSAxLjc4OCA0LjgxNyA4LjM4MiAxMC4yNTcgNi41OTQtNS40NCA4LjM4Mi03LjM2NyA4LjM4Mi0xMC4yNTcgMC0yLjIxLTEuNzMyLTMuOTY3LTMuOTExLTMuOTY3LTEuOTU2IDAtMy4wMTggMS4xOS0zLjg1NiAyLjE1NGwtLjYxNS43MzYtLjYxNS0uNzM2Yy0uODM4LS45NjQtMS45LTIuMTU0LTMuODU2LTIuMTU0eiIgZmlsbD0iIzZCNkI2QiIgZmlsbC1ydWxlPSJub256ZXJvIi8+PC9nPjwvc3ZnPgo="},fgbI:function(e,t,a){"use strict";(function(e){var n=a("fZjL"),s=a.n(n),i=a("Gu7T"),c=a.n(i),r=a("Xxa5"),l=a.n(r),o=a("exGp"),u=a.n(o),m=a("bOdI"),d=a.n(m),g=a("MhFl"),p=(a("jyVo"),a("mtWM")),v=a.n(p),f=a("zmjZ"),h=a("tEWQ"),M=a("EwB7"),_=a("fViJ"),y=a.n(_),I=a("KKye"),w=a.n(I);t.a={name:"FindPlaces",props:["infoWindow","radius","map","claimPlace","user"],data:function(){var e;return e={page:0,places:[],markers:[],selected:[],searching:!1},d()(e,"places",null),d()(e,"sortBy","best_match"),e},methods:{getPlaces:function(){var e=this;return u()(l.a.mark(function t(){return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.searching=!0,0===e.page&&(e.places=[]),t.next=4,e.buildList();case 4:return t.next=6,e.placeYelpMarkers(e.places);case 6:e.places.length>=25&&(e.page+=1),e.searching=!1;case 8:case"end":return t.stop()}},t,e)}))()},search:function(){var e=this;return u()(l.a.mark(function t(){return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return e.page=0,t.next=3,e.getPlaces();case 3:case"end":return t.stop()}},t,e)}))()},buildList:function(){var e=this;return u()(l.a.mark(function t(){var a,n,s,i,r;return l.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:if(null,!(e.selected.length>0)){t.next=13;break}a=0;case 3:if(!(a<e.selected.length)){t.next=11;break}return t.next=6,e.getYelpPlaces(e.selected[a],e.radius,e.sortBy);case 6:s=t.sent,(n=e.places).push.apply(n,c()(s));case 8:a++,t.next=3;break;case 11:t.next=17;break;case 13:return t.next=15,e.getYelpPlaces(null,e.radius,e.sortBy);case 15:r=t.sent,(i=e.places).push.apply(i,c()(r));case 17:case"end":return t.stop()}},t,e)}))()},getYelpPlaces:function(e,t,a){var n=this;return u()(l.a.mark(function s(){var i,c,r,o;return l.a.wrap(function(s){for(;;)switch(s.prev=s.next){case 0:return s.next=2,n.map.center.lat();case 2:return i=s.sent,s.next=5,n.map.center.lng();case 5:return c=s.sent,s.prev=6,s.next=9,v.a.get("/api",{params:{lat:i,lng:c,offset:25*n.page,term:e,radius:t,sortBy:a}});case 9:return r=s.sent,o=r.data,s.abrupt("return",o);case 14:s.prev=14,s.t0=s.catch(6),console.log(s.t0);case 17:case"end":return s.stop()}},s,n,[[6,14]])}))()},getUsers:function(e,t){var a=this;g.a.ref("gems").orderByChild("place/id").equalTo(t).on("value",function(t){if(t.val())for(var n in t.val()){var s=t.val()[n];a.$set(e,"users",s.users)}})},placeYelpMarkers:function(t){var n=this;return u()(l.a.mark(function i(){var c,r,o;return l.a.wrap(function(i){for(;;)switch(i.prev=i.next){case 0:n.markers=[],n.$emit("clearMarkers"),c=n,r=l.a.mark(function i(r){var o,u;return l.a.wrap(function(i){for(;;)switch(i.prev=i.next){case 0:return i.next=2,n.getUsers(t[r],t[r].id);case 2:o=t[r].users?String(s()(t[r].users).length):String(0),u=t[r].users?w.a:y.a,e.load(function(e){var n=a("Xe03")(e.maps);c.markers[r]=new n({position:{lat:t[r].coordinates.latitude,lng:t[r].coordinates.longitude},labelContent:o,icon:u,map:c.map,labelAnchor:new e.maps.Point(15.5,42),labelClass:"marker-label"})}),c.markers[r].place=t[r],google.maps.event.addListener(c.markers[r],"click",function(){c.infoWindow.el.open(c.map,this),c.infoWindow.content=t[r]});case 7:case"end":return i.stop()}},i,n)}),o=0;case 5:if(!(o<t.length)){i.next=10;break}return i.delegateYield(r(o),"t0",7);case 7:o++,i.next=5;break;case 10:case"end":return i.stop()}},i,n)}))()},getActivities:function(e){this.selected=e}},watch:{selected:function(){this.page=0},markers:function(){this.$emit("emitMarkers",this.markers)}},components:{Accordion:h.a,ActivitySelect:f.a,Places:M.a}}}).call(t,a("lMsw"))},jFfm:function(e,t,a){"use strict";var n={name:"LocationSearch",props:["map","places"],data:function(){return{invalidPlace:!1}},mounted:function(){this.initLocationSearch()},methods:{initLocationSearch:function(){var e=this,t=this.$refs.loc,a=new google.maps.places.Autocomplete(t);a.addListener("place_changed",function(){var t=a.getPlace();if(t.geometry){t.types.includes("establishment")&&console.log(t),e.invalidPlace=!1;var n=new google.maps.LatLng(t.geometry.location.lat(),t.geometry.location.lng());e.map.panTo(n)}else e.invalidPlace=!0})}}},s={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",[t("label",{staticClass:"c-label"},[this._v("Location search")]),this._v(" "),t("span",{directives:[{name:"show",rawName:"v-show",value:this.invalidPlace,expression:"invalidPlace"}]},[this._v("Click to search")]),this._v(" "),t("input",{ref:"loc",staticClass:"c-text-input",attrs:{placeholder:"Search Location"}})])},staticRenderFns:[]},i=a("VU/8")(n,s,!1,null,null,null);t.a=i.exports},jyJz:function(e,t,a){"use strict";var n=a("It2I"),s=a.n(n),i={name:"User",props:["user"],data:function(){return{message:""}},methods:{userSettings:function(){},signIn:function(){var e=new s.a.auth.TwitterAuthProvider;s.a.auth().signInWithRedirect(e)},signOut:function(){s.a.auth().signOut().then(function(){console.log("signed out")}).catch(function(e){console.log(e)})},showUserMenu:function(){this.$emit("showUserMenu")}}},c={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"c-user"},[e.user?[a("button",{staticClass:"c-user__details c-user__details--signed-in",on:{click:function(t){return t.preventDefault(),e.showUserMenu(t)}}},[a("div",{staticClass:"c-user__icon",style:{"background-image":"url("+e.user.photoURL+")"}}),e._v(" "),a("h2",{staticClass:"c-user__name"},[e._v("\n        "+e._s(e.user.displayName)+"\n      ")])]),e._v(" "),a("button",{staticClass:"c-btn c-btn--naked",on:{click:function(t){return t.preventDefault(),e.signOut(t)}}},[e._v("\n      Sign out\n    ")])]:[e._m(0),e._v(" "),a("button",{staticClass:"c-btn c-btn--naked",on:{click:function(t){return t.preventDefault(),e.signIn(t)}}},[e._v("\n      Sign in\n    ")])]],2)},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"c-user__details"},[t("h2",{staticClass:"c-user__name"},[this._v("\n        Guest\n      ")]),this._v(" "),t("span",[this._v("Sign in to claim places")])])}]},r=a("VU/8")(i,c,!1,null,null,null);t.a=r.exports},jyVo:function(e,t,a){"use strict";var n={calcPrimeLocation:function(e){if(!(e.length>0))return!1;for(var t=e.length,a=0,n=0,s=0,i=0;i<e.length;i++){var c=e[i][0]*Math.PI/180,r=e[i][1]*Math.PI/180;a+=Math.cos(c)*Math.cos(r),n+=Math.cos(c)*Math.sin(r),s+=Math.sin(c)}a/=t,n/=t,s/=t;r=Math.atan2(n,a);var l=Math.sqrt(a*a+n*n),o=180*(c=Math.atan2(s,l))/Math.PI,u=180*r/Math.PI;return new Array(o,u)},pinSymbol:function(e){return{url:"M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z",fillColor:e,fillOpacity:1,scale:1}}};t.a=n},"s/fk":function(e,t){},tEWQ:function(e,t,a){"use strict";var n={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"c-accordion"},[a("button",{staticClass:"c-accordion__btn",class:{"is-active":e.isOpen},on:{click:function(t){t.preventDefault(),e.isOpen=!e.isOpen}}},[e._v("\n    "+e._s(e.label)+"\n  ")]),e._v(" "),a("transition",{attrs:{name:"slide"}},[a("div",{directives:[{name:"show",rawName:"v-show",value:e.isOpen,expression:"isOpen"}],staticClass:"c-accordion__drawer",class:{"is-active":e.isOpen}},[e._t("default")],2)])],1)},staticRenderFns:[]},s=a("VU/8")({name:"Accordion",props:["label"],data:function(){return{isOpen:!1}},methods:{}},n,!1,null,null,null);t.a=s.exports},tWeu:function(e,t,a){"use strict";(function(e){var n=a("BO1k"),s=a.n(n),i=a("bOdI"),c=a.n(i),r=a("//Fk"),l=a.n(r),o=a("Xxa5"),u=a.n(o),m=a("exGp"),d=a.n(m),g=a("Sazm"),p=a.n(g),v=a("3GDu"),f=a("jFfm"),h=a("COvG"),M=a("BXaq"),_=a("yi+d"),y=a("dkK6"),I=a("jyJz"),w=a("MhFl");t.a={name:"Initial",props:["googleMaps"],data:function(){return{itinerary:null,user:null,menu:0,infoWindow:{el:null,content:null},globalMap:null,selectedActiv:[],globalMarkers:[],showPlaces:!1}},created:function(){var t=this;return d()(u.a.mark(function a(){return u.a.wrap(function(a){for(;;)switch(a.prev=a.next){case 0:t,p.a.auth().onAuthStateChanged(function(e){return t.user=e}),e.load(function(e){t.infoWindow.el=new e.maps.InfoWindow({content:t.$refs.infoW.$el})});case 3:case"end":return a.stop()}},a,t)}))()},methods:{updateMap:function(e){this.globalMap=e},updateMarkers:function(e){this.globalMarkers=e},clearMarkers:function(){var e=this;return d()(u.a.mark(function t(){var a;return u.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return a=e,t.abrupt("return",new l.a(function(e,t){for(var n=0;n<a.globalMarkers.length;n++)a.globalMarkers[n].setMap(null);a.globalMarkers=[],e()}));case 2:case"end":return t.stop()}},t,e)}))()},claimPlace:function(e){var t={};if(e.place){var a=null,n=null,i=!0,r=!1,l=void 0;try{for(var o,u=s()(e.place.address_components);!(i=(o=u.next()).done);i=!0){var m=o.value;m.types.includes("postal_town")?a=m.short_name:m.types.includes("country")&&(n=m.short_name)}}catch(e){r=!0,l=e}finally{try{!i&&u.return&&u.return()}finally{if(r)throw l}}t={place:{users:c()({},this.user.uid,{id:this.user.uid,displayName:this.user.displayName,photoURL:this.user.photoURL}),id:e.place.id,name:e.place.name,city:a,country:n,pos:{lat:e.place.geometry.location.lat(),lng:e.place.geometry.location.lng()},image_url:void 0!==e.place.photos?e.place.photos[0].getUrl({maxWidth:100,maxHeight:100}):"",link:e.url}}}else t={users:c()({},this.user.uid,{id:this.user.uid,displayName:this.user.displayName,photoURL:this.user.photoURL}),place:{id:e.id,name:e.name,city:e.location.city,country:e.location.country,pos:{lat:e.coordinates.latitude,lng:e.coordinates.longitude},image_url:e.image_url,link:e.url}};w.a.ref("gems").push(t)},getPlaces:function(e){this.itineraryList=e,this.showPlaces=!0},getItineraries:function(){this.showPlaces=!1},panMap:function(e){for(var t=new e.maps.LatLngBounds,a=0;a<this.globalMarkers.length;a++)t.extend(this.globalMarkers[a].getPosition());this.globalMap.fitBounds(t)}},computed:{radius:function(){var e=void 0,t=this.globalMap.getBounds(),a=this.globalMap.getCenter();if(t&&a){var n=t.getNorthEast();e=this.googleMaps.geometry.spherical.computeDistanceBetween(a,n)}return Math.floor(e)}},components:{LocationSearch:f.a,FindPlaces:h.a,Map:v.a,MyGems:M.a,Finds:_.a,InfoWindow:y.a,User:I.a}}}).call(t,a("lMsw"))},xJD8:function(e,t,a){"use strict";(function(e){var n=a("IxXz");e.KEY=n.keys.GOOGLEMAPS,e.LIBRARIES=["places","geometry"],t.a={name:"App",data:function(){return{googleMaps:null}},created:function(){var t=this;e.load(function(e){t.googleMaps=e.maps})}}}).call(t,a("lMsw"))},yOnu:function(e,t){},"yi+d":function(e,t,a){"use strict";var n=a("fZjL"),s=a.n(n),i=a("Xxa5"),c=a.n(i),r=a("exGp"),l=a.n(r),o=a("MhFl"),u={name:"Finds",props:[],data:function(){return{loading:!1,gems:[],deleting:null,loadingImgs:{}}},mounted:function(){var e=this;return l()(c.a.mark(function t(){return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getGems();case 2:case"end":return t.stop()}},t,e)}))()},methods:{getGems:function(){var e=this;return l()(c.a.mark(function t(){return c.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:e.loading=!0,e.$bindAsArray("gems",o.a.ref("gems"),null,function(){return e.loading=!1});case 2:case"end":return t.stop()}},t,e)}))()},imageLoaded:function(e){this.$set(this.loadingImgs,e,!1)}},watch:{gems:function(e){var t=this,a=s()(this.loadingImgs);e.map(function(e){a.includes(e.place.id)||t.$set(t.loadingImgs,e.place.id,!0)})}}},m={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"c-my-gems"},[e._m(0),e._v(" "),e.loading?a("div",{staticClass:"spinner"}):a("ul",{staticClass:"c-my-gems__list"},e._l(e.gems,function(t,n){return a("li",{key:n,staticClass:"c-my-gem"},[a("div",{staticClass:"c-my-gem__cont"},[a("div",{staticClass:"c-my-gem__img-container",class:{"is-loading":e.loadingImgs[t.place.id]}},[a("img",{directives:[{name:"show",rawName:"v-show",value:!e.loadingImgs[t.place.id],expression:"!loadingImgs[g.place.id]"}],staticClass:"c-my-gem__img",attrs:{src:t.place.image_url,alt:"place-photo"},on:{load:function(a){e.imageLoaded(t.place.id)}}})]),e._v(" "),a("div",{staticClass:"c-my-gem__details"},[a("div",{staticClass:"c-my-gem__name"},[e._v(e._s(t.place.name))]),e._v(" "),a("div",{staticClass:"c-my-gem__loc"},[e._v(e._s(t.place.city)+", "+e._s(t.place.country))]),e._v(" "),a("div",[e._v("Shared by:")]),e._v(" "),e._l(t.users,function(n,s){return t.users?a("div",{key:s},[e._v("\n            "+e._s(n.displayName)+"\n          ")]):e._e()})],2),e._v(" "),a("ul",{staticClass:"c-my-gem__btns"},[a("li",{staticClass:"c-my-gem__btn"},[a("a",{staticClass:"c-btn c-btn--naked",attrs:{href:t.place.link,target:"_blank"}},[e._v("\n              Link\n            ")])])])])])}))])},staticRenderFns:[function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"c-my-gems__title"},[t("p",[this._v("Popular places being shared")])])}]},d=a("VU/8")(u,m,!1,null,null,null);t.a=d.exports},zmjZ:function(e,t,a){"use strict";var n=a("RUzx"),s=a.n(n),i=a("H+ap"),c=a.n(i),r={name:"ActivitySelect",props:["getActivities"],components:{Multiselect:s.a},data:function(){return{value:null,options:c.a.activities}},watch:{value:function(e){var t=e.map(function(e){return e.name});this.$emit("getActivities",t)}}},l={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("label",{staticClass:"c-label"},[e._v("Activities")]),e._v(" "),a("multiselect",{staticClass:"c-multiselect-custom",attrs:{options:e.options,multiple:!0,"close-on-select":!0,"clear-on-select":!0,"hide-selected":!1,"preserve-search":!0,placeholder:"Pick some",label:"name","track-by":"name","preselect-first":!1,limit:3,showLabels:!0},scopedSlots:e._u([{key:"tag",fn:function(t){return a("div",{staticClass:"c-multiselect-custom__tag"},[a("span",{staticClass:"c-multiselect-custom__tag-name"},[e._v("\n        "+e._s(t.option.name)+"\n      ")]),e._v(" "),a("span",{staticClass:"c-multiselect-custom__tag-remove",on:{click:function(e){t.remove(t.option)}}},[e._v("\n        ✕\n      ")])])}}]),model:{value:e.value,callback:function(t){e.value=t},expression:"value"}})],1)},staticRenderFns:[]};var o=a("VU/8")(r,l,!1,function(e){a("yOnu")},null,null);t.a=o.exports}},["NHnr"]);
//# sourceMappingURL=app.dffc83eb51c381dc81b4.js.map