import Input from "../common/Input";

function SearchBar({ value, onChange }) {
  return (
    <Input
      id="studentSearch"
      label="Search Students"
      type="text"
      value={value}
      placeholder="Search by name, email, course, or age"
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default SearchBar;
