// ==UserScript==
// @name         Backpack.tf link on marketplace.tf
// @namespace    https://steamcommunity.com/profiles/76561198967088046
// @version      1.0.0
// @description  adds backpack.tf link on marketplace.tf
// @author       eeek
// @match        https://marketplace.tf/items/tf2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marketplace.tf
// @grant        none
// ==/UserScript==

(function() {
'use strict';
let addGoogle = false;
//let's try functional paradigm

const itemTitleElement = document.querySelector('.item-title > span');
const descriptions = document.querySelectorAll('.description') ?? null;

const qualityColor = {
    unique: 'rgb(125, 109, 0)',
    strange: 'rgb(207, 106, 50)',
    unusual: 'rgb(134, 80, 172)',
    genuine: 'rgb(77, 116, 85)',
    vintage: 'rgb(71, 98, 145)'
};

const getQuality = () => {
    const color = itemTitleElement.style.color;
    switch (color) {
        case qualityColor.unique: return 'Unique';
        case qualityColor.strange: return 'Strange';
        case qualityColor.unusual: return 'Unusual';
        case qualityColor.genuine: return 'Genuine';
        case qualityColor.vintage: return 'Vintage';
        default: return color;
    }
}
const getItemSku = () => window.location.pathname.replace('items/tf2/', '');

const getCraftable = () => !/Uncraftable|Kit|Unusualifier/.test(itemTitleElement.innerText);

const getItemName = (quality, effect = '') => encodeURIComponent(itemTitleElement.innerText
                                                                 .replace(quality, '')
                                                                 .replace(effect, '')
                                                                 .replace('Festivized ', '')
                                                                 .replace(/★|Craftable |Uncraftable /, '')
                                                                 .replace(/Basic Killstreak |Specialized |Professional /g, '')
                                                                 .trim());

const getItemEffectName = () => [...descriptions].find(description => description.innerText.includes('★ Unusual Effect: ')).innerText.replace('★ Unusual Effect: ', '');

const getPriceIndex = () => window.location.pathname.replace('items/tf2/', '').split(';').find(index => index.includes('u')).replace('u', '');

const getKillstreak = () => {
    if (itemTitleElement.innerText.includes('Basic Killstreak ')) return 'Basic Killstreak';
    if (itemTitleElement.innerText.includes('Specialized ')) return 'Specialized';
    if (itemTitleElement.innerText.includes('Professional')) return 'Professional';
    return '';
}
const getSpecialItemIndex = () => window.location.pathname.replace('items/tf2/', '').split(';').find(index => index.includes('td-')).replace('td-', ''); //for unusualifiers/killstreak kits

const makeItemLink = () => {
    try {
        const base = `https://backpack.tf/stats/`;
        const quality = getQuality();
        let killstreak = getKillstreak();
        let tier, fabTier;
        if (killstreak !== '') {
            switch (killstreak) {
                case 'Basic Killstreak': killstreak = 'Killstreak%20'; tier = 1; break;
                case 'Specialized': killstreak = 'Specialized%20Killstreak%20'; tier = 2; fabTier = 6523; break;
                case 'Professional': killstreak = 'Professional%20Killstreak%20'; tier = 3; fabTier = 6526; break;
            }
        }


        if (itemTitleElement.innerText.includes('Kit')) {
            if (!itemTitleElement.innerText.includes('Fabricator')) return base + quality + '/' + killstreak + 'Kit/Tradable/Non-Craftable/' + tier + '-' + getSpecialItemIndex();
            return base + quality + '/' + killstreak + 'Fabricator/Tradable/Craftable/' + fabTier + '-6-' + getSpecialItemIndex();
        }
        if (quality !== 'Unusual') return base + quality + '/' + killstreak + getItemName(quality) + '/Tradable/' + (getCraftable() ? 'Craftable' : 'Non-Craftable');
        if (itemTitleElement.innerText.includes('Unusualifier')) return base + quality + '/Unusualifier/Tradable/Non-Craftable/' + getSpecialItemIndex();

        return base + quality + '/' + killstreak + getItemName(quality, getItemEffectName()) + '/Tradable/' + (getCraftable() ? 'Craftable' : 'Non-Craftable') + '/' + getPriceIndex();

    } catch (e) {
        addGoogle = true;
        return 'https://google.com/search?q=' + itemTitleElement.innerText; //blame zeus
    }
}

const createButtons = () => {
    const MPButton = document.createElement('a');
    const autobotButton = document.createElement('a');
    const spanContainer = document.createElement('span');
    const target = document.querySelector('.auction-options');

    autobotButton.className = 'btn btn-danger mt-1';
    autobotButton.innerText = 'Autobot.tf';
    autobotButton.target = '_blank';
    autobotButton.href = 'https://autobot.tf/items' + getItemSku();
    target.append(spanContainer);
    spanContainer.append(autobotButton);

    if (/Wear|Tested|Scared|Factory New/.test(itemTitleElement.innerText)) return;
    MPButton.className = 'btn btn-success mt-1';
    MPButton.innerText = 'Backpack.tf';
    MPButton.target = '_blank';
    spanContainer.prepend(MPButton);

    MPButton.href = makeItemLink(); 
    if (addGoogle) {
        MPButton.className = 'btn btn-warning mt-1';
        MPButton.innerText = 'View on Google';
    }
    spanContainer.className = 'd-flex';
    spanContainer.style.gap = '1em';


 };

createButtons();

})();
