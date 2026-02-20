import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, Text, BlockStack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(`
    {
      ordersCount(query: "fulfillment_status:unfulfilled") {
        count
        precision
      }
    }
  `);

  const { data } = await response.json();
  const { count, precision } = data.ordersCount;

  return { count, precision };
};

export default function Index() {
  const { count, precision } = useLoaderData<typeof loader>();
  const displayCount = precision === "AT_LEAST" ? `${count}+` : String(count);

  return (
    <Page>
      <TitleBar title="Dashboard" />
      <Card>
        <BlockStack gap="200">
          <Text as="h2" variant="headingMd">
            Unfulfilled Orders
          </Text>
          <Text as="p" variant="heading2xl">
            {displayCount}
          </Text>
        </BlockStack>
      </Card>
    </Page>
  );
}
