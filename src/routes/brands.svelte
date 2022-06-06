<!--
 KalawatiPanel - Management App for kalawatienterprises.co.in
 Copyright (C) 2022  Vidhu Kant Sharma <vidhukant@protonmail.ch>

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

<script>
  import { fade } from 'svelte/transition';
  // import BrandEditor from "../components/BrandEditor.svelte";
  import { Brand } from "../classes";

  const filterBrands = (brands, searchString) => [...new Set([
    ...brands.filter(i => i.DisplayName.toLowerCase().includes(searchString.toLowerCase())),
    ...brands.filter(i => i.Name.toLowerCase().includes(searchString.toLowerCase()))
  ])];

  let brands = [];
  const loadBrands = () =>
    fetch('http://localhost:4001/api/brands')
      .then(response => response.json())
      .then(data => {
        brands = data;
      });
  loadBrands();

  let searchString = "";
  let showEditor = false;
  let editorBrand = new Brand();

  const handleAddNew = () => {
    showEditor = true;
    editorBrand = new Brand();
  }

  const handleCancel = () => {
    showEditor = false;
    editorBrand = new Brand();
  }

  const handleUpdate = () => {
    loadBrands();
    handleCancel();
  }
</script>

<div class="searchbox">
  Search Brands <input bind:value={searchString}/>
</div>

{#key brands}
<table in:fade="{{ duration: 200, delay: 100 }}" out:fade="{{ duration: 300, delay: 0 }}">
  <tr>
    <th>Display Name</th>
    <th>Full Name (optional)</th>
    <th>Website</th>
    <button on:click={handleAddNew}>Add New</button>
  </tr>
  {#if brands != null}
    {#each filterBrands(brands, searchString) as b}
      <tr>
        <td>{b.DisplayName}</td>
        <td>{b.Name}</td>
        <td><a href={b.Website}>{b.Website == null ? "No Website" : b.Website}</a></td>
        <button on:click={() => {showEditor = true; editorBrand = b}}>
          Edit
        </button>
      </tr>
    {:else}
      <h1>No Brands With This Name Found.</h1>
    {/each}
  {:else}
    <h1>No Brands Exist In The Database.</h1>
  {/if}
</table>
{/key}

{#if showEditor}
  <h1>Coming Soon</h1>
<!--div class="editor-parent" in:fade="{{ duration: 150 }}" out:fade="{{ duration: 200 }}">
  <ProductEditor product={editorProduct} on:products-updated={handleUpdate} on:edit-canceled={handleCancel}/>
</div-->
{/if}

<style>
  button {
    width: 7rem;
  }
  .searchbox {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2rem 0;
  }
  .searchbox input {
    margin-left: 1rem;
  }
  table {
    width: 80%;
    margin: auto;
  }
  th, td {
    text-align: left;
    border-bottom: 1px solid black;
  }
  .editor-parent {
    z-index: 10;
    background-color: white;
    position: fixed;
    top: 0; bottom: 0;
    left: 0; right: 0;
    margin: auto;
    border: 1px solid black;
    height: 40vh;
    width: 60vw;
    box-shadow: 0.1rem 0.1rem 0.3rem 0.05rem rgba(35, 38, 39, 0.7);
  }
</style>
