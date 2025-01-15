import React, { useState } from "react";
import Select from "react-select";

function Listings({ addToCart }: any) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const items = [
    { id: 1, name: "Cabinet With Doors", image: "https://via.placeholder.com/150", price: 250, category: "Furniture" },
    { id: 2, name: "Desk Tools", image: "https://via.placeholder.com/150", price: 89, category: "Accessories" },
    { id: 3, name: "Conference Chair", image: "https://via.placeholder.com/150", price: 349, category: "Furniture" },
    { id: 4, name: "Bloc Screens", image: "https://via.placeholder.com/150", price: 130, category: "Accessories" },
    { id: 5, name: "Standing Desk", image: "https://via.placeholder.com/150", price: 499, category: "Furniture" },
    { id: 6, name: "Keyboard", image: "https://via.placeholder.com/150", price: 129, category: "Accessories" },
    { id: 7, name: "LED Monitor", image: "https://via.placeholder.com/150", price: 299, category: "Electronics" },
    { id: 8, name: "Office Chair", image: "https://via.placeholder.com/150", price: 199, category: "Furniture" },
    { id: 9, name: "Wireless Mouse", image: "https://via.placeholder.com/150", price: 49, category: "Electronics" },
    { id: 10, name: "Bookshelf", image: "https://via.placeholder.com/150", price: 150, category: "Furniture" },
    { id: 11, name: "Table Lamp", image: "https://via.placeholder.com/150", price: 75, category: "Accessories" },
    { id: 12, name: "File Cabinet", image: "https://via.placeholder.com/150", price: 220, category: "Furniture" },
    { id: 13, name: "Smartphone Stand", image: "https://via.placeholder.com/150", price: 35, category: "Accessories" },
    { id: 14, name: "Noise-Cancelling Headphones", image: "https://via.placeholder.com/150", price: 150, category: "Electronics" },
    { id: 15, name: "Desk Organizer", image: "https://via.placeholder.com/150", price: 60, category: "Accessories" },
    { id: 16, name: "Ergonomic Mouse Pad", image: "https://via.placeholder.com/150", price: 20, category: "Accessories" },
    { id: 17, name: "Projector", image: "https://via.placeholder.com/150", price: 550, category: "Electronics" },
    { id: 18, name: "Whiteboard", image: "https://via.placeholder.com/150", price: 120, category: "Accessories" },
    { id: 19, name: "Printer", image: "https://via.placeholder.com/150", price: 350, category: "Electronics" },
    { id: 20, name: "Filing Tray", image: "https://via.placeholder.com/150", price: 45, category: "Accessories" },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || item.category === category)
  );

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "Furniture", label: "Furniture" },
    { value: "Accessories", label: "Accessories" },
    { value: "Electronics", label: "Electronics" },
  ];

  const handleCategoryChange = (selectedOption: any) => {
    setCategory(selectedOption ? selectedOption.value : "");
  };

  return (
    <div className="h-[750px] overflow-y-scroll">
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search items..."
          className="border p-2 rounded-md w-full sm:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          options={categoryOptions}
          value={categoryOptions.find((option) => option.value === category)}
          onChange={handleCategoryChange}
          placeholder="Select Category"
          className="w-full sm:w-1/4"
          styles={{
            control: (base) => ({
              ...base,
              borderColor: "#d1d5db",
              boxShadow: "none",
              "&:hover": {
                borderColor: "#1e40af",
              },
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? "#1e40af" : "white",
              color: state.isFocused ? "white" : "black",
            }),
          }}
          isClearable
        />
      </div>

      <div className="grid grid-cols-5 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => addToCart(item)}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <img src={item.image} alt={item.name} className="w-full h-40 object-cover" />
            <div className="p-2">
              <h3 className="text-sm font-semibold mb-2">{item.name}</h3>
              <h3 className="text-sm font-semibold text-blue-800">{item.price} MAD</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Listings;