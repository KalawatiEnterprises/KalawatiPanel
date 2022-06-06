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
  import { createEventDispatcher } from 'svelte';
  import { Product } from "../classes"

  const dispatch = createEventDispatcher();

  let categories = [];
  fetch('http://localhost:4001/api/categories')
    .then(response => response.json())
    .then(data => categories = data);

  let brands = [];
  fetch('http://localhost:4001/api/brands')
    .then(response => response.json())
    .then(data => brands = data);

  let products = [];
  fetch('http://localhost:4001/api/products')
    .then(response => response.json())
    .then(data => products = data);

  export let product = null;

  let noticeText = ""
  const validate = (product) => {
    if (product.Brand.ID == null)
      return "Please Enter A Brand";
    if (product.Name == "")
      return "Please Enter A Name";
    return "";
  }

  const handleSave = async(method) => {
    noticeText = validate(product);
    if (noticeText != "") return;
    const res = await fetch("http://localhost:4001/api/products", {
      // method: product.ID == null ? "post" : "put",
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    });
    dispatch("products-updated", {});
  }

  const handleCancel = () =>
    dispatch("edit-canceled", {})

  const handleCategoryDelete = (c) =>{
    product.Categories = product.Categories.filter((i) => i.ID !== c.ID);
  }

  let newCategoryID = null;

  const filteredCategories = (c, pc) =>
    pc != null
      ? c.filter(x => !(pc.map(y => y.ID).includes(x.ID))) : c;
</script>


<div class="product-editor">
  <h4 class="notice warning">{noticeText}</h4>
  <div class="fields">
    <div class="field">
      Name:
      <input bind:value={product.Name} placeholder="Product Name">
    </div>
    <div class="field">
      Description:
      <input bind:value={product.Description} placeholder="Product Description">
    </div>

    <div class="field">
      Brand:
      <select bind:value={product.Brand.ID}>
        <option value={null} disabled selected hidden>Select a Brand</option>
        {#each brands as b}
          <option value={b.ID}>{b.Name} / {b.DisplayName}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="categories-menu field">
    Categories: (double click to delete)
    <div class="categories">
      {#if product.Categories != null}
        {#each product.Categories as c, i}
          <span on:dblclick={() => handleCategoryDelete(c)}>{c.Name}{`${(i < product.Categories.length - 1) ? ", " : ""}`}</span>
        {/each}
      {:else}
        <div>No Categories Added</div>
        <div class="warning">WARNING: If no categories are added the product won't be shown on the website.</div>
      {/if}
    </div>

    <div class="editor">

      <select bind:value={newCategoryID} placeholder="fuck me">
        <option value={null} disabled selected hidden>Select a Category</option>
        {#each filteredCategories(categories, product.Categories) as c}
          <option value={c.ID}>{c.Name}</option>
        {/each}
      </select>

      <button class="add-category"
        on:click={() => {
          const newCategory = {"ID": newCategoryID, "Name": categories.find(i => i.ID == newCategoryID).Name};
          product.Categories = product.Categories != null
            ? [...product.Categories, newCategory] : [newCategory];
        }}> Add </button>

    </div>
  </div>
  <div class="options-alt">
    <button on:click={() => handleSave("delete")}>Delete</button>
  </div>
  <div class="options">
    <button on:click={handleCancel}>Cancel</button>
    <button on:click={() => handleSave(product.ID == null ? "post" : "put")}>Save</button>
  </div>
</div>

<style>
  .product-editor {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .options-alt {
    position: absolute;
    bottom: 3rem;
    left: 4rem;
    display: flex;
    width: 12rem;
    justify-content: space-between;
  }
  .options {
    position: absolute;
    bottom: 3rem;
    right: 4rem;
    display: flex;
    width: 12rem;
    justify-content: space-between;
  }
  button {
    width: 5rem;
  }
  .field {
    width: 30rem;
    display: flex;
    justify-content: space-between;
    margin: 0.5rem 0;
  }
  .field input, .field select {
    width: 60%;
  }
  .categories-menu {
    display: flex;
    flex-direction: column;
  }
  .editor {
    display: flex;
    justify-content: space-between;
  }
  .warning {
    color: red;
  }
  .notice {
    position: absolute;
    top: 2rem;
    left: 0; right: 0;
    margin: auto;
    text-align: center;
  }
</style>
