export async function load({ url }) {
  const { searchParams } = url;

  return {
    searchParams: {
      Dept: searchParams.get('Dept'),
      CourseNum: searchParams.get('CourseNum')
    }
  };
}
