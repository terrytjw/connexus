// dummy tab data
export const tabs = [
  { name: "Profile", href: "#", current: true },
  { name: "Calendar", href: "#", current: false },
  { name: "Recognition", href: "#", current: false },
];

// dummy profile data
export const profile = {
  name: "NFT_g0d",
  imageUrl: "/images/bear.jpg",
  coverImageUrl: "/images/bear.jpg",
  about: `
      <p>Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.</p>
      <p>Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.</p>
    `,
  fields: {
    Phone: "(555) 123-4567",
    Email: "ricardocooper@example.com",
    Title: "Senior Front-End Developer",
    Team: "Product Development",
    Location: "San Francisco",
    Sits: "Oasis, 4th floor",
    Salary: "$145,000",
    Birthday: "June 8, 1990",
  },
};

export const events = [
  {
    eventId: 0,
    title: "string",
    category: "AUTO_BOAT_AIR",
    location: "string",
    eventDurationType: "SINGLE",
    startDate: "string",
    endDate: "string",
    images: ["/images/bear.jpg"],
    summary: "string",
    description: "string",
    visibilityType: "DRAFT",
    privacyType: "PUBLIC",
    tickets: [
      {
        ticketId: 0,
        name: "string",
        quantity: 0,
        price: 0,
        startDate: "string",
        endDate: "string",
        description: "string",
        event: "string",
        promotion: [
          {
            promotionId: 0,
            name: "string",
            promotionType: "LIMITED",
            promotionValue: 0,
            quantity: 0,
            startDate: "string",
            endDate: "string",
            ticket: "string",
          },
        ],
      },
    ],
  },
  {
    eventId: 1,
    title: "string",
    category: "AUTO_BOAT_AIR",
    location: "string",
    eventDurationType: "SINGLE",
    startDate: "string",
    endDate: "string",
    images: ["/images/bear.jpg"],
    summary: "string",
    description: "string",
    visibilityType: "DRAFT",
    privacyType: "PUBLIC",
    tickets: [
      {
        ticketId: 0,
        name: "string",
        quantity: 0,
        price: 0,
        startDate: "string",
        endDate: "string",
        description: "string",
        event: "string",
        promotion: [
          {
            promotionId: 0,
            name: "string",
            promotionType: "LIMITED",
            promotionValue: 0,
            quantity: 0,
            startDate: "string",
            endDate: "string",
            ticket: "string",
          },
        ],
      },
    ],
  },
  {
    eventId: 2,
    title: "string",
    category: "AUTO_BOAT_AIR",
    location: "string",
    eventDurationType: "SINGLE",
    startDate: "string",
    endDate: "string",
    images: ["/images/bear.jpg"],
    summary: "string",
    description: "string",
    visibilityType: "DRAFT",
    privacyType: "PUBLIC",
    tickets: [
      {
        ticketId: 0,
        name: "string",
        quantity: 0,
        price: 0,
        startDate: "string",
        endDate: "string",
        description: "string",
        event: "string",
        promotion: [
          {
            promotionId: 0,
            name: "string",
            promotionType: "LIMITED",
            promotionValue: 0,
            quantity: 0,
            startDate: "string",
            endDate: "string",
            ticket: "string",
          },
        ],
      },
    ],
  },
  {
    eventId: 3,
    title: "string",
    category: "AUTO_BOAT_AIR",
    location: "string",
    eventDurationType: "SINGLE",
    startDate: "string",
    endDate: "string",
    images: ["/images/bear.jpg"],
    summary: "string",
    description: "string",
    visibilityType: "DRAFT",
    privacyType: "PUBLIC",
    tickets: [
      {
        ticketId: 0,
        name: "string",
        quantity: 0,
        price: 0,
        startDate: "string",
        endDate: "string",
        description: "string",
        event: "string",
        promotion: [
          {
            promotionId: 0,
            name: "string",
            promotionType: "LIMITED",
            promotionValue: 0,
            quantity: 0,
            startDate: "string",
            endDate: "string",
            ticket: "string",
          },
        ],
      },
    ],
  },
];

export const products = [
  {
    id: 1,
    name: "Bearish Bear",
    href: "http://localhost:3000/merchandise/",
    price: "$256",
    description:
      "Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.",
    options: "options",
    imageSrc: "/images/bear.jpg",
    imageAlt:
      "Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.",
  },
  {
    id: 2,
    name: "Basic Bear",
    href: "http://localhost:3000/merchandise/",
    price: "$32",
    description:
      "Look like a visionary CEO and wear the same black t-shirt every day.",
    options: "options",
    imageSrc: "/images/bear.jpg",
    imageAlt: "Front of plain black t-shirt.",
  },
  {
    id: 3,
    name: "Basic Bear 2",
    href: "http://localhost:3000/merchandise/",
    price: "$32",
    description:
      "Look like a visionary CEO and wear the same black t-shirt every day.",
    options: "options",
    imageSrc: "/images/bear.jpg",
    imageAlt: "Front of plain black t-shirt.",
  },
  {
    id: 4,
    name: "Basic Beer 3",
    href: "http://localhost:3000/merchandise/",
    price: "$32",
    description:
      "Look like a visionary CEO and wear the same black t-shirt every day.",
    options: "options",
    imageSrc: "/images/bear.jpg",
    imageAlt: "Front of plain black t-shirt.",
  },
  {
    id: 5,
    name: "Basic Beer 3",
    href: "http://localhost:3000/merchandise/",
    price: "$32",
    description:
      "Look like a visionary CEO and wear the same black t-shirt every day.",
    options: "options",
    imageSrc: "/images/bear.jpg",
    imageAlt: "Front of plain black t-shirt.",
  },
  // More products...
];
