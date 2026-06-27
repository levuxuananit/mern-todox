import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { options } from "@/lib/data";

const DataTimeFilter = ({ dateQuery, setDateQuery }) => {
  const currentLabel = dateQuery
    ? options.find((option) => option.value === dateQuery)?.label
    : options[0]?.label;
  return (
    <Combobox
      value={dateQuery || options[0]?.value}
      onValueChange={setDateQuery}
      items={options}
    >
      <ComboboxInput
        placeholder="Lọc theo"
        value={currentLabel}
        className="bg-gradient-card shadow-custom-md"
        readOnly={true}
      />
      <ComboboxContent>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item.value} value={item.value}>
              {item.label}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
};

export default DataTimeFilter;
