// ==UserScript==
// @name         UC outdation tool
// @namespace    https://verylegitgirl.github.io
// @version      1.0
// @description  Automatically set quest-s translations to OUTDATED. Any suggestions/bugs write to me in discord verylegitgirl or the Undercards channel,
// @author       NekoMaya
// @match        https://undercards.net/Translate
// ==/UserScript==

(function() {
    'use strict';

    let ragemode = true; // Change for rage (fast) actions

    function performTrauActions() {
        let intervalId = setInterval(function() {
            let translators = document.getElementById("translators");
            if (translators) {
                let questExists = false;
                let tds = translators.querySelectorAll("td");
                tds.forEach(td => {
                    if (td.textContent.includes("quest-s")) {
                        questExists = true;
                    }
                });

                if (questExists) {
                    let textarea = translators.querySelector('textarea.form-control[maxlength="500"]');
                    if (textarea) {
                        textarea.value = "outdated";
                    }

                    let tables = translators.querySelectorAll('table[id^="translator-"]');
                    tables.forEach(table => {
                        let id = table.id;
                        let number = id.split('-')[1];
                        eval(`checkCreate(${number})`);

                        setTimeout(() => {
                            let button = document.querySelector('.bootstrap-dialog-footer-buttons .btn-primary');
                            if (button) {
                                button.click();
                            }
                        }, ragemode ? 300 : 500);
                    });
                } else {
                    clearInterval(intervalId);
                }
            } else {
                clearInterval(intervalId);
            }
        }, ragemode ? 300 : 1000);
    }

    function performComplActions() {
        let intervalId = setInterval(function() {
            let translators = document.getElementById("translators");
            if (translators) {
                let questExists = false;
                let tds = translators.querySelectorAll("td");
                tds.forEach(td => {
                    if (td.textContent.includes("quest-s")) {
                        questExists = true;
                    }
                });

                if (questExists) {
                    let translationTable = document.getElementById("translator-translations");
                    if (translationTable) {
                        let buttons = translationTable.querySelectorAll('button.btn.btn-sm.btn-success');
                        buttons.forEach(button => {
                            let onclickAttr = button.getAttribute('onclick');
                            if (onclickAttr && onclickAttr.includes('checkAccept')) {
                                eval(onclickAttr);

                                setTimeout(() => {
                                    let okButton = document.querySelector('.bootstrap-dialog-footer-buttons .btn-primary');
                                    if (okButton) {
                                        okButton.click();
                                    }
                                }, ragemode ? 300 : 500);
                            }
                        });
                    }
                } else {
                    clearInterval(intervalId);
                }
            } else {
                clearInterval(intervalId);
            }
        }, ragemode ? 300 : 1000);
    }

    function executeEvalCode(value) {
        var evalCode = `
            (function() {
                var selectElement = document.getElementById('selectStatus');
                if (${value} === 1) {
                    selectElement.value = 'NOT_TRANSLATED';
                } else if (${value} === 2) {
                    selectElement.value = 'WAITING';
                }
                applyFilters();
                showPage(0);
            })();
        `;

        eval(evalCode);
    }

    let navButtons = document.getElementById("navButtons");
    if (navButtons) {
        let trauButton = document.createElement("button");
        trauButton.innerHTML = "CHECK";
        trauButton.id = "trauButton";
        trauButton.className = navButtons.querySelector("button").className;
        trauButton.className += " btn-sm";
        navButtons.appendChild(trauButton);

        trauButton.addEventListener("click", function() {
            executeEvalCode(1);
        });
        trauButton.addEventListener("click", performTrauActions);
    }

    if (navButtons) {
        let complButton = document.createElement("button");
        complButton.innerHTML = "COMPL";
        complButton.id = "complButton";
        complButton.className = navButtons.querySelector("button").className;
        complButton.className += " btn-sm";
        navButtons.appendChild(complButton);

        complButton.addEventListener("click", function() {
            executeEvalCode(2);
        });
        complButton.addEventListener("click", performComplActions);
    }
})();
