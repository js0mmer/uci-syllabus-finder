<script lang="ts">
    import { enhance } from '$app/forms';

    export let data;
    const syllabi = data.syllabi;
</script>

<svelte:head>
    <title>UCI Syllabus Finder</title>
    <meta name="description" content="Find syllabi for prior offerings of courses at UCI" />
</svelte:head>

<main>
    <h1>hi</h1>
    <form use:enhance>
        <input type="text" name="Dept" placeholder="Search for a course" value={data.searchParams?.Dept ?? ''} />
        <input type="text" name="CourseNum" placeholder="Search for a course" value={data.searchParams?.CourseNum ?? ''} />
        <input type="submit" value="Search" />
    </form>
    {#if syllabi}
        <table>
            <thead>
                <tr>
                    <th>Term</th>
                    <th>Instructor</th>
                    <th>Link</th>
                </tr>
            </thead>
            <tbody>
                {#each syllabi.terms as term}
                    <tr>
                        <td colspan={term.instructors.length}>{term.term}</td>
                        <td>{term.instructors[0].instructor}</td>
                        <td><a href={term.instructors[0].syllabus}>Link</a></td>
                    </tr>
                    {#each term.instructors.splice(1) as instructor}
                        <tr>
                            <td>{instructor.instructor}</td>
                            <td><a href={instructor.syllabus}>Link</a></td>
                        </tr>
                    {/each}
                {/each}
            </tbody>
        </table>
    {/if}
</main>
