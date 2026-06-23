/**
 * @file product.test.js
 * @description Tests for Product module — controller
 *
 * Structure
 * ├── handleCreateProduct
 * ├── handleGetProducts
 * ├── handleGetProductByid
 * ├── handleUpdateProduct
 * └── handleDeleteProduct
 */

import { jest } from "@jest/globals";

// ── Mock product service ──────────────────────────────────────────────────────
const mockCreateProduct = jest.fn();
const mockGetAll        = jest.fn();
const mockGetById       = jest.fn();
const mockUpdate        = jest.fn();
const mockDelete        = jest.fn();

jest.unstable_mockModule("../src/modules/product/product.service.js", () => ({
  createNewProduct: mockCreateProduct,
  getAllProducts:   mockGetAll,
  getProductById:  mockGetById,
  updateProduct:   mockUpdate,
  deleteProduct:   mockDelete,
}));

const {
  handleCreateProduct, handleGetProducts, handleGetProductByid,
  handleUpdateProduct, handleDeleteProduct,
} = await import("../src/modules/product/product.controller.js");

// ── Helpers ───────────────────────────────────────────────────────────────────
const res = () => {
  const r = {};
  r.status = jest.fn().mockReturnValue(r);
  r.json   = jest.fn().mockReturnValue(r);
  return r;
};

const SAMPLE_PRODUCT = {
  _id: "prod_001", productName: "CRM Pro", productType: "Software",
  priceType: "Subscription", price: 999, discount: 10,
};

beforeEach(() => jest.clearAllMocks());

// =============================================================================
// handleCreateProduct
// =============================================================================
describe("handleCreateProduct", () => {
  describe("positive", () => {
    test("201 — creates and returns product", async () => {
      mockCreateProduct.mockResolvedValue(SAMPLE_PRODUCT);
      const r = res();
      await handleCreateProduct({ body: { productName: "CRM Pro", productType: "Software", priceType: "Subscription", price: 999 } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(201);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Product added sucessfully", data: SAMPLE_PRODUCT })
      );
    });

    test("passes full body to service", async () => {
      mockCreateProduct.mockResolvedValue(SAMPLE_PRODUCT);
      const body = { productName: "CRM Pro", productType: "Software", priceType: "Subscription", price: 999, discount: 10 };
      await handleCreateProduct({ body }, res(), jest.fn());
      expect(mockCreateProduct).toHaveBeenCalledWith(body);
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockCreateProduct.mockRejectedValue(new Error("Validation failed"));
      const next = jest.fn();
      await handleCreateProduct({ body: {} }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("calls next(error) on DB failure", async () => {
      mockCreateProduct.mockRejectedValue(new Error("MongoError"));
      const next = jest.fn();
      await handleCreateProduct({ body: { productName: "X" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// handleGetProducts
// =============================================================================
describe("handleGetProducts", () => {
  describe("positive", () => {
    test("200 — returns all products", async () => {
      mockGetAll.mockResolvedValue([SAMPLE_PRODUCT]);
      const r = res();
      await handleGetProducts({}, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Products retrived", data: [SAMPLE_PRODUCT] })
      );
    });

    test("200 — returns empty array when no products", async () => {
      mockGetAll.mockResolvedValue([]);
      const r = res();
      await handleGetProducts({}, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(expect.objectContaining({ data: [] }));
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockGetAll.mockRejectedValue(new Error("DB error"));
      const next = jest.fn();
      await handleGetProducts({}, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });
});

// =============================================================================
// handleGetProductByid
// =============================================================================
describe("handleGetProductByid", () => {
  describe("positive", () => {
    test("200 — returns product when found", async () => {
      mockGetById.mockResolvedValue(SAMPLE_PRODUCT);
      const r = res();
      await handleGetProductByid({ params: { id: "prod_001" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ data: SAMPLE_PRODUCT })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when product not found", async () => {
      mockGetById.mockRejectedValue(new Error("Product not found"));
      const next = jest.fn();
      await handleGetProductByid({ params: { id: "bad" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes exact id to service", async () => {
      mockGetById.mockResolvedValue(SAMPLE_PRODUCT);
      await handleGetProductByid({ params: { id: "prod_001" } }, res(), jest.fn());
      expect(mockGetById).toHaveBeenCalledWith("prod_001");
    });
  });
});

// =============================================================================
// handleUpdateProduct
// =============================================================================
describe("handleUpdateProduct", () => {
  describe("positive", () => {
    test("200 — returns updated product", async () => {
      const updated = { ...SAMPLE_PRODUCT, price: 1200 };
      mockUpdate.mockResolvedValue(updated);
      const r = res();
      await handleUpdateProduct({ params: { id: "prod_001" }, body: { price: 1200 } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Product updated" })
      );
    });

    test("passes id and body to service", async () => {
      mockUpdate.mockResolvedValue(SAMPLE_PRODUCT);
      const body = { discount: 20 };
      await handleUpdateProduct({ params: { id: "prod_001" }, body }, res(), jest.fn());
      expect(mockUpdate).toHaveBeenCalledWith("prod_001", body);
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockUpdate.mockRejectedValue(new Error("Not found"));
      const next = jest.fn();
      await handleUpdateProduct({ params: { id: "bad" }, body: {} }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes empty body without error", async () => {
      mockUpdate.mockResolvedValue(SAMPLE_PRODUCT);
      const r = res();
      await handleUpdateProduct({ params: { id: "prod_001" }, body: {} }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
    });
  });
});

// =============================================================================
// handleDeleteProduct
// =============================================================================
describe("handleDeleteProduct", () => {
  describe("positive", () => {
    test("200 — deletes product successfully", async () => {
      mockDelete.mockResolvedValue(true);
      const r = res();
      await handleDeleteProduct({ params: { id: "prod_001" } }, r, jest.fn());
      expect(r.status).toHaveBeenCalledWith(200);
      expect(r.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Product deleted" })
      );
    });
  });

  describe("negative", () => {
    test("calls next(error) when service throws", async () => {
      mockDelete.mockRejectedValue(new Error("Not found"));
      const next = jest.fn();
      await handleDeleteProduct({ params: { id: "bad" } }, res(), next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe("edge", () => {
    test("passes exact id to service", async () => {
      mockDelete.mockResolvedValue(true);
      await handleDeleteProduct({ params: { id: "prod_001" } }, res(), jest.fn());
      expect(mockDelete).toHaveBeenCalledWith("prod_001");
    });
  });
});
