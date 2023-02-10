import { CommunityType, PrismaClient, ChannelType } from "@prisma/client";
const prisma = new PrismaClient();

async function generateUser() {
  await prisma.user.createMany({
    data : [
      {
        walletAddress: "Address",
        phoneNumber: "123",
        displayName: "alice",
        username: "alice123",
        email: "alice@prisma.io",
      },
      {
        walletAddress: "Address",
        phoneNumber: "456",
        displayName: "bob",
        username: "bob456",
        email: "bob@prisma.io"
      }
    ]
  })
}

async function generateCommunity() {
  await prisma.community.create({
    data: {
      name: "AliceCommunity",
      description: "Alice's Community",
      profilePic: "",
      tags: ["A", "B"],
      maxMembers: 10,
      communityType: CommunityType.NFT,
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
      communityType: CommunityType.NFT,
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

async function main() {
  await generateUser();
  await generateCommunity();
  await generateChannel();
  await generatePost();
  await generateComment();
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