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
  import ProductEditor from "../components/ProductEditor.svelte"
  const filterProducts = (products, searchString) =>
    products.filter(i => i.Name.toLowerCase().includes(searchString.toLowerCase()))

  let products = [];
  fetch('http://localhost:4001/api/products')
    .then(response => response.json())
    .then(data => {
      products = data;
    });

  const stringify = (categories) =>
    categories == null
      ? "None"
      : categories.map(i => i.Name).toString();

  let searchString = "";

  let showEditor = false;
  let editorProduct = null;
</script>

<div class="searchbox">
  Search Products <input bind:value={searchString}/>
</div>

<table>
  <tr>
    <th>Name</th>
    <th>Description</th>
    <th>Brand Name</th>
    <th>Categories</th>
    <button on:click={() => {showEditor = true; editorProduct = null}}>Add New</button>
  </tr>
  {#each filterProducts(products, searchString) as p}
    <tr>
      <td>{p.Name}</td>
      <td>{p.Description}</td>
      <td>{p.Brand.Name}</td>
      <td>
        {stringify(p.Categories)}
      </td>
      <button on:click={() => {showEditor = true; editorProduct = p}}>
        Edit
      </button>
    </tr>
  {/each}
</table>

{#if showEditor}
  <div class="editor-parent">
    <ProductEditor product={editorProduct} />
  </div>
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
