import React, {FC,useState,ChangeEvent ,ReactElement, useEffect} from 'react'
import Input,{InputProps} from '../Input/input'
import Icon from '../Icon/icon';
import useDebounce from '../../hooks/useDebounce';

interface DataSourceObject {
    value: string;
  }
export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompletProps extends Omit<InputProps,'onSelect'> {
    fetchSuggestions: (string: string) => DataSourceType[] | Promise<DataSourceType[]>;
    onSelect?: (item: DataSourceType) => void;
    renderOption?: (item: DataSourceType) => ReactElement;
}

export const AutoComplete: FC<AutoCompletProps> = (props) => {
    const {value,fetchSuggestions,onSelect,renderOption,...restprops} = props;

    const [inputValue,setInputValue] = useState(value as string);
    const [suggestions,setSuggestions] = useState<DataSourceType[]>([]);
    const [loading, setloading] = useState(false);
    const debouncedValue = useDebounce(inputValue,500);//使用该钩子函数，将inputValue的值进行防抖处理
    useEffect(()=>{
        async function fetchData(){
            if (debouncedValue){
                setloading(true)
                try{
                    const results = await fetchSuggestions(debouncedValue);
                    setloading(false)
                    setSuggestions(results);
                }catch (e){
                    alert(e)
                    setloading(false)
                }
            }else{
                setSuggestions([]);
            }
        }
        fetchData();
    },[debouncedValue])
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
                {suggestions?.map((item,index)=>(
                    <li key={index} onClick={()=>handleSelect(item)}>{renderOption ? renderOption(item) : item.value}
                    </li>
                ))}
            </ul>
        )
    };
    const handleChange = async (e:ChangeEvent<HTMLInputElement>)=>{
        const value= e.target.value.trim();
        setInputValue(value)
    };

    return (
        <div className='viking-auto-complete'>
            <Input {...restprops} value={inputValue} onChange={handleChange}/>
            {loading && <ul><Icon icon="spinner" spin></Icon>loading...</ul>}
            {suggestions.length>0 && generateDropdown()}
        </div>
    )
}

export default AutoComplete