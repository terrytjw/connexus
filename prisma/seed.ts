import {
  CategoryType,
  DurationType,
  PrismaClient,
  PrivacyType,
  PromotionType,
  VisibilityType,
} from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
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
