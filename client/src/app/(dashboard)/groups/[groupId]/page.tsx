type GroupPageProps = {
  params: Promise<{ groupId: string }>;
};

export default async function GroupPage({ params }: GroupPageProps) {
  const { groupId } = await params;

  return (
    <section className="p-6">
      <h1 className="text-2xl font-semibold">Group {groupId}</h1>
      <p className="mt-2 text-muted-foreground">
        Group details will appear here.
      </p>
    </section>
  );
}