// ==UserScript==
// @name         Deck Flipper
// @namespace    https://undercards.net/
// @version      1.0
// @description  Adds a SWITCH button in Import menu!
// @author       NekoMaya
// @match        https://*.undercards.net/*
// @grant        none
// @icon         https://i.imgur.com/XhKcpDs.png
// ==/UserScript==

(function() {
    'use strict';

    const numbersToRemove = [
        '77', '734', '257', '454', '88', '133', '91', '180', '705', '79', '87', '67',
        '183', '258', '458', '74', '69', '81', '71', '260', '737', '130', '259', '255',
        '704', '703', '134', '700', '66', '453', '456', '131', '457', '92', '182', '78',
        '75', '261', '184', '256', '460', '68', '85', '128', '93', '181', '178', '89',
        '99', '698', '97', '731', '702', '73', '733', '94', '98', '699', '84', '100',
        '90', '179', '95', '738', '455', '80', '732', '70', '735', '82',
        '132', '76', '72', '96', '83', '129', '86'
    ];

    function addSwitchButton() {
        const importButton = document.querySelector('p button[onclick="importDeckAction();"]');
        if (importButton) {
            const paragraph = importButton.parentElement;

            if (!paragraph.querySelector('button.switch-btn')) {
                const switchButton = document.createElement('button');
                switchButton.className = 'btn btn-primary switch-btn';
                switchButton.style.color = 'white';
                switchButton.style.marginLeft = '20px';
                switchButton.textContent = 'SWITCH';

                switchButton.addEventListener('click', () => {
                    const dialogMessage = document.querySelector('.bootstrap-dialog-message');
                    if (dialogMessage) {
                        dialogMessage.innerHTML = '';

                        const textField = document.createElement('input');
                        textField.type = 'text';
                        textField.className = 'form-control';
                        textField.placeholder = 'Paste deck code here!';
                        textField.style.marginBottom = '10px';

                        const switchContainer = document.createElement('div');
                        switchContainer.style.display = 'flex';
                        switchContainer.style.alignItems = 'center';

                        const switchLabel = document.createElement('span');
                        switchLabel.textContent = 'Switch to:';
                        switchLabel.style.color = 'white';
                        switchLabel.style.marginRight = '10px';

                        const selectField = document.createElement('select');
                        selectField.className = 'form-control';
                        selectField.style.width = 'fit-content';
                        const options = [
                            'Kindness', 'Determination', 'Patience', 'Bravery',
                            'Integrity', 'Perseverance', 'Justice'
                        ];
                        options.forEach(optionText => {
                            const option = document.createElement('option');
                            option.value = optionText.toLowerCase();
                            option.textContent = optionText;
                            option.className = optionText.toUpperCase();
                            selectField.appendChild(option);
                        });

                        const updateSelectClass = () => {
                            selectField.className = 'form-control';
                            const selectedOption = selectField.options[selectField.selectedIndex];
                            if (selectedOption) {
                                selectField.classList.add(selectedOption.className);
                            }
                        };

                        selectField.addEventListener('change', updateSelectClass);

                        updateSelectClass();

                        const doneButton = document.createElement('button');
                        doneButton.className = 'btn btn-primary';
                        doneButton.textContent = 'Flip!';
                        doneButton.style.marginTop = '10px';
                        doneButton.addEventListener('click', () => {
                            const existingClipboardButton = dialogMessage.querySelector('.btn-success.clipboard-btn');
                            const existingImportButton = dialogMessage.querySelector('.btn-success.import-btn');
                            if (existingClipboardButton) existingClipboardButton.remove();
                            if (existingImportButton) existingImportButton.remove();

                            const base64Text = textField.value;
                            if (base64Text) {
                                try {
                                    const decodedText = atob(base64Text);
                                    const selectedOption = selectField.options[selectField.selectedIndex].textContent.toUpperCase();
                                    let updatedText = decodedText.replace(/("soul":")[^"]+/, `$1${selectedOption}`);
                                    updatedText = updatedText.replace(/("cardIds":\[)([^\]]+)/g, (match, p1, p2) => {
                                        let newNumbers = p2.split(',').map(num => num.trim()).filter(num => !numbersToRemove.includes(num));
                                        return `${p1}${newNumbers.join(',')}`;
                                    });
                                    updatedText = updatedText.replace(/,,+/g, ',');
                                    const encodedText = btoa(updatedText);
                                    console.log('Encoded Text:', encodedText);

                                    const buttonsContainer = document.createElement('div');
                                    buttonsContainer.style.marginTop = '10px';

                                    const clipboardButton = document.createElement('button');
                                    clipboardButton.className = 'btn btn-success clipboard-btn';
                                    clipboardButton.textContent = 'Clipboard';
                                    clipboardButton.style.marginRight = '10px';
                                    clipboardButton.addEventListener('click', () => {
                                        navigator.clipboard.writeText(encodedText).then(() => {
                                            alert('Text copied to clipboard!');
                                        }).catch(err => {
                                            console.error('Error copying text to clipboard:', err);
                                        });
                                    });

                                    const importButton = document.createElement('button');
                                    importButton.className = 'btn btn-success import-btn';
                                    importButton.textContent = 'Import';
                                    importButton.addEventListener('click', () => {
                                        try {
                                            eval(`loadDeckCode('${encodedText}')`);
                                        } catch (e) {
                                            console.error('Error executing loadDeckCode:', e);
                                        }
                                    });

                                    buttonsContainer.appendChild(clipboardButton);
                                    buttonsContainer.appendChild(importButton);

                                    dialogMessage.appendChild(buttonsContainer);

                                } catch (e) {
                                    console.error('Error decoding Base64:', e);
                                }
                            }
                        });

                        const pasteDeckButton = document.createElement('button');
                        pasteDeckButton.className = 'btn btn btn-primary paste-deck-btn';
                        pasteDeckButton.textContent = 'Paste Current Deck';
                        pasteDeckButton.style.marginLeft = '30px';
                        pasteDeckButton.addEventListener('click', () => {
                            try {
                                var generatedDeckCode = generateDeckCode();
                                textField.value = generatedDeckCode;
                            } catch (e) {
                                console.error('Error generating deck code:', e);
                            }
                        });

                        switchContainer.appendChild(switchLabel);
                        switchContainer.appendChild(selectField);
                        switchContainer.appendChild(pasteDeckButton);

                        dialogMessage.appendChild(textField);
                        dialogMessage.appendChild(switchContainer);
                        dialogMessage.appendChild(doneButton);
                    }
                });

                paragraph.appendChild(switchButton);
            }
        }
    }

    const observer = new MutationObserver(() => {
        addSwitchButton();
    });

    const config = { childList: true, subtree: true };

    observer.observe(document.body, config);

    addSwitchButton();
})();
