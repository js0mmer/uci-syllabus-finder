<script lang="ts">
  import trpc from '$lib/trpc';
  import { formatTermReadable } from 'websoc';
  import type { syllabi as Syllabus } from '@prisma/client';
  import { onMount } from 'svelte';

  export let data;

  let syllabi: Syllabus[] | undefined;

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

<main class="container">
  <label for="Dept">Search for a course</label>
  <input type="text" id="Dept" name="Dept" placeholder="Department" bind:value={Dept} />
  <input type="text" name="CourseNum" placeholder="Course Number" bind:value={CourseNum} />
  <button on:click={search}>Search</button>
  {#if syllabi}
    <table>
      <thead>
        <tr>
          <th>Term</th>
          <th>Instructor</th>
          <th>Syllabus</th>
        </tr>
      </thead>
      <tbody>
        {#each syllabi as syllabus}
          <tr>
            <td>{formatTermReadable(syllabus.term)}</td>
            <td>
              {#each syllabus.instructors.split(';') as instructor}
                {instructor}
                <br>
              {/each}
            </td>
            <td><a href={syllabus.link}>Syllabus</a></td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</main>

<style>
  main {
    margin-top: 2rem;
  }
</style>