import {
  PrismaClient,
  CategoryType,
  PrivacyType,
  PromotionType,
  VisibilityType,
  PublishType,
  ChannelType,
  Currency,
  CollectionState,
} from "@prisma/client";
import { saveUser } from "../lib/user";

const prisma = new PrismaClient();

async function generateCommunity() {
  const communities = [
    {
      name: "Valorant",
      description: "Hi there!  Welcome to the Valo Community!",
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/valorant-profilePic.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/valorant-bannerPic.png",
      maxMembers: 67,
      tags: [CategoryType.ENTERTAINMENT],
      creator: {
        connect: {
          userId: 1,
        },
      },
      members: {
        connect: {
          userId: 2,
        },
      },
    },
    {
      name: "Cosplay Kawaii",
      description: "Hi there!  Welcome to the Cosplay Community!",
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/cosplay-profilePic.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/cosplay-bannerPic.jpg",
      maxMembers: 51,
      tags: [CategoryType.ENTERTAINMENT],
      creator: {
        connect: {
          userId: 2,
        },
      },
    },
    {
      name: "Travley",
      description: "Hi there!  Welcome to the Travley Community!",
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/travley-profilePic.png",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/travley-bannerPic.jpg",
      maxMembers: 74,
      tags: [CategoryType.TRAVEL],
      creator: {
        connect: {
          userId: 3,
        },
      },
      members: {
        connect: [{ userId: 1 }, { userId: 2 }],
      },
    },
  ];

  for (const community of communities) {
    await prisma.community.create({
      data: community,
    });
  }
}

async function generateChannel() {
  const channels = [
    {
      name: "Home",
      community: {
        connect: {
          communityId: 1,
        },
      },
      members: {
        connect: {
          userId: 2,
        },
      },
      channelType: ChannelType.REGULAR,
    },
    {
      name: "Home",
      community: {
        connect: {
          communityId: 2,
        },
      },
      channelType: ChannelType.REGULAR,
    },
    {
      name: "Home",
      community: {
        connect: {
          communityId: 3,
        },
      },
      channelType: ChannelType.REGULAR,
      members: {
        connect: [{ userId: 1 }, { userId: 2 }],
      },
    },
  ];

  for (const channel of channels) {
    await prisma.channel.create({
      data: channel,
    });
  }
}

async function generatePost() {
  const posts = [
    {
      title: "New valorant map",
      content: "Have yall played in the Lotus map? There are 3 ways of entry!!",
      media: [
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/valorantnewmap-media.jpg",
      ],
      isPinned: false,
      creator: {
        connect: {
          userId: 1,
        },
      },
      channel: {
        connect: {
          channelId: 1,
        },
      },
      date: new Date("2023-02-22"),
    },
    {
      title: "Anime Fanart",
      content: "I just drew this, what do yall think?",
      media: [
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/anime-media.jpg",
      ],
      isPinned: false,
      channel: {
        connect: {
          channelId: 1,
        },
      },
      creator: {
        connect: {
          userId: 1,
        },
      },
      date: new Date("2023-02-23"),
    },
    {
      title: "Travelling",
      content: "Would love to experience living in a cabin during winter!",
      media: [
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/anime-media.jpg",
      ],
      isPinned: false,
      channel: {
        connect: {
          channelId: 1,
        },
      },
      creator: {
        connect: {
          userId: 1,
        },
      },
      date: new Date("2023-02-24"),
    },
  ];

  for (const post of posts) {
    await prisma.post.create({
      data: post,
    });
  }
}

async function generateComment() {
  const comments = [
    {
      content: "I'm gonna get that!",
      commenter: {
        connect: {
          userId: 1,
        },
      },
      post: {
        connect: {
          postId: 2,
        },
      },
      date: new Date("2023-02-28"),
    },
    {
      content: "So cute!",
      commenter: {
        connect: {
          userId: 1,
        },
      },
      post: {
        connect: {
          postId: 2,
        },
      },
      date: new Date("2023-03-1"),
    },
    {
      content: "Ahhh hot cocoa in that weather",
      commenter: {
        connect: {
          userId: 1,
        },
      },
      post: {
        connect: {
          postId: 2,
        },
      },
      date: new Date("2023-03-2"),
    },
  ];

  for (const comment of comments) {
    await prisma.comment.create({
      data: comment,
    });
  }
}

async function generateUser() {
  const users = [
    {
      email: "jcarrott0@gmail.com",
      username: "jcarrott0#123",
      walletAddress: "0x50fa33ac31a6cb71c3ff6da8d38bd0a1a489e933",
      displayName: "Josh Carrott",
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/josh-profilePic.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/josh-bannerPic.jpg",
      phoneNumber: "+6591896606",
      bio: "Can you swim in Jello?",
    },
    {
      email: "mmaru1@gmail.com",
      username: "mmaru1#321",
      walletAddress: "0xdc52e59d80b3bb31e071cb6564a2812d672f7c9e",
      displayName: "Malanie Maru",
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/malanie-profilePic.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/malanie-bannerPic.jpg",
      phoneNumber: "+6594745436",
      bio: "I do full days of filming and I also schedule livestreams to create a stronger connection with my audience.",
    },
    {
      email: "asauvan2@gmail.com",
      username: "asauvan2#322",
      walletAddress: "0xc45166980e7bf4921668777ca27ea15aef859001",
      displayName: "Alene Sauvan",
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/alene-profilePic.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/alene-bannerPic.jpg",
      phoneNumber: "+6589212984",
      bio: "I flim videos for 2 to 3 hours a day when the weather is good!",
    },
  ];

  for (const user of users) {
    await saveUser(user);
  }
}

async function generateCollection() {
  const collections = [
    {
      collectionName: "Valo Skin Collection",
      description: "This is Valo Skin Collection.",
      fixedPrice: 20.0,
      currency: Currency.USD,
      collectionState: CollectionState.ON_SALE,
      merchandise: {
        create: {
          name: "Sovereign Knife Skin",
          media:
            "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/sovereign-collection-media.png",
          description: "Sovereign Knife Skin",
          totalMerchSupply: 100,
          price: 10,
        },
      },
      creator: {
        connect: {
          userId: 1,
        },
      },
      scAddress: "0x926796E0113DBf4a6964F2015b84452D43697B76",
    },
    {
      collectionName: "Cosplay Collection",
      description: "This is Cosplay Collection.",
      fixedPrice: 20.0,
      currency: Currency.USD,
      collectionState: CollectionState.ON_SALE,
      merchandise: {
        create: {
          name: "Hotel Transylvania Cosplay",
          media:
            "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/cosplay-collection-media.png",
          description: "Hotel Transylvania Cosplay",
          totalMerchSupply: 100,
          price: 10,
        },
      },
      creator: {
        connect: {
          userId: 1,
        },
      },
      scAddress: "0x926796E0113DBf4a6964F2015b84452D43697B76",
    },
    {
      collectionName: "Travel Picture Collection",
      description: "This is Travel Picture Collection.",
      fixedPrice: 20.0,
      currency: Currency.USD,
      collectionState: CollectionState.SOLD,
      merchandise: {
        create: {
          name: "Exploring Monument Valley",
          media:
            "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/travel-collection-media.png",
          description: "cool items",
          totalMerchSupply: 100,
          price: 10,
        },
      },
      creator: {
        connect: {
          userId: 1,
        },
      },
      scAddress: "0x926796E0113DBf4a6964F2015b84452D43697B76",
    },
  ];

  for (const collection of collections) {
    await prisma.collection.create({
      data: collection,
    });
  }
}
async function generateEvent() {
  const events = [
    {
      eventName: "Live Valorant Session with Josh",
      category: CategoryType.ENTERTAINMENT,
      address: {
        create: {
          address1: "1 Singapore Expo",
          address2: "Singapore",
          locationName: "Expo Hall 1",
          postalCode: "486065",
          lat : 1.01, 
          lng: 1.2,
        },
      },
      startDate: new Date("2023-03-22"),
      endDate: new Date("2023-03-25"),
      summary:
        "This is a live valorant seesion with Josh. He will be playing with his fans and answering questions.",
      description:
        "This is a live valorant seesion with Josh. He will be playing with his fans and answering questions.",
      visibilityType: VisibilityType.PUBLISHED,
      privacyType: PrivacyType.PUBLIC,
      tickets: {
        create: [
          {
            name: "General Admission",
            totalTicketSupply: 45,
            price: 10,
            startDate: new Date("2023-02-22"),
            endDate: new Date("2023-02-25"),
            description: "Freebies, photo-taking session and on-stage event!",
            users: { connect: { userId: 1 } },
            currentTicketSupply: 1,
          },
          {
            name: "VIP Pass",
            totalTicketSupply: 50,
            price: 10,
            startDate: new Date("2023-02-22"),
            endDate: new Date("2023-02-25"),
            description: "This is a VIP Pass",
          },
          {
            name: "VVIP Pass",
            totalTicketSupply: 50,
            price: 10,
            startDate: new Date("2023-02-22"),
            endDate: new Date("2023-02-25"),
            description: "This is a VVIP Pass",
          },
        ],
      },
      publishType: PublishType.NOW,
      maxAttendee: 50,
      publishStartDate: new Date("2023-02-22"),
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/valorant-banner.jpeg",
      eventPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/valorant-profile.jpeg",
      scAddress: "0x926796E0113DBf4a6964F2015b84452D43697B76",
    },
    {
      eventName: "Malanie Cosplaying with You",
      category: CategoryType.ENTERTAINMENT,
      address: {
        create: {
          address1: "1 Singapore Expo",
          address2: "Singapore",
          lat : 1.01, 
          lng: 1.2,
          locationName: "Expo Hall 2",
          postalCode: "486065",
        },
      },
      startDate: new Date("2023-03-23"),
      endDate: new Date("2023-03-26"),
      summary:
        "This is a cosplaying event with Malanie. She will be cosplaying as her favourite character and taking photos with her fans.",
      description:
        "This is a cosplaying event with Malanie. She will be cosplaying as her favourite character and taking photos with her fans.",
      visibilityType: VisibilityType.PUBLISHED,
      privacyType: PrivacyType.PUBLIC,
      tickets: {
        create: [
          {
            name: "General Admission",
            totalTicketSupply: 45,
            price: 10,
            startDate: new Date("2023-01-23"),
            endDate: new Date("2023-02-26"),
            description: "Freebies, photo-taking session and on-stage event!",
            users: { connect: [{ userId: 1 }, { userId: 2 }] },
            currentTicketSupply: 2,
          },
          {
            name: "VIP Pass",
            totalTicketSupply: 50,
            price: 100,
            startDate: new Date("2023-01-22"),
            endDate: new Date("2023-02-26"),
            description: "This is a VIP Pass",
          },
          {
            name: "VVIP Pass",
            totalTicketSupply: 50,
            price: 1000,
            startDate: new Date("2023-01-22"),
            endDate: new Date("2023-02-26"),
            description: "This is a VVIP Pass",
          },
        ],
      },
      publishType: PublishType.NOW,
      maxAttendee: 50,
      publishStartDate: new Date("2023-01-22"),
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/cosplay-banner.jpeg",
      eventPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/cosplay-profile.jpeg",
      scAddress: "0x926796E0113DBf4a6964F2015b84452D43697B76",
    },
    {
      eventName:
        "Planning to travel soon? Learn more about Travely that will help solve your itinerary planning troubles and find the best recommendations.",
      category: CategoryType.TRAVEL,
      address: {
        create: {
          address1: "1 Singapore Expo",
          address2: "Singapore",
          lat : 1.01, 
          lng: 1.2,
          locationName: "Expo Hall 3",
          postalCode: "486065",
        },
      },
      startDate: new Date("2023-03-24"),
      endDate: new Date("2023-03-27"),
      summary:
        "This is a travel fair with Travely. They will be showcasing their new app and taking photos with their fans.",
      description:
        "This is a travel fair with Travely. They will be showcasing their new app and taking photos with their fans.",
      visibilityType: VisibilityType.PUBLISHED,
      privacyType: PrivacyType.PUBLIC,
      tickets: {
        create: [
          {
            name: "General Admission",
            totalTicketSupply: 45,
            price: 10,
            startDate: new Date("2023-01-24"),
            endDate: new Date("2023-02-26"),
            description: "Freebies, photo-taking session and on-stage event!",
            users: { connect: [{ userId: 1 }, { userId: 2 }] },
            currentTicketSupply: 2,
          },
          {
            name: "VIP Pass",
            totalTicketSupply: 50,
            price: 100,
            startDate: new Date("2023-01-24"),
            endDate: new Date("2023-02-26"),
            description: "This is a VIP Pass",
          },
          {
            name: "VVIP Pass",
            totalTicketSupply: 50,
            price: 1000,
            startDate: new Date("2023-01-24"),
            endDate: new Date("2023-02-26"),
            description: "This is a VVIP Pass",
          },
        ],
      },
      publishType: PublishType.NOW,
      maxAttendee: 50,
      publishStartDate: new Date("2023-02-22"),
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/travel-banner.jpeg",
      eventPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/travel-profile.jpeg",
      scAddress: "0xax",
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }
}

async function main() {
  await generateUser();
  await generateCommunity();
  await generateChannel();
  await generatePost();
  await generateComment();
  await generateEvent();
  await generateCollection();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
