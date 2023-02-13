import {
  PrismaClient,
  CategoryType,
  DurationType,
  PrivacyType,
  PromotionType
  VisibilityType,
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await generateEvent();
  await generateUser(); 
  await generateCollection(); 
  await generateCommunity();
} from "@prisma/client";

const prisma = new PrismaClient();

async function generateCommunity() {
  await prisma.community.create({
    data: {
      name: "AliceCommunity",
      description: "Alice's Community",
      profilePic: "",
      tags: ["A", "B"],
      maxMembers: 10,
      creator: {
        connect: {
          userId: 1
        }
      }
    }
  })

  await prisma.community.create({
    data: {
      name: "BobCommunity",
      description: "Bob's Community",
      profilePic: "",
      tags: ["A", "B"],
      maxMembers: 10,
      creator: {
        connect: {
          userId: 2
        }
      }
    }
  })
}

async function generateChannel() {
  await prisma.channel.create({
    data: {
      name: "Home",
      description: "Home Channel",
      community: {
        connect: {
          communityId: 1
        }
      }
    }
  })

  await prisma.channel.create({
    data: {
      name: "Home",
      description: "Home Channel",
      community: {
        connect: {
          communityId: 2
        }
      }
    }
  })
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
            userId: 1
          }
        },
        channel: {
          connect: {
            communityId_name: {
              communityId: 1,
              name: "Home"
            }
          }
        },
    }
  })

  await prisma.post.create({
    data: {
      title: "Follow Prisma on Twitter",
      content: "https://twitter.com/prisma",
      media: ["A", "B"],
      isPinned: false,
      channel: {
        connect: {
          communityId_name: {
            communityId: 2,
            name: "Home"
          }
        }
      },
      creator: {
        connect: {
          userId: 2
        }
      }
    }
  })
}

async function generateComment() {
  await prisma.comment.create({
    data: {
      content: "First",
      commenter: {
        connect: {
          userId: 1
        }
      },
      post: {
        connect: {
          postId: 2
        }
      }
    }
  })
}

async function generateUser(){

  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "Alice",
      username: "Alice", 
      walletAddress : "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      displayName : "Alice", 
      notificationBySMS : false, 
      notificationByEmail : false,
      twitterURL : "cooltwitterurl.com", 
      profilePic: "https://aliceinwonderland.fandom.com/wiki/Alice",
      bannerPic: "https://aliceinwonderland.fandom.com/wiki/Alice",
      posts: {
        create: {
          title: "Check out Prisma with Next.js",
          content: "https://www.prisma.io/nextjs",
          published: true,
        },
      },
    },
  });
  const bob = await prisma.user.upsert({
    where: { email: "bob@prisma.io" },
    update: {},
    create: {
      email: "bob@prisma.io",
      name: "Bob",
      username: "Bob", 
      walletAddress : "0x91234590DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
      displayName : "Bob", 
      notificationBySMS : false, 
      notificationByEmail : false,
      twitterURL : "bobbytwittterURL.com",
      profilePic: "https://aliceinwonderland.fandom.com/wiki/Alice",
      bannerPic: "https://aliceinwonderland.fandom.com/wiki/Alice",
      posts: {
        create: [
          {
            title: "Follow Prisma on Twitter",
            content: "https://twitter.com/prisma",
            published: true,
          },
          {
            title: "Follow Nexus on Twitter",
            content: "https://twitter.com/nexusgql",
            published: true,
          },
        ],
      },
    },
  });
}

async function generateCollection(){

  const collection1 = await prisma.collection.upsert({ 
    where: {description : "very cool collection",},
    update: {}, 
    create:{
      description : "very cool collection",
      fixedPrice : 20.0,
      currency : "USD", 
      collectionState : "CREATED", 
      collections:{
        create: {
          media: "....com" , 
          description: "cool items", 
          numOfMerch : 200, 
        }
      }
    }

  });

  const collection2 = await prisma.collection.upsert({ 
    where: {description : "awesome collections",},
    update: {}, 
    create:{
      description : "awesome collections",
      fixedPrice : 2.0,
      currency : "BTC", 
      collectionState : "CREATED", 
      collections:{
        create: {
          media: "....com" , 
          description: "cool items", 
          numOfMerch : 20, 
        }
      }
    }

  });


  const collection3 = await prisma.collection.upsert({ 
    where: {description : "porsche nfts",},
    update: {}, 
    create:{
      description : "porsche nfts",
      fixedPrice : 20.0,
      currency : "ETH", 
      collectionState : "CREATED", 
      collections:{
        create: {
          media: "....com" , 
          description: "cool items", 
          numOfMerch : 20, 
        }
      }
    }

  });


  const collection4 = await prisma.collection.upsert({ 
    where: {description : "Nike NFT",},
    update: {}, 
    create:{
      description : "NIKE NFT",
      fixedPrice : 20.0,
      currency : "USD", 
      collectionState : "CREATED", 
      collections:{
        create: {
          media: "....com" , 
          description: "cool items", 
          numOfMerch : 2020, 
        }
      }
    }

  });


  const collection5 = await prisma.collection.upsert({ 
    where: {description : "Addidas",},
    update: {}, 
    create:{
      description : "Addidas",
      fixedPrice : 1.0,
      currency : "BTC", 
      collectionState : "CREATED", 
      collections:{
        create: {
          media: "....com" , 
          description: "cool items", 
          numOfMerch : 2500, 
        }
      }
    }

  });
}
async function generateEvent() {
  await prisma.event.create({
    data: {
      title: "Yoga Class",
      category: CategoryType.HEALTH_WELLNESS,
      location: "Singapore Zoo",
      eventDurationType: DurationType.SINGLE,
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
            quantity: 100,
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
            quantity: 100,
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
    },
  });

  await prisma.event.create({
    data: {
      title: "Spin Class",
      category: CategoryType.HEALTH_WELLNESS,
      location: "UTown Square",
      eventDurationType: DurationType.SINGLE,
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
            quantity: 100,
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
            quantity: 100,
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
