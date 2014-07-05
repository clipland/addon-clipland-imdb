// ==UserScript==
// @name           IMDb + Clipland
// @namespace      http://www.clipland.com/imdbplus
// @description    IMDb + Clipland enhances IMDb with data from Clipland
// @version        2.0
// @author         Clipland
// @homepage       http://www.clipland.com/imdbplus
// @copyright      2009-2014, Clipland GmbH (http://www.clipland.com/)
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABGwAAARsBjfdO5QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAAPdEVYdFRpdGxlAElNRGIgTG9nb3OZnAIAAAPASURBVFiF7ZdNaFxVFMd/580MaSZJpzUdixaqKVXaummaNAuVlmJABcWCzcRWqIu66UoQodOgDESKKajgwuzaElyoU1oLLiy4KFTxgyZLjRQJ1ARKbT5mJl+TmXvvcfHmzbzUlNqEpC564MF977xz/v/7f+ed856oKu2p9NPAh0AS8Fhdc8AM0DeY7ftJ2rpO7AL6gbcGs303VhkcgPZUuhk4A/R7+DtfM3CAwWzfBPAm0OMBibUED5GYBSY9wKw1eMgKq11w97SHBKJbk/Pbx4cPKAqqigL+2j+oXPPX+H5RUL7Y0nr16IoJNNSVN8/OGNQtBgnAXUAEBQfOKYrQ0BTpunHt+UvjXvHbtrbB8rIJRDyNNCaSqCrOzuPsfAXQQyIbQBVbnsa5clWZQt4wnSuvq2+MXtho4hmg987Ee7rT+0Sl18/kTl3Lnv5+SQLgceDQn4yOjhKPx0kk1nOk61neTs2x+4UrFItFLp9/nccS11GFXMEQjYAngjUOwVuyjsTpJhH2V07P3E0BD6BQKJDL5di18ymGh//gg96zjN1+glwuRz6fZ3hkI2cvtTByczvFoqO4oKgDZxVj3P1p/m8FanbkUCtXf/iZUqnE+JRWr2dOfc3o6BjbtrXw3bmtOFfGGkWtP1lWREBrOCiKiABQDpVVz3spjr/zKZOTUyA7sXYKdYpV0Mr9Hd0nO63yfhAjIptqeaWnLXXyWAj3s6HsR9/4BKgx0NB2XGgdi/ogqop1gjX+qyKAVjRwqo8K1Wd+p+0QdEdopxeqCrBIgdA6JE1YJWf8Zy8iPnQ4aBm2qIKNibGwsOAzi9QyW+uvPc/DWIs1fj9wDkxllA09U/9VU0N9fXCIcjiIF5FjYd82GekPfFFUqkDvpj8PAmhO1AgMfPkjAM3NzZTm8qgq4kmFhH+fZjIOKAYxbV0nSkIlt7rylXOZqi9sUVBee2UfExM5EIivi9Gx+xHi/M4bXS9TNoa9rS1seTzJq51JrPkNVYjFBGfB2f+o9V0s6lT16IvXa31fQXWM4iwcPxic36LjSVD9G2uVpg1RrPF7gKrmV0hASo3rI/HFw0h84Erv1WAIqV/3pqzMzdhZcJ3PdQ/9slTiofOnLwKylG8RgamZ2M3ClLlVBQmGTjCYKqWgqtXXVBWc6MX9h5cGvy8Fbk/X/7X34K8vrTTRcu2Bf5A8JPC/IBB5gPiNHjDXnkpvXmvk9lS6Dkh6QAYYaE+lk2sI3gAMAB9L5fd8D/6HZR2wwu5+T/PwO+Qng9m+y/8AUe3gleGP9ZAAAAAASUVORK5CYII=
// @license        GNU GPL License
// @grant          GM_addStyle
// @include        http://www.imdb.com/title/*
// @include        http://www.imdb.com/name/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// ==/UserScript==

var version = 2.0;

/*
 * Greasemonkey: setting @grant to something other than 'none' reactivates the
 * sandbox and avoids mixing up with site's jquery
 */

/* LICENSE:
 * This file is a part of IMDb + Clipland, which has been placed under
 * the GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
 *
 * Copyright (c) 2009-2014, Clipland GmbH, clipland.com
 * This add-on is not affiliated with or endorsed by IMDb or Amazon
 *
 * For brevity, the full license is omitted here but can be obtained at:
 * http://www.gnu.org/licenses/gpl.txt
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 */

/*
 * DESCRIPTION
 * The Internet Movie Database is an invaluable resource for information about
 * feature films, while on the other hand, it is not as complete when it comes
 * to short films and other short form media. This, in turn, is where Clipland's
 * expertise lies. So it's a no-brainer to combine the two:
 * With this script, visits to the IMDb get enhanced with data from Clipland, so
 * you finally get the complete picture when you're there.
 */

'use strict';

var urlPath	= location.href.split("imdb.com/")[1];
    urlPath	= urlPath.split(/\?|#/)[0];
var urlElems	= urlPath.split("/");

var mode;
var imdbName	= document.title.split(" - ", 2)[0];
var imdbType	= urlElems[0];
var imdbId	= urlElems[1];
var subUrl	= urlElems[2];


if(urlElems[0] == 'name' && urlElems[2] == ''){
	mode = 'name';
	console.log('name');

	var url = "http://www.clipland.com/json/api?method=name.lookup&imdbId="+ imdbId +"&imdbName="+ encodeURIComponent(imdbName);
	jsonRequest(url);
}else if(urlElems[0] == 'name' && urlElems[2] == 'externalsites'){
	mode = 'externalsites';
	console.log('name-'+mode);

	if( $("#external_sites_content")[0].innerHTML.match(/clipland/) ){
		console.log('clipland already listed as external site');
	}else{
		console.log('add clipland as external site');

		var url = "http://www.clipland.com/json/api?method=name.lookup&imdbId="+ imdbId +"&imdbName="+ encodeURIComponent(imdbName);
		jsonRequest(url);
	}
}else if(urlElems[0] == 'name' && urlElems[2] == 'otherworks'){
	mode = 'otherworks';
	console.log('name-'+mode);

	var url = "http://www.clipland.com/json/api?method=name.lookup&imdbName="+ encodeURIComponent(imdbName) +"&imdbId="+ imdbId;
	var test = jsonRequest(url);

//	var clip_wrap = document.createElement('div');
//	clip_wrap.setAttribute("id", "clipland");
//	clip_wrap.setAttribute("style", "position: absolute !important; right: 0; top: 4px; width: 107px; height: 32px;");

}else if(urlElems[0] == 'title' && (urlElems[2] == '' || urlElems[2] == 'maindetails') ){
	console.log('title');

}else if(urlElems[0] == 'title' && urlElems[2] == 'fullcredits'){
	mode = 'fullcredits';
	console.log('title-'+mode);
}else if(urlElems[0] == 'title' && urlElems[2] == 'combined'){
	mode = 'combined';
	console.log('title-'+mode);
}else{
	console.log('else');
}



// add_indicator() adds an icon to the head of name and title pages; in case where
// the add-on has something to contribute, the indicator will be blue, in all other
// cases it's greyed-out
var img_active = document.createElement('img');
img_active.setAttribute("width", "26");
img_active.setAttribute("height", "26");
img_active.setAttribute("src", "data:image/jpeg;base64,%2F9j%2F4AAQSkZJRgABAQEABQAFAAD%2F2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL%2F2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL%2FwgARCAAaABoDASEAAhEBAxEB%2F8QAGQAAAgMBAAAAAAAAAAAAAAAAAwQAAgUB%2F8QAFwEBAQEBAAAAAAAAAAAAAAAAAQIDBP%2FaAAwDAQACEAMQAAABynOjBQydJFrSpG4Kl0sNmaI%2F%2F8QAHxABAQABAwUBAAAAAAAAAAAAAgEDBBEUABASIkE0%2F9oACAEBAAEFArbVNLmsZYUb2wfp1TfIy3Kl83pfL6eRZV8c9%2BxM8f%2FEABoRAQACAwEAAAAAAAAAAAAAAAEAAhARITH%2F2gAIAQMBAT8BBcHKx9lXUXbgn%2F%2FEABoRAQEAAwEBAAAAAAAAAAAAAAEAAhExECH%2F2gAIAQIBAT8BULs%2Fco5ZY7g0eN%2F%2FxAAjEAACAQMBCQAAAAAAAAAAAAAAARECECFBAyIjMTJRcYGx%2F9oACAEBAAY%2FAnlnb2RUdTEKKmklocX5aVzN7ZSyXhaK1Xm6wj%2F%2FxAAbEAEAAgMBAQAAAAAAAAAAAAABABEhMVFhcf%2FaAAgBAQABPyHNQrLBZ4YyKH7BDn2EbOsph4QW2DHCtVSGkzFQcRDTS6RJX%2BjEDSEYjaUclHJ4Q5P%2F2gAMAwEAAgADAAAAEOjIgt%2F%2FxAAZEQEBAQEBAQAAAAAAAAAAAAABACEREDH%2F2gAIAQMBAT8Q%2BLaPJ9Emuo8NsT4%2F%2F8QAGREBAQEBAQEAAAAAAAAAAAAAAQARITFR%2F9oACAECAQE%2FEDe3BsQB%2BRABNhLII8lf%2F8QAHhABAAIBBQEBAAAAAAAAAAAAAQARQSFRYZGhMYH%2F2gAIAQEAAT8Q1cNyqtwm7Rdq%2FIir%2BuxNyGYAAAc0J0KDlBqFXSIBF1TPwIUBQhod57nkJYWjV%2BxJb6WdXqSk8tFujdcs8hAoIKAOZxOpxOoh26uG0%2F%2FZ");

var img_inactive = document.createElement('img');
img_inactive.setAttribute("width", "26");
img_inactive.setAttribute("height", "26");
img_inactive.setAttribute("src", "data:image/jpeg;base64,%2F9j%2F4AAQSkZJRgABAQEABQAFAAD%2F2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL%2F2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL%2FwgARCAAaABoDASEAAhEBAxEB%2F8QAGQAAAwEBAQAAAAAAAAAAAAAAAAQFAwIG%2F8QAFAEBAAAAAAAAAAAAAAAAAAAAAP%2FaAAwDAQACEAMQAAAB9msbaC0sbpGcMcqAB0f%2FxAAcEAACAgIDAAAAAAAAAAAAAAACAwABBBESEyD%2F2gAIAQEAAQUClvCoJUVR16UtXaWOGihDyElOG8ZRjfn%2FxAAUEQEAAAAAAAAAAAAAAAAAAAAw%2F9oACAEDAQE%2FAQ%2F%2FxAAUEQEAAAAAAAAAAAAAAAAAAAAw%2F9oACAECAQE%2FAQ%2F%2FxAAeEAEAAgIBBQAAAAAAAAAAAAABAAIQEWESEyAhcf%2FaAAgBAQAGPwLGzDFbIEXudXGEiFd%2FGNr%2BuPL%2FxAAcEAEAAgIDAQAAAAAAAAAAAAABABExQRAgIXH%2F2gAIAQEAAT8hWIVa%2FJam5bGowjofKZRQDoY4JncTEHeSZ8ngeHPT%2F9oADAMBAAIAAwAAABBEiEiE%2F8QAFBEBAAAAAAAAAAAAAAAAAAAAMP%2FaAAgBAwEBPxAP%2F8QAFBEBAAAAAAAAAAAAAAAAAAAAMP%2FaAAgBAgEBPxAP%2F8QAHRABAAICAwEBAAAAAAAAAAAAAQARIUExUWEQcf%2FaAAgBAQABPxCi1aDKrEOC2MTHi32Qo5YybUL5cEBKlRe17jAvUUKauanEeavqYEPYQPSUuo2F0dvs1Bl%2B%2FQKME%2F%2FZ");

function add_indicator(state,mode,ref){
	console.log('add_indicator:'+state);

	var clip_div = document.createElement('div');
	clip_div.setAttribute("id", "clipland");
	clip_div.setAttribute("style", 'position: absolute !important; right: -7px; top: 40px; background: url("http://ia.media-imdb.com/images/G/01/imdb/images/pro_meter_badge/starmeter_wrap_gradient-996803324._V_.png") repeat-y scroll right top #fff; border: 1px solid #e8e8e8; border-radius: 3px; box-shadow: -1px 2px 5px #c7c7c7; margin: 0; max-height: 88px; max-width: 205px; overflow: hidden; padding: 2px 10px 2px 1px; white-space: nowrap; z-index: 4; width: 26px; height: 26px;');

	var link = document.createElement('a');
	if(state == 'active'){
		if(mode == 'name'){
			link.setAttribute("href", "http://www.clipland.com/Name/"+ ref.name.id +"/");
			link.appendChild( img_active );
			clip_div.appendChild( link );
		}
	}else{
		clip_div.appendChild( img_inactive );
	}

	var clip_wrap = document.createElement('div');
	clip_wrap.setAttribute("id", "clipland_container");
	clip_wrap.setAttribute("style", "float: right;");
	clip_wrap.appendChild( clip_div );

	$("#prometer_container").after(clip_wrap);
}


//handler() is called by jsonRequest after successful responses
function handler(ref){
	console.log('handler: mode:'+mode);

	if(mode == 'name'){
		if(ref && ref.name && ref.name.id){
			add_indicator('active','name',ref);
		}else{
			add_indicator('inactive','name',ref);
		}
	}else if(mode == 'externalsites'){
		if(ref && ref.name && ref.name.id){
			var link = document.createElement('a');
			link.setAttribute("href", "http://www.clipland.com/Name/"+ ref.name.id +"/");
			link.appendChild( document.createTextNode(imdbName +" on Clipland") );
			var li = document.createElement('li');
			li.appendChild( link );

			$( $("#external_sites_content .simpleList")[0] ).prepend( li );
		}
	}
}

function jsonRequest(url){
	console.log('jsonRequest:'+url);

	GM_xmlhttpRequest({
		method: 'GET',
		url: url,
		headers: {
			'User-agent': 'Mozilla/5.0 (compatible) imdb+clipland/'+version,
			'Accept': 'application/json',
		},
		onload: function (responseDetails){
			var json = responseDetails.responseText;

			if(json == ''){
				return;
			}

			var ref = JSON.parse(json);
			console.log(ref);

			if(ref.error){
				return;
			}
			handler(ref);
		},
		onerror: function() {
			console.log('request error');
		},
		ontimeout: function() {
			console.log('request timeout');
		}
	});
}