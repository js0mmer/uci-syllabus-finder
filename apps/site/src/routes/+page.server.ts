export async function load({ url }) {
  const { searchParams } = url;

  return {
    searchParams: {
      query: searchParams.get('query')
    }
  };
}
