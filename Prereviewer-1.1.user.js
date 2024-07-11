// ==UserScript==
// @name         Prereviewer
// @namespace    https://verylegitgirl.github.io
// @version      1.1
// @description  If you don't know how to use it, check out the example. (key is shift)
// @author       NekoMaya
// @match        https://undercards.net/Translate
// ==/UserScript==

(function() {
    'use strict';

    function findAndLogCardNumbers() {
        var tdElements = document.querySelectorAll('td');
        var cardNumbers = new Set();

        tdElements.forEach(function(td) {
            var match = td.textContent.match(/card-(\d+)/);
            if (match) {
                cardNumbers.add(match[1]);
            }
        });

        var numbersArray = Array.from(cardNumbers);
        return 'Card Numbers found: ' + numbersArray.join(', ');
    }

    function findAndLogPreviewData() {
        var previewElement = document.getElementById('preview');
        if (previewElement) {
            var previewText = previewElement.innerHTML.replace(/^[^:]*:\s*/, '');
            previewText = previewText.replace(/'/g, "\\'");
            return previewText;
        } else {
            return 'No preview element found.';
        }
    }

function executeCommands() {
    var $htmlCard = $('<div class="card" id="card1">' +
                        '<div class="cardDesc">' +
                            '<div></div>' +
                        '</div>' +
                    '</div>');

    var $cardDescDiv = $htmlCard.find('.cardDesc div');

    $cardDescDiv.html(findAndLogPreviewData());


    var size = getResizedFontSize($cardDescDiv, 81);

    return size;
}

   function modifyCardDesc(fontSize) {
        var cardDescElement = document.querySelector('.cardDesc');
        if (cardDescElement) {
            var previewData = findAndLogPreviewData();
            var htmlContent = '<div style="font-size: '+ executeCommands() +'px;">' + previewData + '</div>';
            cardDescElement.innerHTML = htmlContent;
        } else {
            console.log('.cardDesc element not found.');
        }
    }

    function handleKeyDown(event) {
        if (event.shiftKey) {
            modifyCardDesc("12");
        }
    }

    document.addEventListener('keydown', handleKeyDown);

})();
