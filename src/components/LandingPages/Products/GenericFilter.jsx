import { Checkbox, Input } from "antd";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const GenericFilter = ({
  activeGenerics,
  selectedGenerics,
  handleGenericChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGenerics = activeGenerics?.filter((generic) =>
    generic.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-6 border p-5 rounded-xl max-h-[500px] overflow-y-auto">
      <label className="block mb-2 font-semibold text-center text-white bg-black rounded sticky top-0 z-10">
        Generics
      </label>

      <Input
        placeholder="Search generic..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-2 sticky top-8 z-10"
        prefix={<FaSearch />}
        allowClear
      />

      <Checkbox.Group value={selectedGenerics} onChange={handleGenericChange}>
        <div className="grid">
          {filteredGenerics?.map((generic) => {
            return (
              <Checkbox
                key={generic.name}
                value={generic.name}
                className="px-3 py-2 rounded-lg transition text-sm w-full font-medium"
              >
                {generic.name}
              </Checkbox>
            );
          })}
        </div>
      </Checkbox.Group>
    </div>
  );
};

export default GenericFilter;
