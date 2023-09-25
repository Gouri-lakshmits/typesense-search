import { CategoryFilterInput, CategoryInterface, CategoryResult, ProductInterface } from "@/types/generated/graphql";
import { gql } from "@apollo/client";
import { Maybe } from "type-graphql";



export const CATEGORY = gql`
query getCategories(
    $filter: CategoryFilterInput
    $pagesize: number
    $page: number
  ) {
    categories(filters: $filter, pageSize: $pagesize, currentPage: $page) {
      items {
        available_sort_by
        canonical_url
        children_count
        custom_layout_update_file
        default_sort_by
        description
        display_mode
        filter_price_range
        image
        include_in_menu
        is_anchor
        landing_page
        level
        meta_description
        meta_keywords
        meta_title
        name
        path
        path_in_store
        position
        
        product_count
        redirect_code
        relative_url
        type
        uid
        url_key
        url_path
        url_suffix
      }
  }
}

`

export type CategoryQuery = {
  Response: {
    products: ProductInterface;
    categories: CategoryInterface;
  };
  Variables: {
    filter?: CategoryFilterInput;
    pagesize?: number;
    page?: number;
  };
};