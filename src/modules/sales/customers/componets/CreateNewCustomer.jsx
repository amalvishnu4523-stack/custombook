import { useState } from "react";

const CreateNewCustomer = () => {
  const [activeTab, setActiveTab] = useState("other");

  const [formData, setFormData] = useState({
    customerType: "business",

    salutation: "",
    firstName: "",
    lastName: "",

    companyName: "",
    displayName: "",
    email: "",

    workPhoneCode: "+91",
    workPhone: "",
    mobileCode: "+91",
    mobile: "",

    language: "English",

    pan: "",
    currency: "INR",
    receivableAccount: "",
    openingBalance: "",
    paymentTerms: "Due on Receipt",

    portalAccess: false,

    documents: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDocuments = (e) => {
    const files = Array.from(e.target.files || []);

    setFormData((prev) => ({
      ...prev,
      documents: files,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Customer Data:", formData);
  };

  const tabs = [
    {
      id: "other",
      label: "Other Details",
    },
    {
      id: "address",
      label: "Address",
    },
    {
      id: "contacts",
      label: "Contact Persons",
    },
    {
      id: "custom",
      label: "Custom Fields",
    },
    {
      id: "reporting",
      label: "Reporting Tags",
    },
    {
      id: "remarks",
      label: "Remarks",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-7xl"
      >
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Create Customer
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Add customer information, contact details and account settings.
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
              className="rounded-lg bg-blue-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
            >
              Save Customer
            </button>
          </div>
        </div>

        {/* =====================================================
            CUSTOMER TYPE
        ====================================================== */}

        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer Type
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select whether this customer is a business or individual.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Business */}
            <label
              className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                formData.customerType === "business"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="customerType"
                value="business"
                checked={formData.customerType === "business"}
                onChange={handleChange}
                className="h-5 w-5 accent-blue-500"
              />

              <div>
                <p className="font-medium text-gray-900">
                  Business
                </p>

                <p className="text-sm text-gray-500">
                  Customer is a company or organization
                </p>
              </div>
            </label>

            {/* Individual */}
            <label
              className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                formData.customerType === "individual"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="customerType"
                value="individual"
                checked={formData.customerType === "individual"}
                onChange={handleChange}
                className="h-5 w-5 accent-blue-500"
              />

              <div>
                <p className="font-medium text-gray-900">
                  Individual
                </p>

                <p className="text-sm text-gray-500">
                  Customer is an individual person
                </p>
              </div>
            </label>
          </div>
        </section>

        {/* =====================================================
            BASIC CUSTOMER INFORMATION
        ====================================================== */}

        <section className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="text-lg font-semibold text-gray-900">
              Customer Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Enter the customer's basic information.
            </p>
          </div>

          <div className="grid gap-6 p-6 lg:grid-cols-2">
            {/* Primary Contact */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Primary Contact
              </label>

              <div className="grid gap-3 sm:grid-cols-[150px_1fr_1fr]">
                <select
                  name="salutation"
                  value={formData.salutation}
                  onChange={handleChange}
                  className="h-12 rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Salutation</option>
                  <option value="Mr">Mr.</option>
                  <option value="Mrs">Mrs.</option>
                  <option value="Ms">Ms.</option>
                  <option value="Dr">Dr.</option>
                </select>

                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="h-12 rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Company Name
              </label>

              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Enter company name"
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Display Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Display Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                placeholder="Enter display name"
                required
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="customer@example.com"
                className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            {/* Language */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Customer Language
              </label>

              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="English">English</option>
                <option value="Malayalam">Malayalam</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
              </select>
            </div>

            {/* Phone numbers */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Work */}
                <div className="flex">
                  <select
                    name="workPhoneCode"
                    value={formData.workPhoneCode}
                    onChange={handleChange}
                    className="h-12 w-24 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm outline-none"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>

                  <input
                    type="tel"
                    name="workPhone"
                    value={formData.workPhone}
                    onChange={handleChange}
                    placeholder="Work Phone"
                    className="h-12 w-full rounded-r-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* Mobile */}
                <div className="flex">
                  <select
                    name="mobileCode"
                    value={formData.mobileCode}
                    onChange={handleChange}
                    className="h-12 w-24 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm outline-none"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                  </select>

                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Mobile"
                    className="h-12 w-full rounded-r-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            TABS
        ====================================================== */}

        <div className="mb-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-6 py-4 text-sm font-medium transition ${
                  activeTab === tab.id
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.label}

                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* =====================================================
            OTHER DETAILS
        ====================================================== */}

        {activeTab === "other" && (
          <section className="mb-6 rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-6 py-5">
              <h2 className="text-lg font-semibold text-gray-900">
                Other Details
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Configure financial and account settings.
              </p>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2">
              {/* PAN */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  PAN
                </label>

                <input
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="Enter PAN number"
                  className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Currency
                </label>

                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="INR">
                    INR - Indian Rupee
                  </option>

                  <option value="USD">
                    USD - US Dollar
                  </option>

                  <option value="EUR">
                    EUR - Euro
                  </option>
                </select>
              </div>

              {/* Receivable */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Accounts Receivable
                </label>

                <select
                  name="receivableAccount"
                  value={formData.receivableAccount}
                  onChange={handleChange}
                  className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">
                    Select an account
                  </option>

                  <option value="accounts-receivable">
                    Accounts Receivable
                  </option>

                  <option value="customer-receivable">
                    Customer Receivable
                  </option>
                </select>
              </div>

              {/* Opening balance */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Opening Balance
                </label>

                <div className="flex">
                  <span className="flex h-12 items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-4 text-sm text-gray-600">
                    INR
                  </span>

                  <input
                    type="number"
                    name="openingBalance"
                    value={formData.openingBalance}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="h-12 w-full rounded-r-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Payment Terms */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Payment Terms
                </label>

                <select
                  name="paymentTerms"
                  value={formData.paymentTerms}
                  onChange={handleChange}
                  className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Due on Receipt">
                    Due on Receipt
                  </option>

                  <option value="Net 15">
                    Net 15
                  </option>

                  <option value="Net 30">
                    Net 30
                  </option>

                  <option value="Net 45">
                    Net 45
                  </option>

                  <option value="Net 60">
                    Net 60
                  </option>
                </select>
              </div>

              {/* Portal */}
              <div className="flex items-center rounded-xl border border-gray-200 p-4">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="portalAccess"
                    checked={formData.portalAccess}
                    onChange={handleChange}
                    className="mt-0.5 h-5 w-5 rounded accent-blue-500"
                  />

                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Enable Customer Portal
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      Allow portal access for this customer
                    </p>
                  </div>
                </label>
              </div>

              {/* Documents */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Documents
                </label>

                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 text-center transition hover:border-blue-400 hover:bg-blue-50">
                  <svg
                    className="mb-3 h-7 w-7 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M12 16V4m0 0L8 8m4-4l4 4M4 16v3a1 1 0 001 1h14a1 1 0 001-1v-3"
                    />
                  </svg>

                  <p className="text-sm font-medium text-gray-700">
                    Click to upload documents
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Maximum 10 files, 10MB each
                  </p>

                  <input
                    type="file"
                    multiple
                    onChange={handleDocuments}
                    className="hidden"
                  />
                </label>

                {/* Selected files */}
                {formData.documents.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {formData.documents.map((file, index) => (
                      <div
                        key={`${file.name}-${index}`}
                        className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3"
                      >
                        <span className="truncate text-sm text-gray-700">
                          {file.name}
                        </span>

                        <span className="ml-4 text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            ADDRESS
        ====================================================== */}

        {activeTab === "address" && (
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Address
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add billing and shipping address information.
            </p>

            <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
              <p className="text-sm text-gray-500">
                Address fields can be added here.
              </p>
            </div>
          </section>
        )}

        {/* =====================================================
            CONTACT PERSONS
        ====================================================== */}

        {activeTab === "contacts" && (
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Contact Persons
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add additional people associated with this customer.
            </p>

            <button
              type="button"
              className="mt-6 rounded-lg border border-blue-500 px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              + Add Contact Person
            </button>
          </section>
        )}

        {/* =====================================================
            CUSTOM FIELDS
        ====================================================== */}

        {activeTab === "custom" && (
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Custom Fields
            </h2>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Custom Field 1
                </label>

                <input
                  type="text"
                  placeholder="Enter value"
                  className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Custom Field 2
                </label>

                <input
                  type="text"
                  placeholder="Enter value"
                  className="h-12 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </section>
        )}

        {/* =====================================================
            REPORTING TAGS
        ====================================================== */}

        {activeTab === "reporting" && (
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Reporting Tags
            </h2>

            <div className="mt-6">
              <select className="h-12 w-full max-w-xl rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none focus:border-blue-500">
                <option>Select reporting tag</option>
                <option>Region</option>
                <option>Department</option>
                <option>Sales Team</option>
              </select>
            </div>
          </section>
        )}

        {/* =====================================================
            REMARKS
        ====================================================== */}

        {activeTab === "remarks" && (
          <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Remarks
            </h2>

            <textarea
              rows="6"
              placeholder="Enter any additional remarks..."
              className="mt-6 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </section>
        )}

        {/* =====================================================
            FOOTER ACTIONS
        ====================================================== */}

        <div className="mt-6 flex justify-end gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <button
            type="button"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-500 px-7 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
          >
            Save Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateNewCustomer;