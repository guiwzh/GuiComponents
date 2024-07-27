import React, {FC,useState,ChangeEvent ,ReactElement} from 'react'
import Input,{InputProps} from '../Input/input'


export interface AutoCompletProps extends Omit<InputProps,'onSelect'> {
    fetchSuggestions: (string: string) => string[];
    onSelect?: (item: string) => void;
    renderOption?: (item: string) => ReactElement;
}

export const AutoComplete: FC<AutoCompletProps> = (props) => {
    const {value,fetchSuggestions,onSelect,renderOption,...restprops} = props;

    const [inputValue,setInputValue] = useState(value);
    const [suggestions,setSuggestions] = useState<string[]>([]);

    const handleSelect = (item:string) => {
        setInputValue(item);
        setSuggestions([]);
        if (onSelect){
            onSelect(item);
        }
    }
    const generateDropdown = () => {
        return (
            <ul>
                {suggestions.map((item,index)=>(
                    <li key={index} onClick={()=>handleSelect(item)}>{renderOption ? renderOption(item) : item}
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
        <div>
            <Input {...restprops} value={inputValue} onChange={handleChange}/>
            {suggestions.length>0 && generateDropdown()}
        </div>
    )
}

export default AutoComplete