import React, {FC,useState,ChangeEvent ,ReactElement, useEffect, useRef, FocusEventHandler} from 'react'
import Input,{InputProps} from '../Input/input'
import Icon from '../Icon/icon';
import useDebounce from '../../hooks/useDebounce';
import classNames from 'classnames';
import useClickOutside from '../../hooks/useClickOutside';
interface DataSourceObject {
    value: string;
  }
export type DataSourceType<T = {}> = T & DataSourceObject

export interface AutoCompletProps extends Omit<InputProps,'onSelect'> {
    fetchSuggestions: (string: string) => DataSourceType[] | Promise<DataSourceType[]> |undefined;
    onSelect?: (item: DataSourceType) => void;
    renderOption?: (item: DataSourceType) => ReactElement;
}

export const AutoComplete: FC<AutoCompletProps> = (props) => {
    const {value,fetchSuggestions,onSelect,renderOption,style,...restprops} = props;

    const [inputValue,setInputValue] = useState(value as string);
    const [suggestions,setSuggestions] = useState<DataSourceType[]>([]);
    const [loading, setloading] = useState(false);
    const [highlightIndex,sethighlightIndex]= useState(-1);
    const [isFocus,setisFocus] = useState(true);


    const componentRef = useRef<HTMLDivElement>(null);
    const triggerSearch = useRef(false);//解决select后，再次触发fetchsuggestion的问题
    const fetchId = useRef(0);//解决竞态问题
    const debouncedValue = useDebounce(inputValue,1000);//使用该hooks，将inputValue的值进行防抖处理
    useClickOutside(componentRef,()=>{setisFocus(false)});//使用该hooks，使得点击组件外部时，将suggestions清空
    useEffect(()=>{
        async function fetchData(){
           
            if (triggerSearch.current){
                fetchId.current++;
                if(debouncedValue){
                    const Id=fetchId.current;
                    setloading(true)
                    setSuggestions([])
                    try{
                        const results = await fetchSuggestions(debouncedValue);
                        
                        if( Id === fetchId.current && results){
                            setloading(false)
                            setSuggestions(results)
                        }
                    }catch (e){
                        alert(e)
                        setloading(false)
                        setSuggestions([])
                       
                    }
                }else{
                    setloading(false)
                    setSuggestions([])
                    
                }
            }
        }
        fetchData()
        sethighlightIndex(-1)
    },[debouncedValue])

    const handleChange = (e:ChangeEvent<HTMLInputElement>)=>{
        const value= e.target.value.trim();
        setInputValue(value)
        triggerSearch.current=true
    };

    const handleSelect = (item:DataSourceType) => {
        setInputValue(item.value);
        setSuggestions([]);
        if (onSelect){
            onSelect(item);
        }
        triggerSearch.current=false
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
    const handleFocus = (e:any) => {
        setisFocus(true)
    }
    const generateDropdown = () => {
        return (
            <ul className="viking-suggestion-list">
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
    return (
        <div className='viking-auto-complete' style={style} ref={componentRef}>
            <Input 
                value={inputValue} 
                onChange={handleChange}
                {...restprops}
                onKeyDown={handleKeyDown} 
                onFocus={handleFocus}
            />
            {isFocus && loading && <ul><Icon icon="spinner" spin></Icon>loading...</ul>}
            {isFocus && suggestions.length>0 && generateDropdown()}
        </div>
    )
}

export default AutoComplete