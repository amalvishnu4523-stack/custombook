import { useState } from "react";

const CreateNewItem = () => {
  const [formData, setFormData] = useState({
    name: "",
    type: "goods",
    unit: "",
    sellingPrice: "",
    salesAccount: "Sales",
    salesDescription: "",
    costPrice: "",
    purchaseAccount: "Cost of Goods Sold",
    purchaseDescription: "",
    vendor: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Item Data:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-6xl"
      >
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create New Item
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Add a new product or service to your inventory.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Save Item
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <section className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the basic details of your item.
            </p>
          </div>

          <div className="grid gap-8 p-6 lg:grid-cols-[1fr_280px]">
            {/* Form fields */}
            <div className="grid gap-5 sm:grid-cols-2">
              {/* Name */}
              <div className="sm:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Item Name <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter item name"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Item Type
                </label>

             <div className="flex h-11 items-center gap-6 rounded-lg border border-gray-300 px-4">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="type"
                      value="goods"
                      checked={formData.type === "goods"}
                      onChange={handleChange}
                      className="h-4 w-4 accent-blue-500"
                    />
                    Goods
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="type"
                      value="service"
                      checked={formData.type === "service"}
                      onChange={handleChange}
                      className="h-4 w-4 accent-blue-500"
                    />
                    Service
                  </label>
                </div>
              </div>

              {/* Unit */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Unit
                </label>

                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Select unit</option>
                  <option value="pcs">Pieces</option>
                  <option value="kg">Kilogram</option>
                  <option value="box">Box</option>
                  <option value="meter">Meter</option>
                  <option value="liter">Liter</option>
                </select>
              </div>
            </div>

            {/* Image upload */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Item Image
              </label>

              <label className="flex h-52 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-5 text-center transition hover:border-blue-400 hover:bg-blue-50">
                {formData.image ? (
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {formData.image.name}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Image selected
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                      <svg
                        className="h-6 w-6 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.8"
                          d="M4 16l4-4a2 2 0 012.828 0L16 17m-2-2l1.172-1.172a2 2 0 012.828 0L20 15M14 8h.01M5 20h14a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v14a1 1 0 001 1z"
                        />
                      </svg>
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      Upload item image
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      PNG, JPG or WEBP
                    </p>
                  </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Sales Information */}
        <section className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-blue-500" />

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Sales Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configure how this item is sold.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            {/* Selling Price */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Selling Price <span className="text-red-500">*</span>
              </label>

              <div className="flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 text-sm text-gray-600">
                  INR
                </span>

                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-r-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Sales Account */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sales Account <span className="text-red-500">*</span>
              </label>

              <select
                name="salesAccount"
                value={formData.salesAccount}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Sales">Sales</option>
                <option value="Product Sales">Product Sales</option>
                <option value="Other Income">Other Income</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sales Description
              </label>

              <textarea
                name="salesDescription"
                value={formData.salesDescription}
                onChange={handleChange}
                rows="4"
                placeholder="Enter sales description..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </section>

        {/* Purchase Information */}
        <section className="mb-6 rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-blue-500" />

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Purchase Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Configure purchasing and vendor details.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            {/* Cost Price */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Cost Price <span className="text-red-500">*</span>
              </label>

              <div className="flex">
                <span className="flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 text-sm text-gray-600">
                  INR
                </span>

                <input
                  type="number"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full rounded-r-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Purchase Account */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Purchase Account <span className="text-red-500">*</span>
              </label>

              <select
                name="purchaseAccount"
                value={formData.purchaseAccount}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Cost of Goods Sold">
                  Cost of Goods Sold
                </option>
                <option value="Purchases">Purchases</option>
                <option value="Inventory">Inventory</option>
              </select>
            </div>

            {/* Purchase Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Purchase Description
              </label>

              <textarea
                name="purchaseDescription"
                value={formData.purchaseDescription}
                onChange={handleChange}
                rows="4"
                placeholder="Enter purchase description..."
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Vendor */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Preferred Vendor
              </label>

              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleChange}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select vendor</option>
                <option value="vendor1">Vendor 1</option>
                <option value="vendor2">Vendor 2</option>
                <option value="vendor3">Vendor 3</option>
              </select>
            </div>
          </div>
        </section>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-7 py-2.5 text-sm font-medium text-white hover:bg-blue-600"
          >
            Save Item
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewItem;