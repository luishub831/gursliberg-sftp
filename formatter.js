function pad(value, length, alignRight = false) {
  const str = String(value ?? '');
  if (str.length >= length) return str.slice(0, length);
  return alignRight ? str.padStart(length) : str.padEnd(length);
}

module.exports = function formatOrder(order) {
  const FN1 = [
    pad(`FN1${order.order_number}`, 20),                           // FN1_RecType (3)
    pad(order.customer.id, 20),        // FN1_OrderNo (20)
    pad(order.customer?.first_name, 50),  // FN1_DelName
    pad(order.shipping_address?.address1, 50),
    pad(order.shipping_address?.address2 || '', 50),
    pad(order.shipping_address?.zip, 10),
    pad(order.shipping_address?.city, 50),
    pad(order.shipping_address?.country_code, 2),
    pad(order.shipping_address?.country, 25),
    pad('', 50),                    // FN1_DelExtRef
    pad(order.email, 100),
    pad(order.phone || '', 12),
    pad(order.total_weight, 12),                    // FN1_TotalWeight
    pad('', 20),                    // FN1_ShopID
    pad('', 12),                    // FN1_DeliveryMode
    pad('', 48),                    // FN1_PickupPoint
    pad('', 10),                    // FN1_ClubID
    pad('0', 1),                    // FN1_CustType (0 = private)
    pad('0', 1),                    // FN1_AddrType (0 = street)
  ];

  const FN2 = order.line_items.map((item, index) => [
    pad(`FN2${order.order_number}`, 20),                                   // FN2_RecType
    // pad(order.customer.id, 20, true),                // FN2_OrderNo
    // pad(item.sku || '', 8),                 // FN2_ArticleNo
    pad(item.sku || '', 21),                // FN2_ItemNumber (EAN)
    pad(item.name, 80),                    // FN2_ItemName
    pad(item.quantity, 5, true),            // FN2_Qty
    pad(index + 1, 5, true),                             // <-- Add index (1-based)
    pad(item.price, 12, true),              // FN2_UnitPrice
    pad('', 12),                            // FN2_Discount
  ].join('')).join('\n');

  return `${FN1.join('')}\n${FN2}`;
};
