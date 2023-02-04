import { CommunityType, PrismaClient, PrivacyType, ChannelType } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@prisma.io" },
    update: {},
    create: {
      email: "alice@prisma.io",
      name: "Alice",
      createdCommunities: {
        create: {
          name: "AliceCommunity",
          description: "Alice's Community",
          profilePic: "",
          tags: ["A", "B"],
          maxMembers: 10,
          privacyType: PrivacyType.PUBLIC,
          communityType: CommunityType.NFT,
          channels: {
            create: {
              name: "Home",
              description: "Home Channel",
              channelType: ChannelType.REGULAR
            }
          }
        }       
      },
      posts: {
        create: {
          title: "Check out Prisma with Next.js",
          content: "https://www.prisma.io/nextjs",
          media: ["A", "B"],
          isPinned: false,
          channel: {
            connect: {
              communityId_name: {
                communityId: 1,
                name: "Home"
              }
            }
          }
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
      joinedChannels: {
        create: {
          channel: {
            connect: {
              communityId_name: {
                communityId: 1,
                name: "Home"
              }
            }
          }
        }
      },
      createdCommunities: {
        create: {
          name: "BobCommunity",
          description: "Bob's Community",
          profilePic: "",
          tags: ["A", "B"],
          maxMembers: 10,
          privacyType: PrivacyType.PUBLIC,
          communityType: CommunityType.NFT,
          channels: {
            create: {
              name: "Home",
              description: "Home Channel",
              channelType: ChannelType.REGULAR
            }
          }
        }       
      },
      // posts: {
      //   create: [
      //     {
      //       title: "Follow Prisma on Twitter",
      //       content: "https://twitter.com/prisma",
      //       published: true,
      //     },
      //     {
      //       title: "Follow Nexus on Twitter",
      //       content: "https://twitter.com/nexusgql",
      //       published: true,
      //     },
      //   ],
      // },
    },
  });
  console.log({ alice, bob });
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
