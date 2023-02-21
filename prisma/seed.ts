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
      tags: ["LIFESTYLE", "ENTERTAINMENT"],
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
      tags: ["LIFESTYLE"],
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
      description: "Home Channel",
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
      description: "Home Channel",
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
      title: "Check out Prisma with Next.js",
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
      title: "Follow Prisma on Twitter",
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
  await prisma.user.upsert({
    where: { email: "tenderloin@prisma.io" },
    update: {},
    create: {
      email: "tenderloin@prisma.io",
      username: "Tenderloin",
      walletAddress: "0x95222290ssDD7278Aa3Ddd389Cc1E1d165CC4BA5e5",
      displayName: "Permanent Homie",
      notificationBySMS: false,
      notificationByEmail: false,
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/pic1.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/banner1.jpg",
      phoneNumber: "8399712",
      bio: "Hi i stay in the Tenderloin",
    },
  });

  await prisma.user.upsert({
    where: { email: "chinkchonk@prisma.io" },
    update: {},
    create: {
      email: "chinkchonk@prisma.io",
      username: "chinkchonk",
      walletAddress: "0x95222dsds290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      displayName: "chinkchonk ni de ding dong",
      notificationBySMS: false,
      notificationByEmail: false,
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/pic2.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/banner2.jpg",
      phoneNumber: "8399712",
      bio: "I am chinkchonk",
    },
  });

  await prisma.user.upsert({
    where: { email: "celine@prisma.io" },
    update: {},
    create: {
      email: "celine@prisma.io",
      username: "celine",
      walletAddress: "0x9522ss2290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      displayName: "chinkchonk ni de ding dong",
      notificationBySMS: false,
      notificationByEmail: false,
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/pic3.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/banner3.jpg",
      phoneNumber: "8399712",
      bio: "I am celine chinkchonk",
    },
  });

  await prisma.user.upsert({
    where: { email: "allah@prisma.io" },
    update: {},
    create: {
      email: "allah@prisma.io",
      username: "allah",
      walletAddress: "0x95222290DDsd7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      displayName: "allah ni de ding dong",
      notificationBySMS: false,
      notificationByEmail: false,
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/pic4.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/banner4.jpg",
      phoneNumber: "8399712",
      bio: "I am allah hehe",
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
