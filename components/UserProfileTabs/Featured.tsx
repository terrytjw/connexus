import React from "react";
import CollectionGrid from "../CollectionGrid";

type UserProfileFeaturedProps = {
  products: any; // TODO: type this
};
const UserProfileFeatured = ({ products }: UserProfileFeaturedProps) => {
  return (
    <main>
      <CollectionGrid data={products} />
    </main>
  );
};

export default UserProfileFeatured;
