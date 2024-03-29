import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  CollectionWithMerchAndPremiumChannel,
  registerCollectionClick,
} from "../lib/api-helpers/collection-api";

type CollectionGridItemProps = {
  item: CollectionWithMerchAndPremiumChannel;
};
const CollectionGridItem = ({ item }: CollectionGridItemProps) => {
  const router = useRouter();

  if (!item) return <Skeleton height={350} />;

  return (
    <Link
      href={`/merchandise/${item.collectionId}`}
      className="group rounded-lg p-2 text-sm hover:bg-gray-200 hover:shadow-md"
      onClick={async () => {
        if (router.asPath.includes("communities")) {
          localStorage.setItem("communityUrl", router.asPath);
        }

        await registerCollectionClick(item.collectionId);
      }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 transition-all">
        <Image
          fill
          sizes="100vw, (min-width: 640px) 50vw, (min-width: 1024px) 33vw, (min-width: 1536px) 25vw"
          className="object-cover object-center"
          src={item.merchandise[0].image}
          alt="Collection image"
        />
        <div className="absolute inset-x-0 top-0 flex h-full items-end justify-between overflow-hidden rounded-lg p-4">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
          />
          <p className="relative text-lg font-semibold text-white">
            ${item.fixedPrice}
          </p>
        </div>
      </div>
      <h3 className="mt-4 text-xl font-bold text-gray-900">
        {item.collectionName}
      </h3>
      <p className="mt-2 text-sm text-gray-500">{item.description}</p>
      {item.premiumChannel ? (
        <div className="mt-2 text-sm font-semibold text-blue-600">
          Linked to{" "}
          <span className="underline">{item.premiumChannel.name}</span>
        </div>
      ) : (
        <div className="mt-2 text-sm font-semibold text-red-500">
          Not Linked
        </div>
      )}
    </Link>
  );
};

type CollectionGridProps = {
  data: CollectionWithMerchAndPremiumChannel[];
};
const CollectionGrid = ({ data }: CollectionGridProps) => {
  useEffect(() => {
    localStorage.removeItem("communityUrl");
  }, []);

  if (data.length === 0)
    return (
      <div className=" flex h-80 flex-col items-center justify-center gap-4 p-4 text-sm tracking-widest text-gray-400">
        No collections to show.
      </div>
    );

  return (
    <div className="grid grid-cols-1 gap-y-8 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
      {data.map((item) => (
        <CollectionGridItem key={item.collectionId} item={item} />
      ))}
    </div>
  );
};

export default CollectionGrid;
