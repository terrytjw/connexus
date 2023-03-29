import {
  PrismaClient,
  CategoryType,
  PrivacyType,
  VisibilityType,
  PublishType,
  ChannelType,
  Currency,
  CollectionState,
  TicketType,
  Ticket,
  CommunityAnalyticsTimestamp,
} from "@prisma/client";
import { saveUser } from "../lib/prisma/user-prisma";
import { retrieveEventInfo } from "../lib/prisma/event-prisma";
import {
  TicketWithUser,
  saveUserTickets,
} from "../lib/prisma/user-ticket-prisma";
import { todayMinus } from "../utils/date-util";
import { getRandomInt } from "../utils/math-util";

const prisma = new PrismaClient();

async function generateCommunity() {

  const analyticsTimestamps: any[][] = [[],[],[]];
  for (let arr of analyticsTimestamps) {
    let members = 10;
    let premiumMembers = 5;
    let clicks = 20;
    for (let i = 7; i > 0; i--) {
      arr.push({
        members: getRandomInt(members, members += 10),
        premiumMembers: getRandomInt(premiumMembers, premiumMembers += 5),
        clicks: getRandomInt(0, clicks),
        date: todayMinus(i),
      })
    }
  }

  const communities = [
    {
      name: "Valorant",
      description: "Hi there!  Welcome to the Valo Community!",
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/community/valorant-profilePic.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/community/valorant-bannerPic.png",
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
      analyticsTimestamps: {
        create: analyticsTimestamps[0]
      },
      clicks: 200
    },
    {
      name: "Cosplay Kawaii",
      description: "Hi there!  Welcome to the Cosplay Community!",
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/community/cosplay-profilePic.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/community/cosplay-bannerPic.jpg",
      maxMembers: 51,
      tags: [CategoryType.ENTERTAINMENT],
      creator: {
        connect: {
          userId: 2,
        },
      },
      analyticsTimestamps: {
        create: analyticsTimestamps[1]
      },
      clicks: 200
    },
    {
      name: "Travley",
      description: "Hi there!  Welcome to the Travley Community!",
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/community/travley-profilePic.png",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/community/travley-bannerPic.jpg",
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
      analyticsTimestamps: {
        create: analyticsTimestamps[2]
      },
      clicks: 200
    },
  ];

  for (const community of communities) {
    await prisma.community.create({
      data: community,
    });
  }
}

async function generateChannel() {
  
  const analyticsTimestamps: any[][] = [[],[],[]];
  for (let arr of analyticsTimestamps) {
    let likes = 20;
    let comments = 2;

    for (let i = 7; i > 0; i--) {
      likes = getRandomInt(likes, likes += 10);
      comments = getRandomInt(comments, comments += 5),
      arr.push({
        likes: likes,
        comments: comments,
        engagement: (likes + comments) / 500,
        date: todayMinus(i)
      })
    }
  }
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
      analyticsTimestamps: {
        create: analyticsTimestamps[0]
      }
    },
    {
      name: "Home",
      community: {
        connect: {
          communityId: 2,
        },
      },
      channelType: ChannelType.REGULAR,
      analyticsTimestamps: {
        create: analyticsTimestamps[1]
      }
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
      analyticsTimestamps: {
        create: analyticsTimestamps[2]
      }
    },
  ];

  for (const channel of channels) {
    await prisma.channel.create({
      data: channel,
    });
  }
}

async function generateQuestion() {
  const questions = [
    {
      question: "Who's your favourite agent?",
      answer: "Jett!",
      isAnon: false,
      channel: {
        connect: {
          channelId: 1
        }
      },
      user: {
        connect: {
          userId: 2
        }
      }
    },
    {
      question: "When is the best time to visit Europe?",
      answer: "We recommend avoiding the summer months, and visiting during April/May or September/October instead, when crowds are thinner",
      isAnon: false,
      channel: {
        connect: {
          channelId: 3
        }
      },
      user: {
        connect: {
          userId: 1
        }
      }
    },
  ]

  for (const question of questions) {
    await prisma.question.create({
      data: question,
    });
  }
}

async function generatePost() {

  const posts = [
    {
      content: "Have yall played in the Lotus map? There are 3 ways of entry!!",
      media: [
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/post/valorantnewmap-media.jpg",
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
      content: "I just drew this, what do yall think?",
      media: [
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/post/anime-media.jpg",
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
      content: "Would love to experience living in a cabin during winter!",
      media: [
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/post/anime-media.jpg",
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
      username: "jcarrott0",
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
      username: "mmaru1",
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
      username: "asauvan2",
      walletAddress: "0xc45166980e7bf4921668777ca27ea15aef859001",
      displayName: "Alene Sauvan",
      profilePic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/alene-profilePic.jpg",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/alene-bannerPic.jpg",
      phoneNumber: "+6589212984",
      bio: "I flim videos for 2 to 3 hours a day when the weather is good!",
    },
    {
      email: "connexaofficial@gmail.com",
      username: "connexa crypto",
      walletAddress: "0xD35F4E9063fC00fa45aB5596966cCaC504AaC368",
      displayName: "Connexa Crypto",
      profilePic:
        "https://lh3.googleusercontent.com/a/AGNmyxY7B4XC3FpA8d_swUELfrEvBg11sVLz6iUNIa86=s96-c",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/alene-bannerPic.jpg",
      phoneNumber: "+6586582648",
      bio: "I film tiktok for a day and I also schedule livestreams to create a stronger connection with my audience.",
    },
    {
      email: "johndoe@gmail.com",
      username: "JohnDoe81",
      walletAddress: "0xAcC67Ff8C0f9aB75FfE1f1B54625cB8C80Df2Cf2",
      displayName: "John Doe",
      profilePic:
        "https://lh3.googleusercontent.com/a/AGNmyxY7B4XC3FpA8d_swUELfrEvBg11sVLz6iUNIa86=s96-c",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/alene-bannerPic.jpg",
      phoneNumber: "+14155552671",
      bio: "I'm a freelance web developer and I love creating stunning websites for businesses and individuals alike.",
    },

    {
      email: "janedoe@gmail.com",
      username: "JaneDoe23",
      walletAddress: "0x6aA81d37Bb04853E17eCbeD0709eA8242D4B0B4c",
      displayName: "Jane Doe",
      profilePic:
        "https://lh3.googleusercontent.com/a/AGNmyxY7B4XC3FpA8d_swUELfrEvBg11sVLz6iUNIa86=s96-c",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/alene-bannerPic.jpg",
      phoneNumber: "+12024567890",
      bio: "I'm a fitness enthusiast and personal trainer. I love helping people achieve their health and fitness goals.",
    },

    {
      email: "smithjones@gmail.com",
      username: "SmithJones",
      walletAddress: "0x8Dd6c67B6bCbc42B06cdd8eBcE794C5D0C812799",
      displayName: "Smith Jones",
      profilePic:
        "https://lh3.googleusercontent.com/a/AGNmyxY7B4XC3FpA8d_swUELfrEvBg11sVLz6iUNIa86=s96-c",
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/alene-bannerPic.jpg",
      phoneNumber: "+441234567890",
      bio: "I'm a freelance writer and I love creating engaging content for businesses and individuals.",
    },
  ];

  for (const user of users) {
    await saveUser(user);
  }
}

async function generateCollection() {

  const analyticsTimestamps: any[][] = [[],[],[]];
  for (let arr of analyticsTimestamps) {
    for (let i = 7; i > 0; i--) {
      const merchSold = getRandomInt(0, 20)
      const revenue = merchSold * 3
      arr.push({
        merchSold: merchSold,
        revenue: revenue,
        clicks: getRandomInt(0, 10),
        date: todayMinus(i)
      })
    }
  }
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
          image:
            "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/sovereign-collection-media.png",
          totalMerchSupply: 100,
          currMerchSupply: 31,
          price: 20.0,
          users: {
            connect: { userId: 4 },
          },
        },
      },
      creator: {
        connect: {
          userId: 4,
        },
      },
      scAddress: "0x926796E0113DBf4a6964F2015b84452D43697B76",
      analyticsTimestamps: {
        create: analyticsTimestamps[0]
      },
      clicks: 100
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
          image:
            "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/cosplay-collection-media.jpg",
          totalMerchSupply: 100,
          currMerchSupply: 54,
          price: 20.0,
          users: {
            connect: { userId: 4 },
          },
        },
      },
      creator: {
        connect: {
          userId: 4,
        },
      },
      analyticsTimestamps: {
        create: analyticsTimestamps[1]
      },
      scAddress: "0x926796E0113DBf4a6964F2015b84452D43697B76",
      clicks: 100
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
          image:
            "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/travel-collection-media.jpg",
          totalMerchSupply: 100,
          currMerchSupply: 12,
          price: 20.0,
          users: {
            connect: { userId: 4 },
          },
        },
      },
      creator: {
        connect: {
          userId: 4,
        },
      },
      analyticsTimestamps: {
        create: analyticsTimestamps[2]
      },
      scAddress: "0x926796E0113DBf4a6964F2015b84452D43697B76",
      clicks: 100
    },
  ];

  for (const collection of collections) {
    await prisma.collection.create({
      data: collection,
    });
  }
}
async function generateEvent() {

  const analyticsTimestamps: any[][] = [[],[],[]];
  for (let arr of analyticsTimestamps) {
    let likes = 10;
    for (let i = 7; i > 0; i--) {
      const ticketsSold = getRandomInt(0, 20)
      const revenue = ticketsSold * 5;
      likes += 10;
      arr.push({
        ticketsSold: ticketsSold,
        revenue: revenue,
        clicks: getRandomInt(0, 10),
        likes: getRandomInt(likes, likes += 10),
        date: todayMinus(i)
      })
    }
  }
  const events = [
    {
      creator: {
        connect: { userId: 4 },
      },
      analyticsTimestamps: {
        create: analyticsTimestamps[0]
      },
      eventName: "Live Valorant Session with Josh",
      category: CategoryType.ENTERTAINMENT,
      address: {
        create: {
          address1: "1 Singapore Expo",
          address2: "Singapore",
          locationName: "Expo Hall 1",
          postalCode: "486065",
          lat: 1.01,
          lng: 1.2,
        },
      },
      startDate: new Date("2023-01-22"),
      endDate: new Date("2023-01-25"),
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
            users: { connect: [{ userId: 4 }, { userId: 5 }, { userId: 6 }] },
            currentTicketSupply: 20,
            ticketType: TicketType.ON_SALE,
          },
          {
            name: "VIP Pass",
            totalTicketSupply: 50,
            price: 10,
            startDate: new Date("2023-02-22"),
            endDate: new Date("2023-02-25"),
            description: "This is a VIP Pass",
            currentTicketSupply: 5,
            ticketType: TicketType.ON_SALE,
          },
          {
            name: "VVIP Pass",
            totalTicketSupply: 50,
            price: 10,
            startDate: new Date("2023-02-22"),
            endDate: new Date("2023-02-25"),
            description: "This is a VVIP Pass",
            currentTicketSupply: 3,
            ticketType: TicketType.ON_SALE,
          },
        ],
      },
      promotion: {
        create: [
          {
            name: "EARLYBIRD",
            promotionValue: 10,
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
      scAddress: "0x93F4B7386b29760c6586b5Ccb522C4E87C51c117",
      raffles: {
        create: [
          {
            isEnabled: false,
            rafflePrizes: {
              create: [
                {
                  name: "Raffle Prize 1",
                },
              ],
            },
          },
        ],
      },
      clicks: 100
    },
    {
      creator: {
        connect: { userId: 4 },
      },
      analyticsTimestamps: {
        create: analyticsTimestamps[1]
      },
      eventName: "Malanie Cosplaying with You",
      category: CategoryType.ENTERTAINMENT,
      address: {
        create: {
          address1: "1 Singapore Expo",
          address2: "Singapore",
          lat: 1.01,
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
            ticketType: TicketType.ON_SALE,
          },
          {
            name: "VIP Pass",
            totalTicketSupply: 50,
            price: 100,
            startDate: new Date("2023-01-22"),
            endDate: new Date("2023-02-26"),
            description: "This is a VIP Pass",
            ticketType: TicketType.ON_SALE,
          },
          {
            name: "VVIP Pass",
            totalTicketSupply: 50,
            price: 1000,
            startDate: new Date("2023-01-22"),
            endDate: new Date("2023-02-26"),
            description: "This is a VVIP Pass",
            ticketType: TicketType.ON_SALE,
          },
        ],
      },
      publishType: PublishType.NOW,
      maxAttendee: 145,
      publishStartDate: new Date("2023-01-22"),
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/cosplay-banner.jpeg",
      eventPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/cosplay-profile.jpeg",
      scAddress: "0xA4c5d3D268b749f0417f0767b4903545F02194b0",
      clicks: 100
    },
    {
      creator: {
        connect: { userId: 4 },
      },
      analyticsTimestamps: {
        create: analyticsTimestamps[2]
      },
      eventName:
        "Planning to travel soon? Learn more about Travely that will help solve your itinerary planning troubles and find the best recommendations.",
      category: CategoryType.TRAVEL,
      address: {
        create: {
          address1: "1 Singapore Expo",
          address2: "Singapore",
          lat: 1.01,
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
            ticketType: TicketType.ON_SALE,
          },
          {
            name: "VIP Pass",
            totalTicketSupply: 50,
            price: 100,
            startDate: new Date("2023-01-24"),
            endDate: new Date("2023-02-26"),
            description: "This is a VIP Pass",
            ticketType: TicketType.ON_SALE,
          },
          {
            name: "VVIP Pass",
            totalTicketSupply: 50,
            price: 1000,
            startDate: new Date("2023-01-24"),
            endDate: new Date("2023-02-26"),
            description: "This is a VVIP Pass",
            ticketType: TicketType.ON_SALE,
          },
        ],
      },
      publishType: PublishType.NOW,
      maxAttendee: 145,
      publishStartDate: new Date("2023-02-22"),
      bannerPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/travel-banner.jpeg",
      eventPic:
        "https://ewxkkwolfryfoidlycjr.supabase.co/storage/v1/object/public/user-profile/travel-profile.jpeg",
      scAddress: "0x2eC4AA6839328e9Fa2912Aa198a0Bfb06711e329",
      clicks: 100
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }
}

async function generateUserWithTicket() {
  const event = await retrieveEventInfo(1);
  const tickets =
    (event?.tickets as TicketWithUser[]) ?? ([] as TicketWithUser[]);
  await saveUserTickets(tickets);
}

async function main() {
  await generateUser();
  await generateCommunity();
  await generateChannel();
  await generateQuestion();
  await generatePost();
  await generateComment();
  await generateEvent();
  await generateCollection();
  await generateUserWithTicket();
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
