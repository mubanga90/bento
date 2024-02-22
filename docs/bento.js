var l = Object.defineProperty;
var o = (s, t, e) => t in s ? l(s, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : s[t] = e;
var i = (s, t, e) => (o(s, typeof t != "symbol" ? t + "" : t, e), e);
function d(s, t) {
  const e = s.getBoundingClientRect(), r = Math.floor(e.width / t.x), h = Math.floor(e.height / t.y);
  return {
    x: r,
    y: h
  };
}
class a {
  constructor() {
    i(this, "grid", []);
    i(this, "gridSize", { x: 0, y: 0 });
    i(this, "items", []);
    i(this, "stretchableItems", []);
    i(this, "getGridSize", () => this.gridSize);
    i(this, "createGrid", (t) => {
      this.gridSize = t, this.grid = Array.from({ length: this.gridSize.y }).map(() => Array.from({ length: this.gridSize.x }).fill(-1));
    });
    i(this, "populateGrid", (t) => {
      this.items = t;
      for (const e of t)
        e.setGrid(this), this.insertItemIntoGrid(e) || console.warn("Could not place item", e.index);
    });
    i(this, "fillGrid", () => {
      this.stretchableItems = this.items.filter((e) => e.placed);
      let t = this.stretchableItems[0];
      for (; t && (this.checkIfItemsCanStretch(), t = this.findFirstStretchableItem(), !!t); )
        t.stretch();
    });
    i(this, "isOpenSpace", (t) => !(this.isOutOfBounds(t) || this.isCellFilled(t)));
    i(this, "debugGrid", () => {
      console.log(this.grid.map((t) => t.map((e) => e === -1 ? ".  " : String(e).padEnd(3, " ")).join(" ")).join(`
`));
    });
    /** Placing **/
    i(this, "insertItemIntoGrid", (t) => {
      for (let e = 0; e < this.gridSize.y; e++)
        if (this.tryPlaceItemOnRow(t, e))
          return !0;
      return !1;
    });
    i(this, "tryPlaceItemOnRow", (t, e) => {
      for (let r = 0; r < this.gridSize.x; r++)
        if (t.checkPlacement({ x: r, y: e }))
          return t.position = { x: r, y: e }, this.assignItemToCells(t), t.placed = !0, !0;
      return !1;
    });
    /** Stretching **/
    i(this, "checkIfItemsCanStretch", () => {
      for (const t of this.stretchableItems)
        t.canStretch();
    });
    i(this, "findFirstStretchableItem", () => (this.stretchableItems = this.stretchableItems.filter((t) => t.emptyNeighborsRight + t.emptyNeighborsBottom > 0).sort((t, e) => e.emptyNeighborsRight + e.emptyNeighborsBottom - (t.emptyNeighborsRight + t.emptyNeighborsBottom)), this.stretchableItems[0] || null));
  }
  assignItemToCells(t) {
    const e = t.position.y + (t.actualSize ? t.actualSize.y : t.minSize.y), r = t.position.x + (t.actualSize ? t.actualSize.x : t.minSize.x);
    for (let h = t.position.y; h < e; h++)
      for (let n = t.position.x; n < r; n++)
        this.grid[h][n] = t.index;
  }
  /** Placement checks **/
  isOutOfBounds(t) {
    return t.x < 0 || t.y < 0 || t.y >= this.grid.length || t.x >= this.grid[0].length;
  }
  isCellFilled(t) {
    return this.grid[t.y][t.x] !== -1;
  }
}
class c {
  constructor(t, e) {
    i(this, "index", -1);
    i(this, "element");
    i(this, "grid");
    i(this, "minSize", { x: 1, y: 1 });
    i(this, "position", { x: 0, y: 0 });
    i(this, "actualSize");
    i(this, "placed");
    i(this, "emptyNeighborsRight", 0);
    i(this, "emptyNeighborsBottom", 0);
    i(this, "setGrid", (t) => {
      this.grid = t;
    });
    i(this, "checkPlacement", (t) => {
      if (this.grid === void 0)
        throw new Error("Grid not set");
      for (let e = t.y; e < t.y + this.minSize.y; e++)
        if (!this.isCellOpen({ x: t.x, y: e }))
          return !1;
      return !0;
    });
    i(this, "canStretch", () => {
      this.position.x === void 0 || this.position.y === void 0 || (this.actualSize ?? (this.actualSize = this.minSize), this.emptyNeighborsRight = 0, this.emptyNeighborsBottom = 0, this.canStretchInDirection("x", "Right"), this.canStretchInDirection("y", "Bottom"));
    });
    i(this, "stretch", () => {
      var t;
      this.emptyNeighborsRight > this.emptyNeighborsBottom || this.emptyNeighborsRight === this.emptyNeighborsBottom && this.index % 2 === 0 ? this.actualSize.x++ : this.actualSize.y++, (t = this.grid) == null || t.assignItemToCells(this);
    });
    i(this, "isCellOpen", (t) => {
      for (let e = t.x; e < t.x + this.minSize.x; e++)
        if (!this.grid.isOpenSpace({ x: e, y: t.y }))
          return !1;
      return !0;
    });
    i(this, "canStretchInDirection", (t, e) => {
      this.canStretchOnAxis(t) && (this[`emptyNeighbors${e}`] += this.actualSize[t]);
    });
    i(this, "canStretchOnAxis", (t) => {
      const e = this.position[t] + this.actualSize[t], r = t === "x" ? "y" : "x", h = this.position[r] + this.actualSize[r];
      if (e >= this.grid.getGridSize()[t])
        return !1;
      for (let n = this.position[r]; n < h; n++)
        if (!this.grid.isOpenSpace(t === "x" ? { x: e, y: n } : { x: n, y: e }))
          return !1;
      return !0;
    });
    this.element = t, this.index = e, this.minSize.x = Number(t.dataset.minWidth), this.minSize.y = Number(t.dataset.minHeight), this.placed = !1;
  }
}
class m {
  constructor() {
    i(this, "gridElement");
    i(this, "setGridElement", (t) => {
      this.gridElement = t;
    });
    i(this, "getItems", () => {
      if (!this.gridElement)
        throw new Error("Grid element not set");
      return Array.from(this.gridElement.children).map((t, e) => new c(t, e));
    });
    i(this, "setupGrid", (t) => {
      if (!this.gridElement)
        throw new Error("Grid element not set");
      this.gridElement.style.display = "grid", this.gridElement.style.gridTemplateColumns = `repeat(${t.x}, 1fr)`, this.gridElement.style.gridTemplateRows = `repeat(${t.y}, 1fr)`;
    });
    i(this, "setItemStyles", (t) => {
      for (const e of t)
        e.element && (e.element.style.display = e.placed ? "block" : "none", e.element.style.gridColumnStart = `${e.position.x + 1}`, e.element.style.gridColumnEnd = `span ${e.actualSize ? e.actualSize.x : e.minSize.x}`, e.element.style.gridRowStart = `${e.position.y + 1}`, e.element.style.gridRowEnd = `span ${e.actualSize ? e.actualSize.y : e.minSize.y}`);
    });
  }
}
class u {
  constructor(t, e = {}) {
    i(this, "grid", new a());
    i(this, "dom", new m());
    i(this, "gridElement");
    i(this, "preferredCellSize", { x: 120, y: 115 });
    i(this, "setLayout", () => {
      const t = this.dom.getItems(), e = d(this.gridElement, this.preferredCellSize);
      this.dom.setupGrid(e), this.grid.createGrid(e), this.grid.populateGrid(t), this.grid.fillGrid(), this.dom.setItemStyles(t);
    });
    this.gridElement = t, this.dom.setGridElement(t), this.preferredCellSize = (e == null ? void 0 : e.preferredCellSize) ?? { x: 120, y: 115 }, this.setLayout(), window.addEventListener("resize", this.setLayout);
  }
}
export {
  u as default
};
