import { ChannelType } from "./types";

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

const posts = [
  {
    postId: 1,
    title: "Post 1 Title",
    content: "Post 1 Content",
    date: new Date(),
    media: ["/images/bear.jpg", "/images/bear.jpg", "/images/bear.jpg"],
    isPinned: false,
    creator: {
      userId: "1",
      displayName: "Creator",
      profilePic: "/images/bear.jpg",
    },
    likes: 0,
    comments: [
      {
        commentId: 1,
        content: "Comment 1",
        date: new Date(),
        commentor: {
          userId: "1",
          displayName: "Creator 1",
          profilePic: "/images/bear.jpg",
        },
        likes: 0,
        replies: [],
      },
    ],
  },
  {
    postId: 2,
    title: "Post 2 Title",
    content: "Post 1 Content",
    date: new Date(),
    media: ["/images/bear.jpg", "/images/bear.jpg", "/images/bear.jpg"],
    isPinned: false,
    creator: {
      userId: "1",
      displayName: "Creator",
      profilePic: "/images/bear.jpg",
    },
    likes: 0,
    comments: [
      {
        commentId: 2,
        content: "Comment 2",
        date: new Date(),
        commentor: {
          userId: "1",
          displayName: "Creator 2",
          profilePic: "/images/bear.jpg",
        },
        likes: 1,
        replies: [],
      },
      {
        commentId: 3,
        content: "Comment 3",
        date: new Date(),
        commentor: {
          userId: "1",
          displayName: "Creator 3",
          profilePic: "/images/bear.jpg",
        },
        likes: 2,
        replies: [
          {
            commentId: 4,
            content: "Comment 4",
            date: new Date(),
            commentor: {
              userId: "1",
              displayName: "Creator 4",
              profilePic: "/images/bear.jpg",
            },
            likes: 0,
            replies: [],
          },
        ],
      },
    ],
  },
];

const channels = [
  {
    channelId: 1,
    name: "Home",
    channelType: ChannelType.HOME,
    posts: posts,
  },
  {
    channelId: 2,
    name: "Premium Channel 1",
    channelType: ChannelType.PREMIUM,
    posts: posts,
  },
];

export const communities = [
  {
    communityId: 1,
    name: "Community Name 1",
    description: "Community Description 1",
    bannerPic: "/images/bear.jpg",
    profilePic: "/images/bear.jpg",
    tags: ["NFT", "Entertainment", "Fitness"],
    maxMembers: 2,
    numMembers: 2,
    channels: channels,
  },
  {
    communityId: 2,
    name: "Community Name 2",
    description: "Community Description 2",
    bannerPic: "/images/bear.jpg",
    profilePic: "/images/bear.jpg",
    tags: ["NFT"],
    maxMembers: 2,
    numMembers: 1000,
    channels: channels,
  },
  {
    communityId: 3,
    name: "Community Name 3",
    description: "Community Description 3",
    bannerPic: "/images/bear.jpg",
    profilePic: "/images/bear.jpg",
    tags: ["NFT"],
    maxMembers: 2,
    numMembers: 8,
    channels: channels,
  },
  {
    communityId: 4,
    name: "Community Name 4",
    description: "Community Description 4",
    bannerPic: "/images/bear.jpg",
    profilePic: "/images/bear.jpg",
    tags: ["NFT"],
    maxMembers: 2,
    numMembers: 10000,
    channels: channels,
  },
  {
    communityId: 5,
    name: "Community Name 5",
    description: "Community Description 5",
    bannerPic: "/images/bear.jpg",
    profilePic: "/images/bear.jpg",
    tags: ["NFT"],
    maxMembers: 2,
    numMembers: 200,
    channels: channels,
  },
];
