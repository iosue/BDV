CREATE TABLE "Address" (
  "address_id" int,
  "street" varchar(50),
  "city" varchar(50),
  "postal_code" varchar(6),
  PRIMARY KEY ("address_id")
);

CREATE TABLE "User" (
  "user_id" int,
  "full_name" varchar(50),
  "billing_address" int,
  PRIMARY KEY ("user_id"),
  CONSTRAINT "FK_User_billing_address"
    FOREIGN KEY ("billing_address")
      REFERENCES "Address"("address_id")
);

CREATE TABLE "Item_in_Catalogue" (
  "item_id" int,
  "description" varchar(256),
  "price" varchar(6),
  PRIMARY KEY ("item_id")
);

CREATE TABLE "Order" (
  "order_id" int,
  "user_id" int,
  "status" varchar(16),
  "shipping_address" int,
  PRIMARY KEY ("order_id"),
  CONSTRAINT "FK_Order_user_id"
    FOREIGN KEY ("user_id")
      REFERENCES "User"("user_id"),
  CONSTRAINT "FK_Order_shipping_address"
    FOREIGN KEY ("shipping_address")
      REFERENCES "Address"("address_id")
);

CREATE TABLE "Cart" (
  "cart_id" int,
  "user_id" int,
  PRIMARY KEY ("cart_id")
);

CREATE TABLE "Item_in_Order" (
  "cart_item" int,
  "cart_id" int,
  "order_id" int,
  "item_id" int,
  "quantity" int,
  PRIMARY KEY ("cart_item"),
  CONSTRAINT "FK_Item_in_Order_item_id"
    FOREIGN KEY ("item_id")
      REFERENCES "Item_in_Catalogue"("item_id"),
  CONSTRAINT "FK_Item_in_Order_order_id"
    FOREIGN KEY ("order_id")
      REFERENCES "Order"("order_id"),
  CONSTRAINT "FK_Item_in_Order_cart_id"
    FOREIGN KEY ("cart_id")
      REFERENCES "Cart"("cart_id")
);

