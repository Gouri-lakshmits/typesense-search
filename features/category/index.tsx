import { CATEGORY } from "@/apollo/queries/category";
import { useQuery } from "@apollo/client";

const CategoryDetails = ({ path }: any) => {
  const categoryId = parseInt(path, 10);
  console.log("Path:", path); 
  const { loading, error, data } = useQuery(CATEGORY, {
    variables: {
      filter: {
      categoryId
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const category = data.categories.items[0];

  return (
    <div>
      <h2>{category.name}</h2>
      <p>{category.description}</p>
    </div>
  );
};

export default CategoryDetails;
