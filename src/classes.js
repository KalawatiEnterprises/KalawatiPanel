export class Product {
  constructor() {
    this.ID = null;
    this.Name = "";
    this.Description = "";
    this.Brand = new Brand();
  }
}

export class Brand {
  constructor() {
    this.ID = null;
    this.DisplayName = "";
    this.Name = "";
    this.Website = "";
    this.LogoURL = "";
  }
}

export class Category {
  constructor() {
    this.ID = null;
    this.Name = "";
    this.Parent = {
      "ID": null,
      "Name": "",
      "Parent": null
    };
  }
}
