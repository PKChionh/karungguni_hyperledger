# Karung Guni Item Lifecycle Network

> This network tracks the Lifecycle of Items from collection to being scrapped involving item owners, manufacturers and scrap merchants. A regulator is able to provide oversight throughout this whole process.

This business network defines:

**Participants**
`AuctionHouse` `Company` `Manufacturer` `PrivateOwner` `Regulator` `ScrapMerchant`

**Assets**
`Order` `Item`

**Transactions**
`PlaceOrder` `UpdateOrderStatus` `ApplicationForItemRegistrationCertificate` `PrivateItemTransfer` `ScrapItem` `UpdateSuspicious` `ScrapAllItemsByColour` `SetupDemo`

**Events**
`PlaceOrderEvent` `UpdateOrderStatusEvent` `ScrapItemEvent`

A `PrivateOwner` participant would apply for a registration certificate by submitting an `ApplicationForItemRegistrationCertificate` transaction. After the item has been resold they would submit a `PrivateItemTransfer` transaction. A `Regulator` would be able perform oversight over this whole process and submit an `UpdateSuspicious` transaction to view any suspicious items that may be out of compliance with regulations. A `ScrapMerchant` would be able to submit a `ScrapItem` transaction to complete the lifecycle of a item.

To test this Business Network Definition in the **Test** tab:

Submit a `SetupDemo` transaction:

```
{
  "$class": "org.acme.item.lifecycle.SetupDemo"
}
```

This transaction populates the Participant Registries with `PrivateOwner` participants and a `Regulator` participant. The `Item` Asset Registry will have `Item` assets.

Submit a `PlaceOrder` transaction:

```
{
  "$class": "org.acme.item.lifecycle.manufacturer.PlaceOrder",
  "orderId": "1234",
  "itemDetails": {
    "$class": "org.vda.ItemDetails",
    "make": "Sony",
    "modelType": "Bravia",
    "colour": "Black"
  },
  "manufacturer": "resource:org.acme.item.lifecycle.manufacturer.Manufacturer#Arium",
  "orderer": "resource:org.acme.item.lifecycle.PrivateOwner#toby"
}
```

This `PlaceOrder` transaction creates a new order in the `Order` Asset Registry. It also emits a `PlaceOrderEvent` events.

Submit a `UpdateOrderStatus` transaction:

```
{
  "$class": "org.acme.item.lifecycle.manufacturer.UpdateOrderStatus",
  "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
  "order": "resource:org.acme.item.lifecycle.manufacturer.Order#1234"
}
```

This `UpdateOrderStatus` transaction updates the order status of `orderId:1234` in the `Order` Asset Registry. It also emits a `UpdateOrderStatusEvent` event.

## License <a name="license"></a>
Apache License, Version 2.0 (Apache-2.0), and Creative Commons Attribution 4.0 International License (CC-BY-4.0), available at http://creativecommons.org/licenses/by/4.0/.