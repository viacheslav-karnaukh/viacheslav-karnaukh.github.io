(function() {
	'use strict';
	function getWords(text) {
		return text.match(/\b[\w-']+\b/g);
	}

	function isSimilar(s1,s2) {
		var result = false;
		var bigger = s1.length > s2.length ? s1 : s2;
		var smaller = bigger === s1 ? s2 : s1;

		if(s1 !== s2 && s1.length === s2.length) {
			result = s1.split('').filter(function(char,i) {
				return char !== s2[i];
			}).length === 1;
		} else if(bigger.length - smaller.length === 1) {
			result = bigger.split('').reduce(function(diffs, char, i) {
				if(diffs === 1) i--;
				return char !== smaller[i] ? ++diffs : diffs;
			}, 0) === 1;
		}
		return result;
	}

	function createSimilaritiesDictionary(words) {
		var seen = {};
		var seenSimilar = {};
		var similaritiesDictionary = {};

		if(words) {
			for(var i = 0, wordsQty = words.length; i < wordsQty; i++) {

				if(seen[words[i]] || seenSimilar[words[i]]) continue;

				var currentWordDict = {};
				var currentSimilarities = currentWordDict.similarities = [];
				
				currentWordDict.qty = 1;
				seen[words[i]] = true;
					
				for(var j = i + 1; j < wordsQty; j++) {
					if(words[i] === words[j]) {
						currentWordDict.qty++;
					} else if(!seenSimilar[words[j]] && isSimilar(words[i], words[j])) {
						similaritiesDictionary[words[i]] = currentWordDict;
						similaritiesDictionary[words[i]].similarities = currentSimilarities;
						seenSimilar[words[j]] = true;
						currentSimilarities.push(words[j]);
					}
				}
			}
		}
		
		return similaritiesDictionary;
	}

	function render(input, output) {
		var similaritiesDictionary = createSimilaritiesDictionary(getWords(input.value));
		output.innerHTML = '';
		Object.keys(similaritiesDictionary).forEach(function(foundWord) {
			var li = document.createElement('li');
			var spanWord = document.createElement('span');
			var spanSimilarity = document.createElement('span');
			spanWord.className = 'list-word';
			spanSimilarity.className = 'list-similarities';
			spanWord.textContent = foundWord + ' (' + similaritiesDictionary[foundWord].qty + ')';
			spanSimilarity.textContent = '(' + similaritiesDictionary[foundWord].similarities.join(', ') + ')';
			li.appendChild(spanWord);
			li.appendChild(spanSimilarity);
			output.appendChild(li);
		});
	}

	var startSearch = document.querySelector('.start-search');
	startSearch.addEventListener('click', function(e) {
		e.preventDefault();
		render(document.querySelector('.input-text'), document.querySelector('.output-block'));
	});

})();