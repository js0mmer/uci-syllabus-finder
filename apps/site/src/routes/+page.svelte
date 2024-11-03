<script lang="ts">
  import { formatTermReadable } from 'websoc';
  import { onMount } from 'svelte';
  import type { Syllabus } from 'database/schema.js';

  export let data;

  let syllabi: Syllabus[] | undefined;

  let Dept = data.searchParams?.Dept ?? '';
  let CourseNum = data.searchParams?.CourseNum ?? '';

  async function search() {
    const params = new URLSearchParams({ Dept, CourseNum });
    window.history.pushState({}, '', `/?${params}`);
    syllabi = await fetch(`/api/syllabi?${params}`).then((res) => res.json());
  }

  onMount(async () => {
    if (Dept && CourseNum) {
      search();
    }
  });

  function keyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      search();
    }
  }
</script>

<svelte:head>
  <title>UCI Syllabus Finder</title>
  <meta name="description" content="Find syllabi for prior offerings of courses at UCI" />
</svelte:head>

<main class="container">
  <label for="Dept">Search for a course</label>
  <input type="text" id="Dept" name="Dept" placeholder="Department" bind:value={Dept} />
  <input type="text" name="CourseNum" placeholder="Course Number" bind:value={CourseNum} on:keydown={keyDown} />
  <button on:click={search}>Search</button>
  {#if syllabi !== undefined}
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
                <br />
              {/each}
            </td>
            <td><a href={syllabus.link} target="_blank">Syllabus</a></td>
          </tr>
        {:else}
          <tr>
            <td colspan="3">No results found</td>
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
