import { Checkbox, Input } from "antd";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const BrandFilter = ({ activeBrands, selectedBrands, handleBrandChange }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredBrands = activeBrands?.filter((brand) =>
    brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
      <label className="block mb-2 font-semibold text-center text-white bg-black rounded sticky top-0 z-10">
        Brands
      </label>

      <Input
        placeholder="Search brand..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2 sticky top-8 z-10"
        prefix={<FaSearch />}
        allowClear
      />

      <Checkbox.Group value={selectedBrands} onChange={handleBrandChange}>
        <div className="grid">
          {filteredBrands?.map((brand) => {
            return (
              <Checkbox
                key={brand.name}
                value={brand.name}
                className="px-3 py-2 rounded-lg transition text-sm w-full font-medium"
              >
                {brand.name}
              </Checkbox>
            );
          })}
        </div>
      </Checkbox.Group>
    </div>
  );
};

export default BrandFilter;
