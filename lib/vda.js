/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global getFactory getAssetRegistry emit query */

/**
 * Transfer a item to another private owner
 * @param {org.vda.PrivateItemTransfer} privateItemTransfer - the PrivateItemTransfer transaction
 * @transaction
 */
async function privateItemTransfer(privateItemTransfer) { // eslint-disable-line no-unused-vars
    console.log('privateItemTransfer');

    const NS = 'org.acme.item.lifecycle';
    const NS_D = 'org.vda';
    const factory = getFactory();

    const seller = privateItemTransfer.seller;
    const buyer = privateItemTransfer.buyer;
    const item = privateItemTransfer.item;

    //change item owner
    item.owner = buyer;

    //PrivateItemTransaction for log
    const itemTransferLogEntry = factory.newConcept(NS_D, 'ItemTransferLogEntry');
    itemTransferLogEntry.item = factory.newRelationship(NS_D, 'Item', item.getIdentifier());
    itemTransferLogEntry.seller = factory.newRelationship(NS, 'PrivateOwner', seller.getIdentifier());
    itemTransferLogEntry.buyer = factory.newRelationship(NS, 'PrivateOwner', buyer.getIdentifier());
    itemTransferLogEntry.timestamp = privateItemTransfer.timestamp;
    if (!item.logEntries) {
        item.logEntries = [];
    }

    item.logEntries.push(itemTransferLogEntry);

    const assetRegistry = await getAssetRegistry(item.getFullyQualifiedType());
    await assetRegistry.update(item);
}

/**
 * Scrap a item
 * @param {org.vda.ScrapItem} scrapItem - the ScrapItem transaction
 * @transaction
 */
async function scrapItem(scrapItem) { // eslint-disable-line no-unused-vars
    console.log('scrapItem');

    const NS_D = 'org.vda';

    const assetRegistry = await getAssetRegistry(NS_D + '.Item');
    const item = await assetRegistry.get(scrapItem.item.getIdentifier());
    item.itemStatus = 'SCRAPPED';
    await assetRegistry.update(item);
}

/**
 * Scrap a item
 * @param {org.vda.ScrapAllItemsByColour} scrapAllItems - the ScrapAllItems transaction
 * @transaction
 */
async function scrapAllItemsByColour(scrapAllItems) { // eslint-disable-line no-unused-vars
    console.log('scrapAllItemsByColour');

    const NS_D = 'org.vda';
    const assetRegistry = await getAssetRegistry(NS_D + '.Item');
    const items = await query('selectAllItemsByColour', {'colour': scrapAllItems.colour});
    if (items.length >= 1) {
        const factory = getFactory();
        const itemsToScrap = items.filter(function (item) {
            return item.itemStatus !== 'SCRAPPED';
        });
        for (let x = 0; x < itemsToScrap.length; x++) {
            itemsToScrap[x].itemStatus = 'SCRAPPED';
            const scrapItemEvent = factory.newEvent(NS_D, 'ScrapItemEvent');
            scrapItemEvent.item = itemsToScrap[x];
            emit(scrapItemEvent);
        }
        await assetRegistry.updateAll(itemsToScrap);
    }
}
