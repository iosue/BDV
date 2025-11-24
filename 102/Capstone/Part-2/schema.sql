CREATE TABLE "Payment_Type" (
  "pay_type_id" int,
  "value" varchar(32),
  PRIMARY KEY ("pay_type_id")
);

CREATE TABLE "Country" (
  "country_id" int,
  "name" varchar(32),
  PRIMARY KEY ("country_id")
);

CREATE TABLE "User" (
  "user_id" int,
  "full_name" varchar(50),
  "email" varchar(50),
  "password" varchar(32),
  PRIMARY KEY ("user_id")
);

CREATE TABLE "Address" (
  "address_id" int,
  "user_id" int,
  "street" varchar(50),
  "city" varchar(50),
  "postal_code" varchar(6),
  "country_id" int,
  PRIMARY KEY ("address_id"),
  CONSTRAINT "FK_Address_country_id"
    FOREIGN KEY ("country_id")
      REFERENCES "Country"("country_id"),
  CONSTRAINT "FK_Address_user_id"
    FOREIGN KEY ("user_id")
      REFERENCES "User"("user_id")
);

CREATE TABLE "User_Pay" (
  "payer_id" int,
  "user_id" int,
  "pay_type_id" int,
  "acct_number" int,
  "expiry_date" date,
  "billing_address" int,
  PRIMARY KEY ("payer_id"),
  CONSTRAINT "FK_User_Pay_pay_type_id"
    FOREIGN KEY ("pay_type_id")
      REFERENCES "Payment_Type"("pay_type_id"),
  CONSTRAINT "FK_User_Pay_billing_address"
    FOREIGN KEY ("billing_address")
      REFERENCES "Address"("address_id"),
  CONSTRAINT "FK_User_Pay_user_id"
    FOREIGN KEY ("user_id")
      REFERENCES "User"("user_id")
);

CREATE TABLE "Item_Family" (
  "item_id" int,
  "name" varchar(32),
  "description" text,
  PRIMARY KEY ("item_id")
);

CREATE TABLE "Item_Variant" (
  "SKU" int,
  "item_id" int,
  "description" text,
  "size" varchar(4),
  "color" varchar(16),
  "price" decimal(8,2),
  PRIMARY KEY ("SKU"),
  CONSTRAINT "FK_Item_Variant_item_id"
    FOREIGN KEY ("item_id")
      REFERENCES "Item_Family"("item_id")
);

CREATE TABLE "Order_Status" (
  "status_code" int,
  "status" varchar(32),
  PRIMARY KEY ("status_code")
);

CREATE TABLE "Order" (
  "order_id" int,
  "user_id" int,
  "pay_id" int,
  "order_date" date,
  "shipping_address" int,
  "shipping_date" date,
  "order_total" decimal(8,2),
  "status" int,
  PRIMARY KEY ("order_id"),
  CONSTRAINT "FK_Order_pay_id"
    FOREIGN KEY ("pay_id")
      REFERENCES "User_Pay"("payer_id"),
  CONSTRAINT "FK_Order_status"
    FOREIGN KEY ("status")
      REFERENCES "Order_Status"("status_code"),
  CONSTRAINT "FK_Order_shipping_address"
    FOREIGN KEY ("shipping_address")
      REFERENCES "Address"("address_id"),
  CONSTRAINT "FK_Order_user_id"
    FOREIGN KEY ("user_id")
      REFERENCES "User"("user_id")
);

CREATE TABLE "Order_Line" (
  "line_id" int,
  "order_id" int,
  "SKU" int,
  "quantity" int,
  "price" decimal(8,2),
  PRIMARY KEY ("line_id"),
  CONSTRAINT "FK_Order_Line_SKU"
    FOREIGN KEY ("SKU")
      REFERENCES "Item_Variant"("SKU"),
  CONSTRAINT "FK_Order_Line_order_id"
    FOREIGN KEY ("order_id")
      REFERENCES "Order"("order_id")
);

CREATE TABLE "Cart" (
  "cart_id" int,
  "user_id" int,
  PRIMARY KEY ("cart_id")
);

CREATE TABLE "Cart_Line" (
  "line_id" int,
  "cart_id" int,
  "item_id" int,
  "quantity" int,
  PRIMARY KEY ("line_id"),
  CONSTRAINT "FK_Cart_Line_cart_id"
    FOREIGN KEY ("cart_id")
      REFERENCES "Cart"("cart_id"),
  CONSTRAINT "FK_Cart_Line_item_id"
    FOREIGN KEY ("item_id")
      REFERENCES "Item_Variant"("SKU")
);

