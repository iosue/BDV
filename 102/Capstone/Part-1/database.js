
//  CURRENT STRUCTURE OF THIS TEMPORARY 'DB' IS NOT 
//   REFLECTIVE OF THE TRUE DATABASE SCHEMA OR ERD.
//  --------------- WILL BE UPDATED ---------------



const db = {
	users: [
    {
      userId: "U-000",
      firstName: "Adam",
      lastName: "McGod",
      orders: [
        {
          orderId: "O-000",

        }
      ],
      cart: [
        {
          itemId: "I-001",
          quantity: 3
        }
      ]
    }
  ],
	items: [
		{
			itemId: "I-001",
			itemName: "Labubu",
			itemDesc: `
          Zoomorphic elf with exaggerated facial expressions.
          This central figure is Labubu,
          a monster with sharp teeth,
          large ears and a scruffy appearance.
        `,
			price: 26.99,
		},
		{
			itemId: "I-002",
			itemName: "Beanie Babies [Full Collection]",
			itemDesc: `Full collection of every Beanie Baby doll ever made.  CLEARANCE: 96% OFF`,
			price: 7.95,
		},
		{
			itemId: "I-003",
			itemName: "2026 Honda Civic Hatchback",
			itemDesc: `
        2026 Honda Civic Hatchback.
        Sport Touring Hybrid.
        Crystal Black Pearl w Aero Kit & Care Combo.
      `,
			price: 44174.99,
		}
	]
}

module.exports = db
