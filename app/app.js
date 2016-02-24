(function(){
	'use strict';

	angular
		.module("spotifyplayer", ["ngResource"])
		.directive("spotifyPlayer", spotifyPlayer)	//directiva para spotify
		.directive("youtubePlayer", youtubePlayer)	//directiva para youtube
		.factory("spotifySearch", spotifySearch);

	spotifySearch.$inject = ["$resource"];
	function spotifySearch($resource){
		return $resource("https://api.spotify.com/v1/search?type=track&q=:song&market=MX");
	}

	youtubePlayer.$inject=[];
	function youtubePlayer(){
		var directive = {
			restrict: 'EA',
			templateUrl: '/partials/youtube.html',
			scope: {
				id: "=",
			},
			controller: youtubeController,
			controllerAs: 'youtube',
			bindToController: true,
			replace: true
		};
		return directive;
	}

	youtubeController.$inject=["$sce"];
	function youtubeController($sce){
		var youtube=this;
		//$sce="-FRgkJWR2W8";
		youtube.base="https://www.youtube.com/embed/";
		//youtube.play=play;

		console.log(youtube.base);
		console.log(youtube.id);

		youtube.video = $sce.trustAsResourceUrl(youtube.base+youtube.id);
	}

	spotifyPlayer.$inject=[];
	function spotifyPlayer(){
		var directive = {
			restrict: 'EA',
			templateUrl: '/partials/spotify.html',
			controller: spotifyController,
			controllerAs: 'spotify',
			bindToController: true,
			replace: true
		};
		return directive;
	}

	spotifyController.$inject = ["spotifySearch"];
	function spotifyController(spotifySearch){
		var spotify = this;
		spotify.audio = new Audio;
		spotify.playlist = null;
		spotify.doSearch = doSearch;
		spotify.play = play;
		spotify.song=null;

		function play(song){
			spotify.song=song;
			spotify.audio.pause();
			spotify.audio.src=song.preview_url;
			spotify.audio.play();
		}

		function doSearch(){
			console.log(spotify.song_name);
			spotifySearch.get({'song': spotify.song_name});
			spotifySearch.get({'song': spotify.song_name})
				.$promise
					.then(
						function(response){
							console.log(response);
							spotify.playlist=response.tracks.items;
							spotify.play(response.tracks.items[0]);
						}
						);
		}
	}

})();