import axios from 'axios';
import prisma from './prisma';
import { z } from 'zod';

const WEBSOC_URL = 'https://www.reg.uci.edu/perl/WebSoc';


export const course = z.object({
    Dept: z.string(),
    CourseNum: z.string()
});

export type Course = z.infer<typeof course>;

// enum Quarter {
//     FALL = '92',
//     WINTER = '03',
//     SPRING = '14',
//     SUMMER = '25',
//     SUMMER10WK = '39',
//     SUMMER2 = '76'
// }

// function getRelevantTerms

export const getSyllabi = async (course: Course) => {
    const { Dept, CourseNum } = course;
    const syllabi = await prisma.syllabi.findFirst({
        where: {
            dept: Dept,
            courseNum: CourseNum
        }
    });

    if (syllabi === null) {
        // fetch then cache
        return;
    }

    // for (const term of syllabi.terms) {
    //     if (term.term === Quarter.FALL) {
    //         return;
    //     }
    // }
    return syllabi;
};

export const getWebSocData = async (course: Course) => {
    const response = await axios.get(WEBSOC_URL, {
        params: {
            ...course,
            YearTerm: '2019-03',
            ShowComments: 'on',
            ShowFinals: 'on',
            Breadth: 'ANY',
            Division: 'ANY',
            ClassType: 'ALL',
            FullCourses: 'ANY',
            CancelledCourses: 'Exclude',
            Submit: 'Display Web Results'
        }
    });

    return response.data;
};
