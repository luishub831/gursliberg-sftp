function pad(value, length, alignRight = false) {
  const str = String(value ?? '');
  if (str.length >= length) return str.slice(0, length);
  return alignRight ? str.padStart(length) : str.padEnd(length);
}

module.exports = function formatOrder(order) {
  const FN1 = [
    pad(`FN1`, 3),                           // FN1_RecType (3)
    pad(`${order.order_number}`, 20),        // FN1_OrderNo (20)
    pad(order.customer.id, 20),        // FN1_DelCustNo (20)
    pad(order.customer?.first_name, 50),  // FN1_DelName
    pad(order.shipping_address?.address1, 50),   //"FN1_DelAdd1(50)"
    pad(order.shipping_address?.address2 || '', 50),  //"FN1_DelAdd2(50)"
    pad(order.shipping_address?.zip, 10),    //"FN1_DelZipCode(10)"
    pad(order.shipping_address?.city, 50),   // "FN1_DelPostalOffice(50)" 	
    pad(order.shipping_address?.country_code, 2),  //"FN1_DelCountryCode(2)" 
    pad(order.shipping_address?.country, 25),  // "FN1_DelCountry(25)"" 
    pad('', 50),                    // FN1_DelExtRef
    pad(order.email, 100),   //"FN1_DelCustEmail(100)" 
    pad(order.phone || '', 12),     //"FN1_DelCustMobil(12)" 
    pad(order.total_weight, 12),                    // FN1_TotalWeight(12)
    pad('8999869', 20),                    // FN1_ShopID
    pad('N/A', 12),                    // FN1_DeliveryMode
    pad('N/A', 48),                    // FN1_PickupPoint
    pad('NGBF', 10),                    // FN1_ClubID
    pad('0', 1),                    // FN1_CustType (0 = private)
    pad('0', 1),                    // FN1_AddrType (0 = street)
  ];

  const FN2 = order.line_items.map((item, index) => [
    `FN2`,                                                  // FN2_RecType (fixed value "FN2")
    pad(order.order_number, 20),                      // FN2_OrderNo (Invoice/order number)
    pad(item.product_id || '', 8),                                 // FN2_ArticleNo (internal item number)
    // pad(item.sku || '', 21),                                // FN2_ItemNumber (EAN)
    pad(item.title || '', 80),                              // FN2_ItemName (product name)
    pad(item.quantity, 9),                            // FN2_DelNumber (number of items to deliver)
    pad(index + 1, 3),                                // FN2_LineNumber (line number, starting at 1)
    pad('1', 1),                                             // FN2_PickableItem (1 = pickable, or blank)
    pad('93311', 6),                                        // FN2_ItemOwner (you can customize this)
    // pad(item.price, 8),                               // FN2_Price (sales price)
    pad('N/A', 20),                                            // FN2_LineRef (line reference, optional/blank)
  ].join('')).join('\n');

  return `${FN1.join('')}\n${FN2}`;
};
