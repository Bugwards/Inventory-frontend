import StockIssueDetailPage from "@/features/stockIssue/components/StockIssueDetailPage";


interface PageProps {
  params: Promise<{
    issueNo: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { issueNo } = await params;

  return (
    <StockIssueDetailPage issueNo={decodeURIComponent(issueNo)} />
  );
}