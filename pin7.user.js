// ==UserScript==
// @name         Pin7Marker
// @namespace    http://holov.in/Pin7Marker
// @version      0.3
// @description  Userjs for mark viewed rows
// @author       Alexander Holovin
// @match        http://pin7.ru/*
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
        GM.getValue(`${id}toggle`).then((data) => modifyElement(id, data));
        GM.getValue(`${id}comment`).then((data) => modifyComments(id, data));
    });
})();

function modifyElement(id, data) {
    let newData = data;

    const isViewedMarkElement = document.createElement('div');
    isViewedMarkElement.setAttribute('data-id', id);

    if (data !== 'VISIBLE' && data !== 'HIDDEN') {
        isViewedMarkElement.setAttribute('data-data', 'VISIBLE');
        GM.setValue(`${id}toggle`, 'VISIBLE').then();
        newData = 'VISIBLE';

    } else {
        isViewedMarkElement.setAttribute('data-data', data);
    }

    isViewedMarkElement.addEventListener('click', toggleVisible);
    isViewedMarkElement.innerText = getText(newData);

    const parent = document.querySelector(`#${id} .tdm_09`);
    parent.appendChild(isViewedMarkElement);
    parent.parentElement.style.opacity = getOpacity(newData);
    parent.style.wordBreak = 'break-all';


    const isStudio = document.querySelector(`#${id} .tdm_01`).innerText.indexOf('Студия') !== -1;
    if (isStudio) {
        document.querySelector(`#${id} .tdm_01`).style.backgroundColor = '#FFF1F0';
    }

    const undergroundRule = new RegExp('((\\s\\d{2,3}\\sм)|(\\s[12]\\sкм)|(\\s1\\.\\d\\sкм)).?$', 'gm');
    const isOkUnderground = undergroundRule.test(document.querySelector(`#${id} .tdm_03`).innerText);
    if (!isOkUnderground) {
        document.querySelector(`#${id} .tdm_03`).style.backgroundColor = '#FFF1F0';
    }

    const areaRule = new RegExp('^(\\d+(\\.\\d{1,2})?)\\/(\\d+|\\?)');
    const isOkArea = areaRule.exec(document.querySelector(`#${id} .tdm_04`).innerText)[1] > 30;
    if (!isOkArea) {
        document.querySelector(`#${id} .tdm_04`).style.backgroundColor = '#FFF1F0';
    }

    if (!isStudio && isOkUnderground && isOkArea) {
        document.querySelector(`#${id} .tdm_11`).style.backgroundColor = '#C1FFDA';
    }
}

function toggleVisible(event) {
    const element = event.target;
    const id = element.getAttribute('data-id');
    const data = element.getAttribute('data-data');
    const newData = getInvertedData(data);
    element.setAttribute('data-data', newData);

    GM.setValue(`${id}toggle`, newData)
        .then(() => GM.getValue(`${id}toggle`))
        .then((data) => {
            element.innerText = getText(data);
            document.querySelector(`#${id} .tdm_09`).parentElement.style.opacity = getOpacity(data);
        })
}

function modifyComments(id, data) {
    const commentElement = document.createElement('div');
    commentElement.setAttribute('data-id', id);

    commentElement.addEventListener('click', askComment);
    commentElement.innerText = data ? data : '[нет]';

    const parent = document.querySelector(`#${id} .tdm_09`);
    parent.appendChild(commentElement);
}

function askComment(event) {
    const text = prompt('Введите комментарий');

    if (!text) {
        return;
    }

    const element = event.target;
    const id = element.getAttribute('data-id');
    element.setAttribute('data-comment', text);

    GM.setValue(`${id}comment`, text)
        .then(() => GM.getValue(`${id}comment`))
        .then((text) => {
            element.innerText = text;
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