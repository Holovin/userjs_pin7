// ==UserScript==
// @name         Pin7Marker
// @namespace    http://holov.in/Pin7Marker
// @version      0.1
// @description  Userjs for mark viewed rows
// @author       Alexander Holovin
// @match        http://pin7.ru/search*
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

(function() {
    'use strict';

    const rows = [
        ...document.getElementsByClassName('trm_01'),
        ...document.getElementsByClassName('trm_02'),
    ];

    rows.forEach(element => {
        const id = element.id;
        GM.getValue(id).then((data) => modifyElement(id, data));
    });
})();

function modifyElement(id, data) {
    console.log(id, data);

    const newElement = document.createElement('span');
    newElement.setAttribute('data-id', id);

    if (data !== 'VISIBLE' && data !== 'HIDDEN') {
        newElement.setAttribute('data-data', 'VISIBLE');
        GM.setValue(id, 'VISIBLE').then();

    } else {
        newElement.setAttribute('data-data', data);
    }

    newElement.addEventListener('click', toggleVisible);
    newElement.innerText = getText(data);

    const parent = document.querySelector(`#${id} .tdm_09`);
    parent.appendChild(newElement);
    parent.parentElement.style.opacity = getOpacity(data);    
}

function toggleVisible(event) {
    const element = event.target;
    const id = element.getAttribute('data-id');
    const data = element.getAttribute('data-data');
    const newData = getInvertedData(data);
    element.setAttribute('data-data', newData);
    GM.setValue(id, newData)
        .then(() => GM.getValue(id))
        .then((data) => {
            console.log(id, data);
            element.innerText = getText(data);
            document.querySelector(`#${id} .tdm_09`).parentElement.style.opacity = getOpacity(data);
        })
}

function getText(data) {
    return data !== 'VISIBLE' ? '[Показать!]' : '[Скрыть!]';
}

function getOpacity(data) {
    return data !== 'VISIBLE' ? '0.3' : '1';
}

function getInvertedData(data) {
    return data === 'VISIBLE' ? 'HIDDEN' : 'VISIBLE';
}