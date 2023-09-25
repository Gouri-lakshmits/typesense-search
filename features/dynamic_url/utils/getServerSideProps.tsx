import { useApolloClient, useQuery } from "@apollo/client";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import ROUTE, { RouteQuery } from "../apollo/route";
import { CategoryInterface, CategoryTree, ProductInterface } from "@/types/generated/graphql";
import getClient from "@/apollo/apolloClient";

export type DynamicUrlProps = {
  categories: CategoryInterface
};

export const getServerSideProps: GetServerSideProps<DynamicUrlProps> = async (
  ctx: GetServerSidePropsContext
) => {
  console.log('context', ctx.query?.url?.[1]);
  const routeUrl = ctx.query?.url?.[1];
  const client = getClient();
  try {
    const { data } = await client.query<
      RouteQuery["Response"], RouteQuery["Variables"]
    >({
      query: ROUTE,
      variables: { url: routeUrl || "" },
      fetchPolicy: "no-cache"
    });
    console.log("data", data);

    const categories = data?.route?.categories as CategoryInterface || null;
    return {
      props: {
        categories,
      },
    };
  } catch (error) {
    console.log('error', error);

    return {
      notFound: true,
    };
  }
};
