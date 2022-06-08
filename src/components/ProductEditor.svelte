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
    dispatch("products-updated");
  }

  const handleImageDelete = async(path, id) => {
    const res = await fetch("http://localhost:4001/api/images/", {
      method: "delete",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(path)
    });
    loadImages();
    // product.Images = product.Images.filter((_, index) => index !== id);
  }

  const loadImages = async() => {
    const res = await fetch(`http://localhost:4001/api/images/${product.ID}`)
      .then(response => response.json())
      .then(data => product.Images = data);
  }

  const handleUpload = async(e, imageId) => {
    let data = new FormData();
    data.append("image", e.target.files[0]);
    data.append("product-id", product.ID);
    data.append("image-id", imageId);

    const res = await fetch("http://localhost:4001/api/images/", {
      method: "post",
      body: data
    });

    loadImages();
  }

  const handleCancel = () =>
    dispatch("edit-canceled");

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
  <div class="flex-container">
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
          {:else}
            <div>No Categories Added</div>
            <div class="warning">WARNING: If no categories are added the product won't be shown on the website.</div>
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
  </div>
  <div class="images">
    {#if product.Images != null && product.Images.length > 0}
      <p>Images for {product.Name != "" ? product.Name : "<no name>"}:</p>
      {#each product.Images as i, index}
        <div class="image">
          <img src={`http://localhost:4001/images/${i}`}>
          <div class="image-options">
            <input class="hidden" id={`image-hidden-input-${index}`} type="file" accept=".webp" on:change={(e) => handleUpload(e, index)}>
            <button on:click={() => {document.getElementById(`image-hidden-input-${index}`).click()}}>Replace</button>
            <button on:click={() => handleImageDelete(i, index)}>Delete</button>
          </div>
        </div>
      {/each}
      {#if product.Images.length < 2}
        <input type="file" accept=".webp" on:change={(e) => handleUpload(e, product.Images.length)}>
      {/if}
    {:else}
      {#if product.ID != null}
        <p>No Images Added For {product.Name != "" ? product.Name : "<no name>"}.</p>
        <input type="file" accept=".webp" on:change={(e) => handleUpload(e, 0)}>
      {:else}
        <p>Save The Product "{product.Name != "" ? product.Name : "<no name>"}" First Before Uploading Images.</p>
      {/if}
    {/if}
  </div>
  {#if product.ID != null}
    <div class="options-alt">
      <button on:click={() => handleSave("delete")}>Delete</button>
    </div>
  {/if}
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
  }
  .flex-container {
    width: 100%;
    padding-top: 10vh;
    padding-bottom: 2rem;
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
    height: 1.8rem;
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
  .images {
    height: 40%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }
  .images .image {
    border: 1px solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  .image-options {
    position: absolute;
    height: 100%;
    width: 100%;
    display: none;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: #0000004D;
  }
  .hidden {
    display: none;
  }
  .image-options button {
    margin: 0.5rem;
  }
  .image:hover .image-options {
    display: flex;
  }
  .image:hover img {
    filter: blur(3px);
    -webkit-filter: blur(3px);
  }
  .images .image img {
    max-height: 13rem;
    max-width: 15rem;
    display: block;
    margin: auto;
  }
</style>
