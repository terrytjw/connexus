import {
  PrismaClient,
  CategoryType,
  PrivacyType,
  PromotionType,
  VisibilityType,
  PublishType,
  ChannelType,
} from "@prisma/client";

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
        connect: { userId: 1 },
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
  await prisma.comment.create({
    data: {
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
    },
  });
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
      phoneNumber: "++6594745436",
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
      phoneNumber: "++6589212984",
      bio: "I flim videos for 2 to 3 hours a day when the weather is good!",
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

async function generateCollection() {
  const collection1 = await prisma.collection.upsert({
    where: { description: "very cool collection" },
    update: {},
    create: {
      description: "very cool collection",
      fixedPrice: 20.0,
      currency: "USD",
      collectionState: "CREATED",
      collections: {
        create: {
          media: "....com",
          description: "cool items",
          numOfMerch: 200,
        },
      },
      creator: {
        connect: {
          userId: 1,
        },
      },
    },
  });
}
async function generateEvent() {
  await prisma.event.create({
    data: {
      eventName: "Yoga Class",
      category: CategoryType.HEALTH_WELLNESS,
      address: {
        create: {
          address1: "123 Main St",
          address2: "Apt 1",
          locationName: "San Francisco",
          postalCode: "31231",
        },
      },
      startDate: new Date(),
      endDate: new Date(),
      images: [],
      summary:
        "A yoga class typically involves physical postures, breathing exercises, meditation, and relaxation techniques.",
      description: "This is a yoga class",
      visibilityType: VisibilityType.DRAFT,
      privacyType: PrivacyType.PUBLIC,
      tickets: {
        create: [
          {
            name: "General Admission",
            totalTicketSupply: 100,
            price: 10,
            startDate: new Date(),
            endDate: new Date(),
            description: "General Admission",
            promotion: {
              create: [
                {
                  name: "Early Bird",
                  promotionType: PromotionType.UNLIMITED,
                  promotionValue: 10,
                  quantity: 0,
                  startDate: new Date(),
                  endDate: new Date(),
                },
                {
                  name: "Comedy Club",
                  promotionType: PromotionType.LIMITED,
                  promotionValue: 20,
                  quantity: 50,
                  startDate: new Date(),
                  endDate: new Date(),
                },
              ],
            },
          },
          {
            name: "VIP Pass",
            totalTicketSupply: 100,
            price: 10,
            startDate: new Date(),
            endDate: new Date(),
            description: "This is a VIP Pass",
            promotion: {
              create: [
                {
                  name: "Early Bird",
                  promotionType: PromotionType.UNLIMITED,
                  promotionValue: 10,
                  quantity: 0,
                  startDate: new Date(),
                  endDate: new Date(),
                },
                {
                  name: "Comedy Club",
                  promotionType: PromotionType.LIMITED,
                  promotionValue: 20,
                  quantity: 50,
                  startDate: new Date(),
                  endDate: new Date(),
                },
              ],
            },
          },
        ],
      },
      publishType: PublishType.NOW,
    },
  });

  await prisma.event.create({
    data: {
      eventName: "Spin Class",
      category: CategoryType.HEALTH_WELLNESS,
      address: {
        create: {
          address1: "123 Main St",
          address2: "Apt 1",
          locationName: "New York",
          postalCode: "31231",
        },
      },
      startDate: new Date(),
      endDate: new Date(),
      images: [],
      summary:
        "A spin class is a high-intensity, group fitness class that typically takes place on stationary bicycles. Participants follow a guided workout that simulates outdoor cycling and can include intervals of high-intensity sprints and hill climbs, as well as periods of recovery. ",
      description: "This is a spin class",
      visibilityType: VisibilityType.DRAFT,
      privacyType: PrivacyType.PUBLIC,
      tickets: {
        create: [
          {
            name: "General Admission",
            totalTicketSupply: 100,
            price: 10,
            startDate: new Date(),
            endDate: new Date(),
            description: "General Admission",
            promotion: {
              create: [
                {
                  name: "Early Bird",
                  promotionType: PromotionType.UNLIMITED,
                  promotionValue: 10,
                  quantity: 0,
                  startDate: new Date(),
                  endDate: new Date(),
                },
                {
                  name: "Comedy Club",
                  promotionType: PromotionType.LIMITED,
                  promotionValue: 20,
                  quantity: 50,
                  startDate: new Date(),
                  endDate: new Date(),
                },
              ],
            },
          },
          {
            name: "VIP Pass",
            totalTicketSupply: 100,
            price: 10,
            startDate: new Date(),
            endDate: new Date(),
            description: "This is a VIP Pass",
            promotion: {
              create: [
                {
                  name: "Early Bird",
                  promotionType: PromotionType.UNLIMITED,
                  promotionValue: 10,
                  quantity: 0,
                  startDate: new Date(),
                  endDate: new Date(),
                },
                {
                  name: "Comedy Club",
                  promotionType: PromotionType.LIMITED,
                  promotionValue: 20,
                  quantity: 50,
                  startDate: new Date(),
                  endDate: new Date(),
                },
              ],
            },
          },
        ],
      },
      publishType: PublishType.NOW,
    },
  });

  await prisma.event.create({
    data: {
      eventName: "Boxing Class",
      category: CategoryType.HEALTH_WELLNESS,
      address: {
        create: {
          address1: "123 Main St",
          address2: "Apt 1",
          locationName: "Tenderloin",
          postalCode: "31231",
        },
      },
      startDate: new Date(),
      endDate: new Date(),
      images: [],
      summary:
        "A yoga class typically involves physical postures, breathing exercises, meditation, and relaxation techniques.",
      description: "This is a yoga class",
      visibilityType: VisibilityType.DRAFT,
      privacyType: PrivacyType.PUBLIC,
      tickets: {
        create: [
          {
            name: "General Admission",
            totalTicketSupply: 100,
            price: 10,
            startDate: new Date(),
            endDate: new Date(),
            description: "General Admission",
            promotion: {
              create: [
                {
                  name: "Early Bird",
                  promotionType: PromotionType.UNLIMITED,
                  promotionValue: 10,
                  quantity: 0,
                  startDate: new Date(),
                  endDate: new Date(),
                },
                {
                  name: "Comedy Club",
                  promotionType: PromotionType.LIMITED,
                  promotionValue: 20,
                  quantity: 50,
                  startDate: new Date(),
                  endDate: new Date(),
                },
              ],
            },
          },
          {
            name: "VIP Pass",
            totalTicketSupply: 100,
            price: 10,
            startDate: new Date(),
            endDate: new Date(),
            description: "This is a VIP Pass",
            promotion: {
              create: [
                {
                  name: "Early Bird",
                  promotionType: PromotionType.UNLIMITED,
                  promotionValue: 10,
                  quantity: 0,
                  startDate: new Date(),
                  endDate: new Date(),
                },
                {
                  name: "Comedy Club",
                  promotionType: PromotionType.LIMITED,
                  promotionValue: 20,
                  quantity: 50,
                  startDate: new Date(),
                  endDate: new Date(),
                },
              ],
            },
          },
        ],
      },
      publishType: PublishType.NOW,
    },
  });
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
