import React, { useEffect, useRef, useState } from "react";
import { Field, useField, useFormikContext } from "formik";
import { Input } from "antd";
import { useFetchProductQuery } from "../../features/allApi";
import LoadingHV from "../../atoms/loading/LoadingHV";

const categories = ["cat1", "cat2", "cat3"];

const SelectProductDropDown = ({ values }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const { setFieldValue } = useFormikContext();
  const {
    data: products,
    isLoading: isLoading,
    isFetching: fetch,
    error: error,
  } = useFetchProductQuery({
    filterString: "",
    filterObj: "",
  });

  const filteredProducts = products?.filter((product) => {
    // Support both object and string for productType
    const productTypeId = typeof product.productType === 'object' && product.productType !== null ? product.productType._id : product.productType;
    return (
      (!selectedCategory || productTypeId === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Get unique product types (support both object and string)
  const uniqueProductTypes = Array.from(
    new Map(
      products?.map((product) => {
        if (typeof product.productType === 'object' && product.productType !== null) {
          return [product.productType._id, product.productType];
        } else if (product.productType) {
          return [product.productType, { _id: product.productType, name: product.productType }];
        }
        return [null, null];
      }).filter(([id, obj]) => id && obj)
    ).values()
  );

  const handleProductChange = (productId) => {
    const productObj = JSON.parse(productId);
    if (!Array.isArray(values.product)) {
      setFieldValue('product', [productObj]);
    } else {
      setFieldValue(`product[${values.product.length}]`, productObj);
    }
  };
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    const onWheel = (e) => {
      e.preventDefault(); // Prevent the default vertical scroll behavior
      scrollContainer.scrollLeft += e.deltaY; // Scroll horizontally instead
    };

    scrollContainer.addEventListener("wheel", onWheel);

    return () => {
      scrollContainer.removeEventListener("wheel", onWheel);
    };
  }, []);
  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full mb-2"
        />
        <div className="flex mb-2 space-x-2 custom-scrollbar2"   ref={scrollContainerRef} style={{ overflowY: "hidden", overflowX: "scroll" }}>
          <div className="flex mb-2 space-x-2" style={{paddingTop:"10px"}}>

          {uniqueProductTypes?.map((category) => (
            <button
            type="button"
            key={category._id}
            className={`text-sm py-1 px-2 rounded-md ${
              selectedCategory === category._id
              ? "bg-indigo-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => {
                if (selectedCategory === category._id) {
                  setSelectedCategory("");
                } else {
                  setSelectedCategory(category._id);
                }
              }}
            >
              {category.name}
            </button>
          ))}
          </div>
         
        </div>
      </div>
      <Field
        as="select"
        className="block w-full rounded-md border-0 py-1.5 pl-2 shadow-sm ring-1 ring-inset focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white"
        onChange={(e) => handleProductChange(e.target.value)}
      >
        <option value="" label={`Select a product`} />
        {fetch ? (
          <LoadingHV />
        ) : (
          <>
            {filteredProducts?.map((item) => (
              <option key={item?._id} value={JSON.stringify(item)}>
                {item?.name}
              </option>
            ))}
          </>
        )}
      </Field>
    </div>
  );
};

export default SelectProductDropDown;
