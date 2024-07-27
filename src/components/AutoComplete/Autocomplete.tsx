import React, {FC,useState,ChangeEvent ,ReactElement} from 'react'
import Input,{InputProps} from '../Input/input'

interface DataSourceObject {
    value: string;
  }
export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompletProps extends Omit<InputProps,'onSelect'> {
    fetchSuggestions: (string: string) => DataSourceType[];
    onSelect?: (item: DataSourceType) => void;
    renderOption?: (item: DataSourceType) => ReactElement;
}

export const AutoComplete: FC<AutoCompletProps> = (props) => {
    const {value,fetchSuggestions,onSelect,renderOption,...restprops} = props;

    const [inputValue,setInputValue] = useState(value);
    const [suggestions,setSuggestions] = useState<DataSourceType[]>([]);

    const handleSelect = (item:DataSourceType) => {
        setInputValue(item.value);
        setSuggestions([]);
        if (onSelect){
            onSelect(item);
        }
    }
    const generateDropdown = () => {
        return (
            <ul>
                {suggestions.map((item,index)=>(
                    <li key={index} onClick={()=>handleSelect(item)}>{renderOption ? renderOption(item) : item.value}
                    </li>
                ))}
            </ul>
        )
    };
    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const value= e.target.value.trim();
        setInputValue(value)
        if (value){
            const results = fetchSuggestions(value);
            setSuggestions(results);
        }else{
            setSuggestions([]);
        }
        
    };

    return (
        <div className='viking-auto-complete'>
            <Input {...restprops} value={inputValue} onChange={handleChange}/>
            {suggestions.length>0 && generateDropdown()}
        </div>
    )
}

export default AutoComplete