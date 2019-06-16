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

/* global getFactory getParticipantRegistry getAssetRegistry */

/**
 * Setup the demo
 * @param {org.acme.item.lifecycle.SetupDemo} setupDemo - the SetupDemo transaction
 * @transaction
 */
async function setupDemo(setupDemo) { // eslint-disable-line no-unused-vars
    console.log('setupDemo');

    const factory = getFactory();
    const NS_M = 'org.acme.item.lifecycle.manufacturer';
    const NS = 'org.acme.item.lifecycle';
    const NS_D = 'org.vda';

    const names = ['dan', 'simon', 'jake', 'anastasia', 'matthew', 'mark', 'fenglian', 'sam', 'james', 'nick', 'caroline', 'rachel', 'john', 'rob', 'tom', 'paul', 'ed', 'dave', 'anthony', 'toby', 'ant', 'matt', 'anna'];
    const items = {
        'Arium': {
            'Nova': [
                {
                    'vin': '156478954',
                    'colour': 'white',
                    'itemStatus': 'ACTIVE'
                }
            ],
            'Nebula': [
                {
                    'vin': '652345894',
                    'colour': 'blue',
                    'itemStatus': 'ACTIVE'
                }
            ]
        },
        'Morde': {
            'Putt': [
                {
                    'vin': '6437956437',
                    'colour': 'black',
                    'itemStatus': 'ACTIVE',
                    'suspiciousMessage': 'Mileage anomaly'
                },
                {
                    'vin': '857642213',
                    'colour': 'red',
                    'itemStatus': 'ACTIVE'
                },
                {
                    'vin': '542376495',
                    'colour': 'silver',
                    'itemStatus': 'ACTIVE'
                }
            ],
            'Pluto': [
                {
                    'vin': '976431649',
                    'colour': 'white',
                    'itemStatus': 'ACTIVE'
                },
                {
                    'vin': '564215468',
                    'colour': 'green',
                    'itemStatus': 'ACTIVE',
                    'suspiciousMessage': 'Insurance write-off but still active'
                },
                {
                    'vin': '784512464',
                    'colour': 'grey',
                    'itemStatus': 'ACTIVE'
                }
            ]
        },
        'Ridge': {
            'Cannon': [
                {
                    'vin': '457645764',
                    'colour': 'red',
                    'itemStatus': 'ACTIVE'
                },
                {
                    'vin': '312457645',
                    'colour': 'white',
                    'itemStatus': 'ACTIVE',
                    'suspiciousMessage': 'Suspicious ownership sequence'
                },
                {
                    'vin': '65235647',
                    'colour': 'silver',
                    'itemStatus': 'ACTIVE',
                    'suspiciousMessage': 'Untaxed item'
                }
            ],
            'Rancher': [
                {
                    'vin': '85654575',
                    'colour': 'blue',
                    'itemStatus': 'ACTIVE'
                },
                {
                    'vin': '326548754',
                    'colour': 'white',
                    'itemStatus': 'ACTIVE',
                    'suspiciousMessage': 'Uninsured item'
                }
            ]
        }
    };

    // register manufacturers
    const manufacturers = Object.keys(items).map(name => {
        return factory.newResource(NS_M, 'Manufacturer', name);
    });
    const manufacturerRegistry = await getParticipantRegistry(NS_M + '.Manufacturer');
    await manufacturerRegistry.addAll(manufacturers);

    // register private owners
    const privateOwners = names.map(name => {
        return factory.newResource(NS, 'PrivateOwner', name);
    });
    const privateOwnerRegistry = await getParticipantRegistry(NS + '.PrivateOwner');
    await privateOwnerRegistry.addAll(privateOwners);

    // register regulator
    const regulator = factory.newResource(NS, 'Regulator', 'regulator');
    const regulatorRegistry = await getParticipantRegistry(NS + '.Regulator');
    await regulatorRegistry.add(regulator);

    // register items
    const vs = [];
    let carCount = 0;
    for (const mName in items) {
        const manufacturer = items[mName];
        for (const mModel in manufacturer) {
            const model = manufacturer[mModel];
            for (let i = 0; i < model.length; i++) {
                const itemTemplate = model[i];
                const item = factory.newResource(NS_D, 'Item', itemTemplate.vin);
                item.owner = factory.newRelationship(NS, 'PrivateOwner', names[carCount]);
                item.itemStatus = itemTemplate.itemStatus;
                item.itemDetails = factory.newConcept(NS_D, 'ItemDetails');
                item.itemDetails.make = mName;
                item.itemDetails.modelType = mModel;
                item.itemDetails.colour = itemTemplate.colour;
                item.itemDetails.vin = itemTemplate.vin;

                if (itemTemplate.suspiciousMessage) {
                    item.suspiciousMessage = itemTemplate.suspiciousMessage;
                }

                if (!item.logEntries) {
                    item.logEntries = [];
                }

                const logEntry = factory.newConcept(NS_D, 'ItemTransferLogEntry');
                logEntry.item = factory.newRelationship(NS_D, 'Item', itemTemplate.vin);
                logEntry.buyer = factory.newRelationship(NS, 'PrivateOwner', names[carCount]);
                logEntry.timestamp = setupDemo.timestamp;

                item.logEntries.push(logEntry);

                vs.push(item);
                carCount++;
            }
        }
    }
    const itemRegistry = await getAssetRegistry(NS_D + '.Item');
    await itemRegistry.addAll(vs);
}