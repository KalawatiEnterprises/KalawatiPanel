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

  export let product = {}
  //   "Name": "",
  //   "Description": "",
  //   "Brand": {
  //     "ID": null,
  //     "Name": ""
  //   },
  //   "Categories": []
  // };

  const handleSave = async() => {
    const res = await fetch("http://localhost:4001/api/products", {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
  }

  let newCategoryID = null;

  const filteredCategories = (c, pc) =>
    pc != null
      ? c.filter(x => !(pc.map(y => y.ID).includes(x.ID))) : c;
</script>


<div class="product-editor">
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
        {#each brands as b}
          <option value={b.ID}>{b.Name}</option>
        {/each}
      </select>
    </div>
  </div>
  <div class="categories-menu field">
    <div class="categories">
      {#if product.Categories != null}
        {#each product.Categories as c}
          <span>{c.Name}</span>
        {/each}
      {:else}
        No Categories Added
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
  <button on:click={handleSave} class="save">Save</button>
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
  .save {
    position: absolute;
    bottom: 3rem;
    right: 4rem;
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
    border: 1px solid pink;
    display: flex;
    flex-direction: column;
  }
  .editor {
    border: 1px solid purple;
    display: flex;
    justify-content: space-between;
  }
  .editor button {
    width: 5rem;
  }
</style>
