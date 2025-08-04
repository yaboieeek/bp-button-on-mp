// ==UserScript==
// @name         Backpack.tf link on marketplace.tf
// @namespace    https://steamcommunity.com/profiles/76561198967088046
// @version      2.0
// @description  adds backpack.tf link on marketplace.tf
// @author       eeek
// @match        https://marketplace.tf/items/tf2/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=marketplace.tf
// @updateURL https://github.com/yaboieeek/bp-button-on-mp/raw/refs/heads/main/bptfButtonOnMptf.user.js
// @downloadURL https://github.com/yaboieeek/bp-button-on-mp/raw/refs/heads/main/bptfButtonOnMptf.user.js
// @grant        none
// ==/UserScript==

//let's try functional paradigm

const itemTitleElement = document.querySelector('.item-title > span');
const nextLinkElement =document.querySelector('#btnBackpackTFStats');

const nextItemLink = nextLinkElement.href;
nextLinkElement.remove(); //nu uh my buttons r better

const qualities = {
    '1': 'Genuine',
    '3':'Vintage',
    '5':'Unusual',
    '6':'Unique',
    '9':'Self-Made',
    '11':'Strange'
}

const killstreakTiers = {
    '1': 'Killstreak ',
    '2': 'Specialized Killstreak ',
    '3': 'Professional Killstreak '
}

const getItemModelFromMarketplaceURL = (rawURL) => {
    let itemModel = {};
    const marketplaceURL = rawURL.replace('https://next.backpack.tf/stats?', '')
    const url = new URLSearchParams(marketplaceURL);
    for (const [key, value] of url) {
        itemModel[key] = value;
    };
    return itemModel;
}

const getItemSku = () => window.location.pathname.replace('items/tf2/', '');

const getSpecialItemIndex = () => window.location.pathname.replace('items/tf2/', '').split(';').find(index => index.includes('td-')).replace('td-', ''); //for unusualifiers/killstreak kits

const processKillstreakKitLink = (linkArray, tier) => [...linkArray, tier + '-' + getSpecialItemIndex()];

const buildOldLink = (itemModel) => {
    const itemName = itemModel.item;
    console.log(itemModel);

    let isSpecialItem = ['Unusualifier', 'Kit', 'Fabricator'].includes(itemName);

    const baseLink = `https://backpack.tf/stats`;
    const quality = qualities[itemModel.quality];
    const itemPriceIndex = itemModel.priceindex;

    const craftable = itemModel.craftable !== 0? 'Craftable' : 'Non-Craftable';
    const killstreak = killstreakTiers[`${itemModel.killstreakTier}`] || '';

    let link = [baseLink, quality, killstreak + itemName, 'Tradable', craftable];

    if (isSpecialItem) {
        if (itemName === 'Kit') return processKillstreakKitLink([baseLink, quality, itemName, 'Tradable', 'Non-Craftable'], itemModel.killstreakTier).join('/');
        if (itemName === 'Unusualifier') return [baseLink, quality, itemName, 'Tradable', 'Non-Craftable', getSpecialItemIndex()].join('/')
        return [baseLink, quality, itemName, 'Tradable', 'Craftable', itemPriceIndex].join('/')
    };

    if (quality === 'Unusual') return [...link, itemPriceIndex].join('/')

    return link.join('/')
}

const createButtons = () => {
    const MPButton = document.createElement('a');
    const autobotButton = document.createElement('a');
    const spanContainer = document.createElement('span');
    const target = document.querySelector('.auction-options');

    autobotButton.className = 'btn btn-danger';
    autobotButton.innerText = 'Autobot.tf';
    autobotButton.target = '_blank';
    autobotButton.href = 'https://autobot.tf/items' + getItemSku();
    target.append(spanContainer);
    spanContainer.append(autobotButton);
    MPButton.className = 'btn btn-success';
    MPButton.innerText = 'Backpack.tf';
    MPButton.target = '_blank';
    spanContainer.prepend(MPButton);

    const itemModel = getItemModelFromMarketplaceURL(nextItemLink);

    MPButton.href = buildOldLink(itemModel)// lol

    if (/Wear|Tested|Scared|Factory New/.test(itemTitleElement.innerText)) {
        MPButton.href = nextItemLink;
        MPButton.innerText = 'Next.backpack.tf';
    };
    spanContainer.className = 'd-flex mt-2';
    spanContainer.style.gap = '0.5em';
 };

createButtons();
