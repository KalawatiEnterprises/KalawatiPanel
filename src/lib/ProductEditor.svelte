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

  export let product = {
    "Name": "",
    "Description": "",
    "Brand": {
      "ID": null,
      "Name": ""
    },
    "Categories": []
  };

  const handleSave = async() => {
    const res = await fetch("http://localhost:4001/api/products", {
      method: "post",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product)
    });
  }
</script>

<div class="product-editor">
  <input bind:value={product.Name} placeholder="Product Name">
  <input bind:value={product.Description} placeholder="Product Description">

  <select bind:value={product.Brand.ID}>
    {#each brands as b}
      <option value={b.ID}>{b.Name}</option>
    {/each}
  </select>
  <div class="categories-menu">
    {#each product.Categories as c}
      <span>c.Name</span>
    {/each}
  </div>
  <button on:click={handleSave}>Save</button>
</div>
