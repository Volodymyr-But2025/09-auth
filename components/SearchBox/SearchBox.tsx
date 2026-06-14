import css from "./SearchBox.module.css";

interface SearchBoxProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const SearchBox = ({
  onChange,
}: SearchBoxProps) => {
  return (
    <div className={css.searchBox}>
      <input
        className={css.input}
        onChange={onChange}
        type="text"
        placeholder="Search notes"
      />
    </div>
  );
};
export default SearchBox;
