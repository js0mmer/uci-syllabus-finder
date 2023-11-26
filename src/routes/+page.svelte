<script lang="ts">
  import trpc from '$lib/trpc';
  import type { syllabi } from '@prisma/client';
  import { onMount } from 'svelte';

  export let data;

  let syllabi: syllabi | undefined;

  let Dept = data.searchParams?.Dept ?? '';
  let CourseNum = data.searchParams?.CourseNum ?? '';

  async function search() {
    window.history.pushState({}, '', `/?Dept=${Dept}&CourseNum=${CourseNum}`);
    syllabi = await trpc.search.query({ Dept, CourseNum });
  }

  onMount(async () => {
    if (Dept && CourseNum) {
      syllabi = await trpc.search.query({ Dept, CourseNum });
    }
  });
</script>

<svelte:head>
  <title>UCI Syllabus Finder</title>
  <meta name="description" content="Find syllabi for prior offerings of courses at UCI" />
</svelte:head>

<main>
  <h1>hi</h1>
  <input type="text" name="Dept" placeholder="Search for a course" bind:value={Dept} />
  <input type="text" name="CourseNum" placeholder="Search for a course" bind:value={CourseNum} />
  <button on:click={search}>Search</button>
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
