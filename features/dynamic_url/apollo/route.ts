import { CategoryInterface, CategoryTree, RoutableInterface } from "@/types/generated/graphql";
import { gql } from "@apollo/client";


const ROUTE = gql`
  query Route($url: String!) {
    route(url: $url) {
      redirect_code
      relative_url
      type
      ... on CategoryInterface {
        products{
          items{
            name
          }
        }
         }
    }
  }
`;



export type RouteQuery = {
  Response: {
    route : {
      categories: CategoryInterface,      
    }
  };
  Variables: {
    url: string;
  };
};

export default ROUTE;
