import { CommunityType, PrismaClient, ChannelType } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const alice = await prisma.user.create({
    data : {
      walletAddress: "Address",
      phoneNumber: "123",
      displayName: "alice",
      username: "alice123",
      email: "alice@prisma.io",
      createdCommunities: {
        create: {
          name: "AliceCommunity",
          description: "Alice's Community",
          profilePic: "",
          tags: ["A", "B"],
          maxMembers: 10,
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
          },
        },
      },
    }
  });
  const bob = await prisma.user.create({
    data: {
      walletAddress: "Address",
      phoneNumber: "456",
      displayName: "bob",
      username: "bob456",
      email: "bob@prisma.io",
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
        create: [
          {
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
            comments: {
              create: {
                content: "First",
                commenter: {
                  connect: {
                    userId: 1
                  }
                }
              }
            },
            likes: {
              connect: {
                userId: 1
              }
            }
          },
          {
            title: "Follow Nexus on Twitter",
            content: "https://twitter.com/nexusgql",
            media: ["A", "B"],
            isPinned: false,
            channel: {
              connect: {
                communityId_name: {
                  communityId: 2,
                  name: "Home"
                }
              }
            }
          },
        ],
      },
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
