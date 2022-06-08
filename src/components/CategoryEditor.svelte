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
  import { Category } from "../classes";

  const dispatch = createEventDispatcher();

  let categories = [];
  fetch('http://localhost:4001/api/categories')
    .then(response => response.json())
    .then(data => categories = data);

  export let category = null;
  category.Parent = category.Parent == null ? new Category() : category.Parent

  let noticeText = ""
  const validate = (category) => {
    if (category.Name == "")
      return "Category Name Can't Be Blank.";
    return "";
  }

  const handleSave = async(method) => {
    noticeText = validate(category);
    if (noticeText != "" && method !== "delete") return;
    const res = await fetch("http://localhost:4001/api/categories", {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(category)
    });
    dispatch("categories-updated", {});
  }

  const handleCancel = () =>
    dispatch("edit-canceled", {})
</script>


<div class="category-editor">
  <h4 class="notice warning">{noticeText}</h4>
  <div class="fields">
    <div class="field">
      Name:
      <input bind:value={category.Name} placeholder="Category Name">
    </div>
    {#if categories != null}
      <div class="field">
        Parent Category:
        <select bind:value={category.Parent.ID}>
          <option value={null} selected>None</option>
          {#each categories.filter(i => i.ID != category.ID && i.Parent == null) as c}
            <option value={c.ID}>{c.Name}</option>
          {/each}
        </select>
      </div>
    {/if}
  </div>
  {#if category.ID != null}
    <div class="options-alt">
      <button on:click={() => handleSave("delete")}>Delete</button>
    </div>
  {/if}
  <div class="options">
    <button on:click={handleCancel}>Cancel</button>
    <button on:click={() => handleSave(category.ID == null ? "post" : "put")}>Save</button>
  </div>
</div>

<style>
  .category-editor {
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
