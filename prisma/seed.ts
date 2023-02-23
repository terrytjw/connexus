import {
  PrismaClient,
  CategoryType,
  PrivacyType,
  PromotionType,
  VisibilityType,
  PublishType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function generateCommunity() {
  await prisma.community.create({
    data: {
      name: "AliceCommunity",
      description: "Alice's Community",
      profilePic: "",
      tags: [CategoryType.HOME_LIFESTYLE, CategoryType.FILM_MEDIA_ENTERTAINMENT],
      maxMembers: 10,
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
  });

  await prisma.community.create({
    data: {
      name: "BobCommunity",
      description: "Bob's Community",
      profilePic: "",
      tags: [CategoryType.HOME_LIFESTYLE],
      maxMembers: 10,
      creator: {
        connect: {
          userId: 2,
        },
      },
      members: {
        connect: {
          userId: 1,
        },
      },
    },
  });
}

async function generateChannel() {
  await prisma.channel.create({
    data: {
      name: "Home",
      community: {
        connect: {
          communityId: 1,
        },
      },
    },
  });

  await prisma.channel.create({
    data: {
      name: "Home",
      community: {
        connect: {
          communityId: 2,
        },
      },
    },
  });
}

async function generatePost() {
  await prisma.post.create({
    data: {
      content: "https://www.prisma.io/nextjs",
      media: ["A", "B"],
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
    },
  });

  await prisma.post.create({
    data: {
      content: "https://twitter.com/prisma",
      media: ["A", "B"],
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
    },
  });
}

async function generateComment() {
  await prisma.comment.create({
    data: {
      content: "First",
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
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      username: "Alice",
      walletAddress: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BA5e5",
      displayName: "Alice",
      notificationBySMS: false,
      notificationByEmail: false,
      profilePic: "https://aliceinwonderland.fandom.com/wiki/Alice",
      bannerPic: "https://aliceinwonderland.fandom.com/wiki/Alice",
      phoneNumber: "8399712",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      username: "Bob",
      walletAddress: "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      displayName: "Bob",
      notificationBySMS: false,
      notificationByEmail: false,
      profilePic:
        "https://en.wikipedia.org/wiki/Bob_the_Builder#/media/File:Bob_the_Builder_logo.svg",
      bannerPic:
        "https://en.wikipedia.org/wiki/Bob_the_Builder#/media/File:Bob_the_Builder_logo.svg",
      phoneNumber: "8399712",
    },
  });
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
