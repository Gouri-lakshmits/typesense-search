import { FacetData, ProductImage, ProductItems, ResultPage } from '@/types/generated/graphql';
import { gql, useQuery } from '@apollo/client';


export const SEARCH_QUERY = gql`
  query SearchProducts($keyword: String!) {
    resultPage(keyword: $keyword) {
      facetData {
        total_values
        values {
          count
        }
      }
      productItems {
        price
        product_name
        sku
      }
      product_count
    }
  }
`;

export type SysytemConfigQuery = {
    Variables : {
        resultPage : ResultPage
    }
    Response: {
        // facetData : FacetData,
        productItems : ProductItems
    };
  };