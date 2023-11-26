import { getSyllabi, type Course } from '$lib/websoc.js';

export async function load({ url }) {
    const { searchParams } = url;
    const Dept = searchParams.get('Dept') as string;
    const CourseNum = searchParams.get('CourseNum') as string;

    if (!Dept || !CourseNum) {
        return { syllabi: null };
    }

    const course: Course = { Dept, CourseNum };

    const syllabi = await getSyllabi(course);

    return {
        searchParams: { Dept, CourseNum },
        syllabi
    };
}

export const actions = {
    default: async ({ url }) => {
        const { searchParams } = url;
        const Dept = searchParams.get('Dept') as string;
        const CourseNum = searchParams.get('CourseNum') as string;

        if (!Dept || !CourseNum) {
            return { syllabi: null };
        }

        const course: Course = { Dept, CourseNum };

        const syllabi = await getSyllabi(course);

        console.log(syllabi);

        return {
            searchParams: { Dept, CourseNum },
            syllabi
        };
    }
};