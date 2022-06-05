export class Product {
  constructor() {
    this.Name = "";
    this.Description = "";
    this.Brand = new Brand();
  }
}

export class Brand {
  constructor() {
    this.ID = null;
    this.Name = "";
  }
}

// export class Category {
//   constructor() {
//     this.ID = null;
//     this.Name = "";
//     this.Parent = null;
//   }
// }
