// dummy tab data
export const tabs = [
  { name: "Profile", href: "#", current: true },
  { name: "Calendar", href: "#", current: false },
  { name: "Recognition", href: "#", current: false },
];

// dummy profile data
export const profile = {
  name: "NFT_g0d",
  imageUrl:
    "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  coverImageUrl:
    "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  about: `
      <p>Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.</p>
      <p>Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.</p>
    `,
  fields: {
    Phone: "(555) 123-4567",
    Email: "ricardocooper@example.com",
    Title: "Senior Front-End Developer",
    Team: "Product Development",
    Location: "San Francisco",
    Sits: "Oasis, 4th floor",
    Salary: "$145,000",
    Birthday: "June 8, 1990",
  },
};

export const products = [
  {
    id: 1,
    name: "Bearish Bear",
    href: "http://localhost:3000/merchandise/",
    price: "$256",
    description:
      "Get the full lineup of our Basic Tees. Have a fresh shirt all week, and an extra for laundry day.",
    options: "options",
    imageSrc: "/images/bear.jpg",
    imageAlt:
      "Eight shirts arranged on table in black, olive, grey, blue, white, red, mustard, and green.",
  },
  {
    id: 2,
    name: "Basic Bear",
    href: "http://localhost:3000/merchandise/",
    price: "$32",
    description:
      "Look like a visionary CEO and wear the same black t-shirt every day.",
    options: "options",
    imageSrc: "/images/bear.jpg",
    imageAlt: "Front of plain black t-shirt.",
  },
  {
    id: 3,
    name: "Basic Bear 2",
    href: "http://localhost:3000/merchandise/",
    price: "$32",
    description:
      "Look like a visionary CEO and wear the same black t-shirt every day.",
    options: "options",
    imageSrc: "/images/bear.jpg",
    imageAlt: "Front of plain black t-shirt.",
  },
  {
    id: 4,
    name: "Basic Beer 3",
    href: "http://localhost:3000/merchandise/",
    price: "$32",
    description:
      "Look like a visionary CEO and wear the same black t-shirt every day.",
    options: "options",
    imageSrc: "/images/bear.jpg",
    imageAlt: "Front of plain black t-shirt.",
  },
  {
    id: 4,
    name: "Basic Beer 3",
    href: "http://localhost:3000/merchandise/",
    price: "$32",
    description:
      "Look like a visionary CEO and wear the same black t-shirt every day.",
    options: "options",
    imageSrc: "/images/bear.jpg",
    imageAlt: "Front of plain black t-shirt.",
  },
  // More products...
];

export type Community = {
  communityId: number;
  name: string;
  description: string;
  bannerPic: string;
  profilePic: string;
  tags: string[];
  numMembers: number;
};

export type Post = {
  postId: number;
  title: string;
  content: string;
  date: Date;
  media: string[];
  isPinned: boolean;
  creator: {
    userId: string;
    displayName: string;
    profilePic: string;
  };
  likes: number;
  comments: Comment[];
};

export type Comment = {
  commentId: number;
  content: string;
  date: Date;
  commentor: {
    userId: string;
    displayName: string;
    profilePic: string;
  };
  replies: Comment[];
};

export const posts = [
  {
    postId: 1,
    title: "Post 1 Title",
    content: "Post 1 Content",
    date: new Date(),
    media: [
      "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png",
      "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
    ],
    isPinned: false,
    creator: {
      userId: "1",
      displayName: "Creator",
      profilePic: "/images/bear.jpg",
    },
    likes: 0,
    comments: [
      {
        commentId: 1,
        content: "Comment 1",
        date: new Date(),
        commentor: {
          userId: "1",
          displayName: "Creator",
          profilePic: "/images/bear.jpg",
        },
        replies: [],
      },
    ],
  },
  {
    postId: 2,
    title: "Post 2 Title",
    content: "Post 1 Content",
    date: new Date(),
    media: [
      "/images/bear.jpg",
      "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/640px-Image_created_with_a_mobile_phone.png",
    ],
    isPinned: false,
    creator: {
      userId: "1",
      displayName: "Creator",
      profilePic: "/images/bear.jpg",
    },
    likes: 0,
    comments: [
      {
        commentId: 2,
        content: "Comment 2",
        date: new Date(),
        commentor: {
          userId: "1",
          displayName: "Creator",
          profilePic: "/images/bear.jpg",
        },
        replies: [],
      },
      {
        commentId: 3,
        content: "Comment 3",
        date: new Date(),
        commentor: {
          userId: "1",
          displayName: "Creator",
          profilePic: "/images/bear.jpg",
        },
        replies: [
          {
            commentId: 4,
            content: "Comment 4",
            date: new Date(),
            commentor: {
              userId: "1",
              displayName: "Creator",
              profilePic: "/images/bear.jpg",
            },
          },
        ],
      },
    ] as Comment[],
  },
];

export const community = {
  communityId: 1,
  name: "Community Name",
  description: "Community Description",
  bannerPic:
    "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
  profilePic: "/images/bear.jpg",
  tags: ["NFT", "Entertainment", "Fitness"],
  numMembers: 2,
  channels: [
    {
      channelId: 1,
      name: "Home",
    },
    {
      channelId: 2,
      name: "Premium Channel 1",
    },
  ],
};

export const communities = [
  {
    communityId: 1,
    name: "Community Name 1",
    description: "Community Description 1",
    bannerPic:
      "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
    profilePic: "/images/bear.jpg",
    tags: ["NFT", "Entertainment", "Fitness"],
    numMembers: 2,
  },
  {
    communityId: 2,
    name: "Community Name 2",
    description: "Community Description 2",
    bannerPic:
      "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
    profilePic: "/images/bear.jpg",
    tags: ["NFT"],
    numMembers: 1000,
  },
  {
    communityId: 3,
    name: "Community Name 3",
    description: "Community Description 3",
    bannerPic:
      "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
    profilePic: "/images/bear.jpg",
    tags: ["NFT"],
    numMembers: 8,
  },
  {
    communityId: 4,
    name: "Community Name 4",
    description: "Community Description 4",
    bannerPic:
      "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
    profilePic: "/images/bear.jpg",
    tags: ["NFT"],
    numMembers: 10000,
  },
  {
    communityId: 5,
    name: "Community Name 5",
    description: "Community Description 5",
    bannerPic:
      "https://helpx.adobe.com/content/dam/help/en/photoshop/using/convert-color-image-black-white/jcr_content/main-pars/before_and_after/image-before/Landscape-Color.jpg",
    profilePic: "/images/bear.jpg",
    tags: ["NFT"],
    numMembers: 200,
  },
];
