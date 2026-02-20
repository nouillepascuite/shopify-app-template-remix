import type { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, Text, BlockStack, InlineStack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

// ─── YOUR LOGO ───────────────────────────────────────────────────────────────
// Replace the file at:  app/assets/logochurnspotter.png
// with your actual logo. Keep the same filename.
import logo from "../assets/logochurnspotter.png";
// ─────────────────────────────────────────────────────────────────────────────

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
      <BlockStack gap="400">
        <Card>
          <InlineStack gap="400" blockAlign="center">
            <img
              src={logo}
              alt="ChurnSpotter logo"
              style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 12 }}
            />
            <div style={{ flex: 1 }}>
              <Text as="p" variant="bodyMd" tone="subdued">
                <span style={{ textAlign: "justify", display: "block" }}>
                  A Shopify app that watches how customers behave in your store and
                  predicts who is likely to stop buying from you.... before they
                  actually do.
                </span>
              </Text>
            </div>
          </InlineStack>
        </Card>
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
      </BlockStack>
    </Page>
  );
}
