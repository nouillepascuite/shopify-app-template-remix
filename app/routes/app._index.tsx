import type { LoaderFunctionArgs } from "@remix-run/node";
import { Page, Card, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  return (
    <Page>
      <TitleBar title="Dashboard" />
      <Card>
        <Text as="p" variant="bodyMd">
          Hello World test update live 
        </Text>
      </Card>
    </Page>
  );
}
