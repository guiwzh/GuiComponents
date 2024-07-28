import React, {FC,useState,ChangeEvent ,ReactElement, useEffect} from 'react'
import Input,{InputProps} from '../Input/input'
import Icon from '../Icon/icon';
import useDebounce from '../../hooks/useDebounce';
import classNames from 'classnames';
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
    const [highlightIndex,sethighlightIndex]= useState(-1);

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
            sethighlightIndex(-1);
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
    const highlight = (index:number) => {
        if(index<0) index=0
        if(index>suggestions.length-1) index=suggestions.length-1
        sethighlightIndex(index);
    }
    const handleKeyDown = (e:React.KeyboardEvent<HTMLInputElement>) => {
         switch(e.key){
            case 'Enter':
                if (suggestions[highlightIndex]){
                    handleSelect(suggestions[highlightIndex])
                }
                break
            case 'ArrowDown':
                highlight(highlightIndex+1)
                break
            case 'ArrowUp':
                highlight(highlightIndex-1)
                break
            case 'Escape':
                setSuggestions([])
                break
            default:
                break
         }
    }
    const generateDropdown = () => {
        return (
            <ul>
                {suggestions.map((item,index)=>{
                    const cnames= classNames('suggestion-item',{
                        'item-highlighted':index===highlightIndex
                    })
                    return (
                        <li key={index} 
                            onClick={()=>handleSelect(item)}
                            className={cnames}
                        >
                        {renderOption ? renderOption(item) : item.value}
                        </li>
                    )
                }
                )}
            </ul>
        )
    };
    const handleChange = async (e:ChangeEvent<HTMLInputElement>)=>{
        const value= e.target.value.trim();
        setInputValue(value)
    };

    return (
        <div className='viking-auto-complete'>
            <Input 
                value={inputValue} 
                onChange={handleChange}
                {...restprops}
                onKeyDown={handleKeyDown}//阻止默认的回车事件   
            />
            {loading && <ul><Icon icon="spinner" spin></Icon>loading...</ul>}
            {suggestions.length>0 && generateDropdown()}
        </div>
    )
}

export default AutoComplete